/* global chrome */
const BADGES = [
  { id: "pf-og",   file: "badges/party_plus_badge.png",   threshold: -1 }, // Always show
  { id: "pf-300",  file: "badges/mission_control_badge.png", threshold: 3 },
  { id: "pf-hack", file: "badges/hack_olympics_badge.png",   threshold: 5 }
];

// ---- Utilities ----
const blobCache = {};

async function getBlobUrl(path) {
  if (blobCache[path]) return blobCache[path];
  
  try {
    // Try getting from background first
    console.log(`📡 [getBlobUrl] Trying background script for: ${path}`);
    const bgUrl = await askBg(path);
    if (bgUrl) {
      blobCache[path] = bgUrl;
      return bgUrl;
    }
  } catch (e) {
    console.log('⚠️ [getBlobUrl] Background script failed, trying direct fetch');
  }
  
  // Fallback: try direct fetch
  try {
    const url = chrome.runtime.getURL(path);
    console.log(`🔍 [getBlobUrl] Direct fetch from: ${url}`);
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    blobCache[path] = blobUrl;
    console.log(`✅ [getBlobUrl] Created blob URL directly: ${blobUrl}`);
    return blobUrl;
  } catch (err) {
    console.error(`❌ [getBlobUrl] Failed to create blob URL:`, err);
    return null;
  }
}

function askBg(path) {
  console.log(`📡 [askBg] Sending message to background for: ${path}`);
  return new Promise(res => {
    // Add timeout
    const timeout = setTimeout(() => {
      console.error('❌ [askBg] Timeout waiting for background response');
      res('');
    }, 5000);
    
    chrome.runtime.sendMessage({type:"getBadgeURL", path}, response => {
      clearTimeout(timeout);
      if (chrome.runtime.lastError) {
        console.error('❌ [askBg] Runtime error:', chrome.runtime.lastError);
        res(''); 
      } else {
        console.log('✅ [askBg] Got response:', response);
        res(response?.url || '');
      }
    });
  });
}

function storeAttendance(names) {
  if (!names.length) return;
  chrome.storage.local.get("attendance", data => {
    const counts = data.attendance || {};
    names.forEach(n => counts[n] = (counts[n] || 0) + 1);
    chrome.storage.local.set({attendance: counts});
  });
}

// ---- Event pages ----
function injectCSVButton() {
  if (!location.pathname.startsWith("/e/")) return;
  if (document.getElementById("pf-export-btn")) return;

  // Look for "Guest List" header or "View all" button
  const anchor = [...document.querySelectorAll("h3, span, button")].find(el => {
    const text = el.textContent?.trim();
    return text === "Guest List" || text === "View all" || /view all/i.test(text);
  });
  
  if (!anchor) return; // DOM not ready

  const btn = document.createElement("button");
  btn.id = "pf-export-btn";
  btn.textContent = "Export Guests CSV";
  btn.style.cssText = 
    "margin-left:12px;padding:6px 12px;background:#e71e62;color:#fff;" +
    "border:none;border-radius:20px;font-size:13px;cursor:pointer;";

  btn.onclick = () => {
    console.log("=== PARTIFUL GUEST EXTRACTOR ===");
    
    const names = new Set();
    
    // Method 1: Find guest containers by their repeating pattern
    // Based on your logs, these patterns contain profile elements
    const guestPatterns = [
      'div.ptf-9f66U.ptf-rUBD3',
      'div.ptf-l-IHmrl',
      'div.ptf-l-cxF6T'
    ];
    
    let guestElements = [];
    guestPatterns.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 5) {
        console.log(`Found ${elements.length} elements with pattern: ${selector}`);
        guestElements = [...guestElements, ...elements];
      }
    });
    
    // If no specific patterns found, look for repeated div patterns
    if (guestElements.length === 0) {
      // Find divs that appear in groups (likely guest list items)
      const allDivs = document.querySelectorAll('div[class]');
      const classGroups = {};
      
      allDivs.forEach(div => {
        const className = div.className;
        if (className && !className.includes('export')) {
          if (!classGroups[className]) classGroups[className] = [];
          classGroups[className].push(div);
        }
      });
      
      // Find groups with 10-100 items (likely guest lists)
      Object.entries(classGroups).forEach(([className, divs]) => {
        if (divs.length >= 10 && divs.length <= 100) {
          // Check if these contain profile images
          const hasProfiles = divs[0].querySelector('img[src*="profileImages"], img[src*="avatar"]');
          if (hasProfiles) {
            console.log(`Using pattern with ${divs.length} items: ${className}`);
            guestElements = divs;
          }
        }
      });
    }
    
    // Extract names from guest elements
    guestElements.forEach(element => {
      let name = null;
      
      // Strategy 1: Look for links within the element
      const link = element.querySelector('a');
      if (link && link.href) {
        // Check if it's a profile link
        if (link.href.includes('/u/')) {
          // Try to get text from the link or its children
          name = link.textContent?.trim();
          if (!name || name.length < 2) {
            // Look for text in spans within the link
            const spans = link.querySelectorAll('span');
            for (const span of spans) {
              const text = span.textContent?.trim();
              if (text && text.length > 1 && text.length < 50) {
                name = text;
                break;
              }
            }
          }
        }
      }
      
      // Strategy 2: Look for any text that looks like a name
      if (!name) {
        // Get all text nodes in the element
        const walker = document.createTreeWalker(
          element,
          NodeFilter.SHOW_TEXT,
          null,
          false
        );
        
        let node;
        while (node = walker.nextNode()) {
          const text = node.textContent?.trim();
          if (text && text.length > 1 && text.length < 50) {
            // Check if it looks like a name (not just initials or numbers)
            if (!/^[A-Z]{1,3}$/.test(text) && // Not just initials like "JH"
                !/^\d+$/.test(text) && // Not just numbers
                !/^[+]\d+$/.test(text) && // Not "+75" etc
                !['Going', 'Maybe', 'Invited'].includes(text)) {
              name = text;
              break;
            }
          }
        }
      }
      
      // Strategy 3: Check for profile image with nearby text
      if (!name) {
        const img = element.querySelector('img[src*="profileImages"], img[src*="avatar"]');
        if (img) {
          // Look for text after the image
          let nextElement = img.parentElement;
          while (nextElement && !name) {
            const siblings = [...nextElement.parentElement?.children || []];
            const imgIndex = siblings.indexOf(nextElement);
            
            // Check next siblings
            for (let i = imgIndex + 1; i < siblings.length && i < imgIndex + 3; i++) {
              const sibling = siblings[i];
              const text = sibling?.textContent?.trim();
              if (text && text.length > 2 && text.length < 50 && !/^[A-Z]{1,3}$/.test(text)) {
                name = text;
                break;
              }
            }
            nextElement = nextElement.parentElement;
          }
        }
      }
      
      if (name) {
        // Clean up the name
        name = name.split('\n')[0].trim(); // Take first line only
        names.add(name);
      }
    });
    
    // If still no names, try a more aggressive approach
    if (names.size === 0) {
      console.log("Trying aggressive approach...");
      
      // Find all text elements near profile images
      const profileImages = document.querySelectorAll('img[src*="profileImages"], img[src*="avatar"]');
      profileImages.forEach(img => {
        // Go up a few levels and look for text
        let parent = img.parentElement;
        for (let i = 0; i < 4 && parent; i++) {
          const texts = [];
          const walker = document.createTreeWalker(
            parent,
            NodeFilter.SHOW_TEXT,
            null,
            false
          );
          
          let node;
          while (node = walker.nextNode()) {
            const text = node.textContent?.trim();
            if (text && text.length > 2 && text.length < 50) {
              texts.push(text);
            }
          }
          
          // Find the most name-like text
          const possibleName = texts.find(text => 
            !/^[A-Z]{1,3}$/.test(text) && // Not initials
            !/^\d+$/.test(text) && // Not numbers
            !/^[+]/.test(text) && // Not "+X"
            !['Going', 'Maybe', 'Invited', 'View all', 'Guest List'].includes(text) &&
            text.split(' ').length <= 4 // Reasonable name length
          );
          
          if (possibleName) {
            names.add(possibleName);
            break;
          }
          
          parent = parent.parentElement;
        }
      });
    }
    
    // Convert to array and final cleanup
    const uniqueNames = [...names].filter(name => {
      const lower = name.toLowerCase();
      return name.length > 1 && 
             !['going', 'maybe', 'invited', 'view all', 'guest list', 'photo album', 
              'open invite', 'all hosts mutuals', 'export guests csv', 'create event',
              'help center', 'blog', 'farley\'s birthday party', 'hosted by'].includes(lower) &&
             !name.includes('🎉') &&
             !/^\d+$/.test(name);
    });
    
    console.log(`\n=== FINAL RESULT: ${uniqueNames.length} names found ===`);
    console.log(uniqueNames);
    
    if (!uniqueNames.length) {
      alert("No guests found. The page structure might be different than expected.\n\n" +
            "Try:\n" +
            "1. Making sure you're viewing the full guest list\n" +
            "2. Waiting a moment for the page to fully load\n" +
            "3. Checking the console for more details");
      return;
    }
    
    // Create proper CSV format
    const csvContent = "Name\n" + uniqueNames.join("\n");
    navigator.clipboard.writeText(csvContent)
      .then(() => alert(`✅ Success! Copied ${uniqueNames.length} guests to clipboard as CSV`))
      .catch(err => {
        console.error('Failed to copy:', err);
        alert("❌ Failed to copy to clipboard. Please check your browser permissions.");
      });
    
    storeAttendance(uniqueNames);
  };

  // React-safe insertion
  try {
    // Try multiple insertion methods
    if (anchor.parentNode) {
      // Method 1: Insert after with a small delay to avoid React conflicts
      setTimeout(() => {
        if (!document.getElementById("pf-export-btn")) {
          anchor.parentNode.insertBefore(btn, anchor.nextSibling);
        }
      }, 100);
    } else if (anchor.parentElement) {
      // Method 2: Use parentElement instead
      setTimeout(() => {
        if (!document.getElementById("pf-export-btn")) {
          anchor.parentElement.appendChild(btn);
        }
      }, 100);
    }
  } catch (e) {
    console.log("Button insertion failed, trying alternative method...");
    // Method 3: Insert at the end of the guest list header area
    const headerArea = document.querySelector('h3')?.parentElement;
    if (headerArea && !document.getElementById("pf-export-btn")) {
      headerArea.appendChild(btn);
    }
  }
}

// ---- Profile pages ----
async function injectProfileBadges() {
  console.log("🔍 [Badge Debug] Checking if on profile page...");
  if (!location.pathname.startsWith("/u/")) {
    console.log("❌ [Badge Debug] Not on profile page, skipping");
    return;
  }
  console.log("✅ [Badge Debug] On profile page:", location.pathname);
  
  // Try multiple selectors for the username
  const usernameSelectors = [
    'h1',
    'h2',
    'h3',
    '[class*="username"]',
    '[class*="profile-name"]',
    '[class*="user-name"]',
    '[class*="display-name"]',
    'main h1',
    'main h2',
    'div[class*="profile"] h1',
    'div[class*="profile"] h2'
  ];
  
  let usernameEl = null;
  let username = null;
  
  for (const selector of usernameSelectors) {
    const el = document.querySelector(selector);
    if (el && el.textContent?.trim()) {
      const text = el.textContent.trim();
      // Check if it looks like a name (not too long, not a number)
      if (text.length > 0 && text.length < 50 && !/^\d+$/.test(text)) {
        usernameEl = el;
        username = text;
        console.log(`✅ [Badge Debug] Found username "${username}" with selector: ${selector}`);
        break;
      }
    }
  }
  
  // If still no username, try looking for large text elements
  if (!username) {
    console.log("🔍 [Badge Debug] Trying to find username by text size...");
    const allElements = document.querySelectorAll('*');
    for (const el of allElements) {
      const style = window.getComputedStyle(el);
      const fontSize = parseInt(style.fontSize);
      if (fontSize >= 24 && el.textContent?.trim() && el.children.length === 0) {
        const text = el.textContent.trim();
        if (text.length > 0 && text.length < 50 && !/^\d+$/.test(text) && 
            !['Edit profile', 'Following', 'Followers'].includes(text)) {
          usernameEl = el;
          username = text;
          console.log(`✅ [Badge Debug] Found username "${username}" by font size: ${fontSize}px`);
          break;
        }
      }
    }
  }
  
  if (!username) {
    console.log("❌ [Badge Debug] No username element found");
    console.log("🔍 [Badge Debug] Page structure:");
    console.log("   - All h1 elements:", document.querySelectorAll('h1').length);
    console.log("   - All h2 elements:", document.querySelectorAll('h2').length);
    console.log("   - All h3 elements:", document.querySelectorAll('h3').length);
    
    // Log some large text elements for debugging
    document.querySelectorAll('*').forEach(el => {
      const style = window.getComputedStyle(el);
      const fontSize = parseInt(style.fontSize);
      if (fontSize >= 20 && el.textContent?.trim() && el.children.length === 0) {
        console.log(`   - Text (${fontSize}px): "${el.textContent.trim().substring(0, 30)}..."`);
      }
    });
    return;
  }
  
  console.log("✅ [Badge Debug] Found username:", username);

  chrome.storage.local.get("attendance", async data => {
    console.log("📊 [Badge Debug] Storage data:", data);
    const count = (data.attendance && data.attendance[username]) || 0;
    console.log("📊 [Badge Debug] Attendance count for", username, ":", count);
    
    // Look for the official badge with multiple selectors
    const badgeSelectors = [
      'img[src*="attended_dark_"]',
      'img[src*="attended"]',
      'img[src*="badge"]',
      'img[alt*="badge" i]',
      'img[alt*="attended" i]',
      'img[alt*="verified" i]',
      // Look for small images near the username
      usernameEl ? usernameEl.parentElement?.querySelector('img') : null
    ].filter(Boolean);
    
    let official = null;
    for (const selector of badgeSelectors) {
      if (typeof selector === 'string') {
        official = document.querySelector(selector);
      } else {
        official = selector;
      }
      if (official) {
        console.log("✅ [Badge Debug] Found official badge:", official.src);
        break;
      }
    }
    
    if (!official) {
      console.log("❌ [Badge Debug] No official badge found");
      console.log("🔍 [Badge Debug] All images on page:");
      document.querySelectorAll('img').forEach((img, i) => {
        if (img.width < 200 && img.height < 200) { // Only small images (likely badges)
          console.log(`   Image ${i}: src="${img.src}", alt="${img.alt}", size=${img.width}x${img.height}`);
        }
      });
      
      // For now, let's inject next to username anyway for debugging
      console.log("⚠️ [Badge Debug] Proceeding without official badge...");
    }

    let anchor = official || usernameEl;
    console.log("✅ [Badge Debug] Using anchor:", anchor);

    for (const cfg of BADGES) {
      console.log(`🔍 [Badge Debug] Checking badge ${cfg.id}: threshold=${cfg.threshold}, count=${count}`);
      
      if (count < cfg.threshold) {
        console.log(`❌ [Badge Debug] Count ${count} < threshold ${cfg.threshold}, skipping`);
        continue;
      }
      
      if (document.getElementById(cfg.id)) {
        console.log(`⚠️ [Badge Debug] Badge ${cfg.id} already exists`);
        continue;
      }
      
      try {
        console.log(`📡 [Badge Debug] Requesting blob URL for: ${cfg.file}`);
        const blobUrl = await getBlobUrl(cfg.file);
        
        if (!blobUrl) {
          console.log(`❌ [Badge Debug] No blob URL returned for ${cfg.file}`);
          continue;
        }
        
        console.log(`✅ [Badge Debug] Got blob URL:`, blobUrl);
        
        const img = document.createElement("img");
        img.id = cfg.id;
        img.src = blobUrl;
        img.alt = `Badge: ${cfg.id}`;
        img.style.cssText = "width:auto;height:100%;max-height:240px;margin-left:24px;vertical-align:middle;display:inline-block;";
        
        // Add error handling for image load
        img.onerror = () => {
          console.error(`❌ [Badge Debug] Failed to load image for ${cfg.id}`);
        };
        img.onload = () => {
          console.log(`✅ [Badge Debug] Successfully loaded image for ${cfg.id}`);
        };
        
        console.log(`🔍 [Badge Debug] Attempting to insert badge after:`, anchor);
        if (anchor && anchor.parentNode) {
          anchor.parentNode.insertBefore(img, anchor.nextSibling);
          console.log(`✅ [Badge Debug] Badge ${cfg.id} inserted!`);
          anchor = img; // Update anchor for next badge
        } else if (anchor && anchor.parentElement) {
          anchor.parentElement.appendChild(img);
          console.log(`✅ [Badge Debug] Badge ${cfg.id} appended!`);
          anchor = img;
        } else {
          console.error(`❌ [Badge Debug] No parent node for anchor`);
        }
      } catch (err) {
        console.error(`❌ [Badge Debug] Failed to inject badge ${cfg.id}:`, err);
      }
    }
    
    console.log("✅ [Badge Debug] Badge injection complete");
  });
}

// ---- Main driver ----
function main() {
  injectCSVButton();
  injectProfileBadges();
}

// Initial run
main();

// Retry mechanism for dynamic content with more aggressive retries
let tries = 40; // Increased from 60 to match your working code
const poll = setInterval(() => {
  main();
  if (--tries <= 0) clearInterval(poll);
}, 500); // Faster interval to match your working code

// Route change detection
let lastPath = location.pathname;
setInterval(() => {
  if (location.pathname !== lastPath) {
    lastPath = location.pathname;
    tries = 40; // Reset with more retries
    main();
  }
}, 500);

// Debug function - can be called from console
window.debugBadges = async () => {
  console.log("=== MANUAL BADGE DEBUG ===");
  
  // Test 1: Check if we can create blob URLs
  console.log("Test 1: Checking blob URL creation...");
  try {
    const testUrl = await askBg('badges/party_plus_badge.png');
    console.log("Blob URL test result:", testUrl);
  } catch (e) {
    console.error("Blob URL test failed:", e);
  }
  
  // Test 2: Check storage
  console.log("\nTest 2: Checking storage...");
  chrome.storage.local.get("attendance", (data) => {
    console.log("Storage contents:", data);
  });
  
  // Test 3: Try to inject a test badge
  console.log("\nTest 3: Attempting manual badge injection...");
  const h1 = document.querySelector('h1');
  if (h1) {
    const testImg = document.createElement('img');
    testImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    testImg.style.cssText = 'width:50px;height:50px;background:red;margin-left:10px;';
    testImg.alt = 'Test Badge';
    h1.parentNode.insertBefore(testImg, h1.nextSibling);
    console.log("Test badge injected (red square)");
  }
  
  // Test 4: Force run injectProfileBadges
  console.log("\nTest 4: Force running injectProfileBadges...");
  await injectProfileBadges();
};

// Add test attendance function
window.setTestAttendance = (username, count) => {
  chrome.storage.local.get("attendance", (data) => {
    const attendance = data.attendance || {};
    attendance[username] = count;
    chrome.storage.local.set({attendance}, () => {
      console.log(`✅ Set ${username} attendance to ${count}`);
      console.log("Storage updated:", attendance);
      // Re-run badge injection
      injectProfileBadges();
    });
  });
};

console.log("🚀 Partiful Helper loaded!");
console.log("Commands available:");
console.log("  - debugBadges() : Run debugging tests");
console.log("  - setTestAttendance('James Hennessy', 5) : Set test attendance");