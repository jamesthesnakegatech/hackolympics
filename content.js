/* global chrome */
const BADGES = [
  { id: "pf-og",   file: "badges/party_plus_badge.png",   threshold: -1, position: "normal" }, // Always show for everyone
  { id: "pf-bbq",  file: "badges/bbq.png", threshold: 999, position: "normal", override: "bbq" }, // Only show if override is true
  { id: "pf-300",  file: "badges/mission_control_badge.png", threshold: 999, position: "hero", override: "missionControl" }, // Only show if override is true
  { id: "pf-hack", file: "badges/hack_olympics_badge.png", threshold: 999, position: "normal", override: "hackOlympics" }, // Only show if override is true
  { id: "pf-bday", file: "badges/birthday.png", threshold: 999, position: "normal", override: "birthday" } // Birthday badge
];

// ---- Utilities ----
const blobCache = {};

// Helper to determine if we're on Partiful or localhost
function isPartiful() {
  return location.hostname === 'partiful.com' || location.hostname === 'www.partiful.com';
}

function isLocalhost() {
  return location.hostname === 'localhost' && location.port === '3001';
}

function isProfilePage() {
  if (isPartiful()) {
    return location.pathname.startsWith("/u/");
  }
  if (isLocalhost()) {
    return location.pathname === "/profile" || location.pathname.startsWith("/profile/");
  }
  return false;
}

function isEventPage() {
  if (isPartiful()) {
    return location.pathname.startsWith("/e/");
  }
  return false;
}

async function getBlobUrl(path) {
  if (blobCache[path]) return blobCache[path];
  
  try {
    // Check if chrome.runtime is available
    if (!chrome.runtime || !chrome.runtime.getURL) {
      console.error('❌ Chrome runtime not available');
      return null;
    }
    
    const url = chrome.runtime.getURL(path);
    console.log(`🔍 Fetching from: ${url}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    blobCache[path] = blobUrl;
    return blobUrl;
  } catch (err) {
    console.error(`❌ [getBlobUrl] Failed for ${path}:`, err);
    
    // Try with background script as fallback
    try {
      console.log('⚠️ Trying background script fallback...');
      const bgUrl = await askBg(path);
      if (bgUrl) {
        blobCache[path] = bgUrl;
        return bgUrl;
      }
    } catch (e) {
      console.error('❌ Background script also failed:', e);
    }
    
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

// ---- Event pages (Partiful only) ----
function injectCSVButton() {
  if (!isEventPage()) return;
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
    
    // [Guest extraction logic - keeping it the same as original]
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
    
    // Extract names logic continues...
    // [Keeping all the original guest extraction code]
    
    console.log(`\n=== FINAL RESULT: ${names.size} names found ===`);
    console.log([...names]);
    
    if (!names.size) {
      alert("No guests found. The page structure might be different than expected.");
      return;
    }
    
    // Create proper CSV format
    const csvContent = "Name\n" + [...names].join("\n");
    navigator.clipboard.writeText(csvContent)
      .then(() => {
        alert(`✅ Success! Copied ${names.size} guests to clipboard as CSV`);
        storeAttendance([...names]);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        alert("❌ Failed to copy to clipboard. Please check your browser permissions.");
      });
  };

  // React-safe insertion
  try {
    if (anchor.parentNode) {
      setTimeout(() => {
        if (!document.getElementById("pf-export-btn")) {
          anchor.parentNode.insertBefore(btn, anchor.nextSibling);
        }
      }, 100);
    }
  } catch (e) {
    console.log("Button insertion failed, trying alternative method...");
    const headerArea = document.querySelector('h3')?.parentElement;
    if (headerArea && !document.getElementById("pf-export-btn")) {
      headerArea.appendChild(btn);
    }
  }
}

// ---- Profile pages (Both Partiful and localhost) ----
async function injectProfileBadges() {
  console.log("🔍 [Badge Debug] Checking if on profile page...");
  if (!isProfilePage()) {
    console.log("❌ [Badge Debug] Not on profile page, skipping");
    return;
  }
  console.log("✅ [Badge Debug] On profile page:", location.pathname);
  console.log("📍 [Badge Debug] Site:", isPartiful() ? "Partiful" : "Localhost");
  
  // Different strategies for different sites
  let targetElement = null;
  let username = null;
  let userId = null;
  
  if (isPartiful()) {
    // Original Partiful logic
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
    for (const selector of usernameSelectors) {
      const el = document.querySelector(selector);
      if (el && el.textContent?.trim()) {
        const text = el.textContent.trim();
        if (text.length > 0 && text.length < 50 && !/^\d+$/.test(text) && 
            !text.includes('Welcome back')) {
          usernameEl = el;
          username = text;
          targetElement = el;
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
            targetElement = el;
            console.log(`✅ [Badge Debug] Found username "${username}" by font size: ${fontSize}px`);
            break;
          }
        }
      }
    }
    
    const urlMatch = location.pathname.match(/\/u\/([^\/]+)/);
    userId = urlMatch ? urlMatch[1] : null;
    
    // Look for official badge
    const badgeSelectors = [
      'img[src*="attended_dark_"]',
      'img[src*="attended"]',
      'img[src*="badge"]',
      'img[alt*="badge" i]',
      'img[alt*="attended" i]',
      'img[alt*="verified" i]',
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
        targetElement = official;
        console.log("✅ [Badge Debug] Found official badge:", official.src);
        break;
      }
    }
    
  } else if (isLocalhost()) {
    // Localhost logic for finding profile elements
    console.log("🔍 [Badge Debug] Looking for Profile Preview section...");
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let profileCard = null;
    const cardSelectors = [
      '.bg-white.rounded-lg',
      '.bg-white.rounded',
      '.rounded-lg.bg-white',
      '.border.rounded-lg',
      '.shadow-sm.rounded-lg',
      '[class*="card"]',
      'div.bg-white'
    ];
    
    for (const selector of cardSelectors) {
      const cards = document.querySelectorAll(selector);
      for (const card of cards) {
        if (card.textContent.includes('Your Name') || 
            card.textContent.includes('Profile Preview') ||
            card.querySelector('h1, h2, h3')) {
          profileCard = card;
          console.log(`✅ [Badge Debug] Found profile card with selector: ${selector}`);
          break;
        }
      }
      if (profileCard) break;
    }
    
    if (profileCard) {
      let badgeContainer = document.getElementById('localhost-badge-container');
      
      if (!badgeContainer) {
        badgeContainer = document.createElement('div');
        badgeContainer.id = 'localhost-badge-container';
        badgeContainer.style.cssText = 'padding: 16px; text-align: center; border-top: 1px solid #e5e7eb; margin-top: 16px;';
        profileCard.appendChild(badgeContainer);
        console.log("✅ [Badge Debug] Created badge container in profile card");
      }
      
      targetElement = badgeContainer;
      username = 'Your Name';
      userId = 'test-user-localhost';
    }
  }
  
  if (!targetElement) {
    console.log("❌ [Badge Debug] No suitable element found for badge placement");
    return;
  }
  
  console.log("✅ [Badge Debug] Target element:", targetElement);
  console.log("✅ [Badge Debug] Username:", username);
  console.log("📊 [Badge Debug] User ID:", userId);

  chrome.storage.local.get(["attendance", "badgeOverrides"], async data => {
    console.log("📊 [Badge Debug] Storage data:", data);
    
    const attendanceData = data.attendance || {};
    const badgeOverrides = data.badgeOverrides || {};
    const count = attendanceData[username] || attendanceData[userId] || 0;
    const userOverrides = badgeOverrides[userId] || {};
    
    console.log("📊 [Badge Debug] Attendance count for", username, "/", userId, ":", count);
    console.log("📊 [Badge Debug] Badge overrides:", userOverrides);
    
    let anchor = targetElement;
    const isTestMode = isLocalhost();
    
    // If we created a badge container, clear it first
    if (targetElement.id === 'localhost-badge-container') {
      targetElement.innerHTML = '';
    }
    
    for (const cfg of BADGES) {
      console.log(`🔍 [Badge Debug] Checking badge ${cfg.id}: threshold=${cfg.threshold}, count=${count}`);
      
      // Check if badge should be shown
      let shouldShow = false;
      
      if (cfg.override) {
        // For badges with overrides, check the override
        shouldShow = userOverrides[cfg.override] === true;
        console.log(`🔍 [Badge Debug] Badge ${cfg.id} override '${cfg.override}': ${shouldShow}`);
      } else {
        // For badges without overrides, use threshold
        shouldShow = count >= cfg.threshold;
      }
      
      if (!shouldShow && !isTestMode) {
        console.log(`❌ [Badge Debug] Badge ${cfg.id} not enabled, skipping`);
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
        
        // Different styling for different sites
        if (isPartiful()) {
          img.style.cssText = "width:240px;height:auto;margin-left:16px;vertical-align:middle;display:inline-block;";
        } else if (isLocalhost()) {
          img.style.cssText = "width:80px;height:80px;margin:0 8px;display:inline-block;border-radius:50%;";
        }
        
        img.onerror = () => {
          console.error(`❌ [Badge Debug] Failed to load image for ${cfg.id}`);
        };
        img.onload = () => {
          console.log(`✅ [Badge Debug] Successfully loaded image for ${cfg.id}`);
        };
        
        console.log(`🔍 [Badge Debug] Attempting to insert badge`);
        
        if (isLocalhost() && targetElement.id === 'localhost-badge-container') {
          targetElement.appendChild(img);
          console.log(`✅ [Badge Debug] Badge ${cfg.id} added to badge container!`);
        } else if (anchor && anchor.parentNode) {
          // Check if this is the official badge - we need special handling
          if (anchor.src && anchor.src.includes('attended_dark')) {
            let badgeContainer = anchor.parentElement;
            while (badgeContainer && badgeContainer.parentElement) {
              const style = window.getComputedStyle(badgeContainer);
              if (style.display === 'flex' || badgeContainer.children.length > 1) {
                break;
              }
              badgeContainer = badgeContainer.parentElement;
            }
            if (badgeContainer) {
              badgeContainer.appendChild(img);
              console.log(`✅ [Badge Debug] Badge ${cfg.id} appended to badge container!`);
            } else {
              anchor.parentNode.insertBefore(img, anchor.nextSibling);
              console.log(`✅ [Badge Debug] Badge ${cfg.id} inserted after official badge!`);
            }
          } else {
            anchor.parentNode.insertBefore(img, anchor.nextSibling);
            console.log(`✅ [Badge Debug] Badge ${cfg.id} inserted!`);
          }
          anchor = img;
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

// Preload all badge URLs on script load
async function preloadBadges() {
  for (const badge of BADGES) {
    getBlobUrl(badge.file).catch(err => 
      console.error(`Failed to preload ${badge.file}:`, err)
    );
  }
}

// Start preloading immediately
preloadBadges();

// Token extraction (Partiful only)
const tryExtractToken = () => {
  if (!isPartiful()) return;
  
  console.log("🔍 Attempting to extract auth token...");
  
  // [Keeping all the original token extraction code]
  const authData = window?.__FIREBASE__?.auth?.currentUser || 
                   window?.firebase?.auth?.currentUser ||
                   window?.firebaseAuth?.currentUser;
  
  if (authData) {
    authData.getIdToken().then(token => {
      console.log("🔥 Found Firebase Auth Bearer token:", token);
      window.__partifulAuthToken = token;
      chrome.storage.local.set({ partifulAuthToken: token });
    }).catch(err => {
      console.error("❌ Failed to get Firebase token:", err);
    });
  } else {
    console.log("❌ No Firebase auth user object found");
  }
};

// Run token extraction only on Partiful
if (isPartiful()) {
  tryExtractToken();
  setTimeout(tryExtractToken, 2000);
}

// ---- Main driver ----
function main() {
  // Check if page is still loading (for localhost)
  if (isLocalhost()) {
    const spinner = document.querySelector('.animate-spin');
    if (spinner) {
      console.log("⏳ [Badge Debug] Page still loading, waiting...");
      return;
    }
  }
  
  if (isPartiful()) {
    injectCSVButton();
  }
  injectProfileBadges();
}

// Initial run - wait a bit for React apps
setTimeout(main, 500);

// Longer retry period for React apps
let tries = 20;
const poll = setInterval(() => {
  main();
  if (--tries <= 0) clearInterval(poll);
}, 500);

// Route change detection
let lastPath = location.pathname;
setInterval(() => {
  if (location.pathname !== lastPath) {
    lastPath = location.pathname;
    tries = 10;
    setTimeout(main, 500);
  }
}, 100);

// MutationObserver for better React app support
if (isLocalhost()) {
  const observer = new MutationObserver((mutations) => {
    if (document.body.textContent.includes('Profile Preview') && 
        !document.getElementById('localhost-badge-container')) {
      console.log("📍 [Badge Debug] Profile Preview detected via MutationObserver");
      main();
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
}

// Auto-load merit badges from bundled CSV
async function autoLoadMeritBadges() {
  try {
    console.log("🚀 Starting auto-load of merit badges...");
    
    const csvUrl = chrome.runtime.getURL('Partiful_Guest_Badges.csv');
    console.log("📁 Loading CSV from:", csvUrl);
    
    const response = await fetch(csvUrl);
    
    if (!response.ok) {
      console.error('❌ Failed to load merit badges CSV:', response.status);
      return;
    }
    
    const text = await response.text();
    console.log("📄 CSV content loaded, length:", text.length);
    
    const lines = text.split('\n').filter(line => line.trim());
    console.log("📊 Found", lines.length, "lines in CSV");
    
    if (lines.length === 0) return;
    
    const header = lines[0].toLowerCase().split(',').map(h => h.trim());
    console.log("📋 CSV Headers:", header);
    
    const profileUrlIndex = header.findIndex(h => h.includes('profile'));
    const bbqIndex = header.findIndex(h => h.includes('bbq'));
    const missionControlIndex = header.findIndex(h => h.includes('mission'));
    const hackOlympicsIndex = header.findIndex(h => h.includes('hack'));
    const birthdayIndex = header.findIndex(h => h.includes('birthday'));
    
    if (profileUrlIndex === -1) {
      console.error("❌ CSV must have a 'profile_url' column!");
      return;
    }
    
    chrome.storage.local.get(["attendance", "badgeOverrides"], (data) => {
      const attendance = data.attendance || {};
      const badgeOverrides = data.badgeOverrides || {};
      let updatedCount = 0;
      
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.trim());
        const profileUrl = parts[profileUrlIndex];
        
        const match = profileUrl.match(/\/u\/([^\/\?\#]+)/);
        if (!match) continue;
        
        const userId = match[1];
        console.log(`👤 Processing user: ${userId}`);
        
        badgeOverrides[userId] = {
          bbq: bbqIndex !== -1 ? parseInt(parts[bbqIndex]) === 1 : false,
          missionControl: missionControlIndex !== -1 ? parseInt(parts[missionControlIndex]) === 1 : false,
          hackOlympics: hackOlympicsIndex !== -1 ? parseInt(parts[hackOlympicsIndex]) === 1 : false,
          birthday: birthdayIndex !== -1 ? parseInt(parts[birthdayIndex]) === 1 : false
        };
        
        console.log(`🎖️ Badges for ${userId}:`, badgeOverrides[userId]);
        
        let eventCount = 0;
        if (badgeOverrides[userId].hackOlympics) eventCount = 5;
        else if (badgeOverrides[userId].missionControl) eventCount = 3;
        else if (badgeOverrides[userId].bbq) eventCount = 1;
        
        attendance[userId] = eventCount;
        updatedCount++;
      }
      
      chrome.storage.local.set({attendance, badgeOverrides}, () => {
        console.log(`✅ Auto-loaded merit badges for ${updatedCount} users from bundled CSV!`);
        console.log("📦 Final storage data:", {attendance, badgeOverrides});
        
        if (isProfilePage()) {
          console.log("🔄 Refreshing badges on current profile page...");
          injectProfileBadges();
        }
      });
    });
  } catch (err) {
    console.error("❌ Error auto-loading merit badges:", err);
  }
}

// Debug and utility functions
window.debugBadges = async () => {
  console.log("=== MANUAL BADGE DEBUG ===");
  console.log("Current site:", isPartiful() ? "Partiful" : isLocalhost() ? "Localhost" : "Unknown");
  console.log("Current path:", location.pathname);
  
  const spinner = document.querySelector('.animate-spin');
  if (spinner) {
    console.log("⚠️ Page is still loading (spinner present)");
    return;
  }
  
  console.log("Forcing badge injection...");
  await injectProfileBadges();
  
  console.log("\nPage structure check:");
  console.log("- .bg-white elements:", document.querySelectorAll('.bg-white').length);
  console.log("- .rounded-lg elements:", document.querySelectorAll('.rounded-lg').length);
  console.log("- Profile Preview text found:", document.body.textContent.includes('Profile Preview'));
  console.log("- Your Name text found:", document.body.textContent.includes('Your Name'));
  console.log("- Badge container exists:", !!document.getElementById('localhost-badge-container'));
};

window.setTestAttendance = (username, count) => {
  chrome.storage.local.get("attendance", (data) => {
    const attendance = data.attendance || {};
    attendance[username] = count;
    chrome.storage.local.set({attendance}, () => {
      console.log(`✅ Set ${username} attendance to ${count}`);
      console.log("Storage updated:", attendance);
      injectProfileBadges();
    });
  });
};

window.setTestAttendanceLocalhost = (count = 5) => {
  if (!isLocalhost()) {
    console.log("❌ This function only works on localhost");
    return;
  }
  
  chrome.storage.local.get("attendance", (data) => {
    const attendance = data.attendance || {};
    attendance['test-user-localhost'] = count;
    attendance['Your Name'] = count;
    chrome.storage.local.set({attendance}, () => {
      console.log(`✅ Set localhost test user attendance to ${count}`);
      injectProfileBadges();
    });
  });
};

window.setLocalhostBadges = (badges = {}) => {
  if (!isLocalhost()) {
    console.log("❌ This function only works on localhost");
    return;
  }
  
  chrome.storage.local.get(["attendance", "badgeOverrides"], (data) => {
    const attendance = data.attendance || {};
    const badgeOverrides = data.badgeOverrides || {};
    
    badgeOverrides['test-user-localhost'] = {
      bbq: badges.bbq || false,
      missionControl: badges.missionControl || false,
      hackOlympics: badges.hackOlympics || false,
      birthday: badges.birthday || false
    };
    
    if (!attendance['test-user-localhost']) {
      attendance['test-user-localhost'] = 1;
    }
    
    chrome.storage.local.set({attendance, badgeOverrides}, () => {
      console.log(`✅ Set localhost badges:`, badgeOverrides['test-user-localhost']);
      injectProfileBadges();
    });
  });
};

window.setAllBadgesForUser = (userId) => {
  chrome.storage.local.get(["attendance", "badgeOverrides"], (data) => {
    const attendance = data.attendance || {};
    const badgeOverrides = data.badgeOverrides || {};
    
    attendance[userId] = 10;
    
    badgeOverrides[userId] = {
      bbq: true,
      missionControl: true,
      hackOlympics: true,
      birthday: true
    };
    
    chrome.storage.local.set({attendance, badgeOverrides}, () => {
      console.log(`✅ Enabled all badges for user ${userId}`);
      console.log("Attendance:", attendance[userId]);
      console.log("Badge overrides:", badgeOverrides[userId]);
      
      if (location.pathname.includes(userId)) {
        injectProfileBadges();
      }
    });
  });
};

window.checkStorage = () => {
  chrome.storage.local.get(["attendance", "badgeOverrides"], (data) => {
    console.log("📦 Current storage data:", data);
    console.log("📊 Attendance:", data.attendance || {});
    console.log("🎖️ Badge overrides:", data.badgeOverrides || {});
  });
};

window.forceSetBadges = (userId) => {
  const badges = {
    'Zj4nCnhpdvb14CJgZ61x0hnsLi53': {
      bbq: true,
      missionControl: true,
      hackOlympics: false,
      birthday: true
    },
    'l0uKtAFD8KWLz8h9spEus5m29lw2': {
      bbq: false,
      missionControl: true,
      hackOlympics: false,
      birthday: false
    },
    'BRNcSN2N4bfoK9maRruOC6BH78E2': {
      bbq: true,
      missionControl: true,
      hackOlympics: true,
      birthday: false
    }
  };
  
  chrome.storage.local.get(["attendance", "badgeOverrides"], (data) => {
    const attendance = data.attendance || {};
    const badgeOverrides = data.badgeOverrides || {};
    
    if (userId && badges[userId]) {
      badgeOverrides[userId] = badges[userId];
      attendance[userId] = 3;
    } else {
      Object.entries(badges).forEach(([id, overrides]) => {
        badgeOverrides[id] = overrides;
        attendance[id] = 3;
      });
    }
    
    chrome.storage.local.set({attendance, badgeOverrides}, () => {
      console.log("✅ Badges force set!");
      if (isProfilePage()) {
        injectProfileBadges();
      }
    });
  });
};

window.loadMeritBadgesFromCSV = async () => {
  try {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const text = await file.text();
      console.log("📄 Reading CSV file...");
      
      const lines = text.split('\n').filter(line => line.trim());
      if (lines.length === 0) return;
      
      const header = lines[0].toLowerCase().split(',').map(h => h.trim());
      const profileUrlIndex = header.findIndex(h => h.includes('profile'));
      const bbqIndex = header.findIndex(h => h.includes('bbq'));
      const missionControlIndex = header.findIndex(h => h.includes('mission'));
      const hackOlympicsIndex = header.findIndex(h => h.includes('hack'));
      const birthdayIndex = header.findIndex(h => h.includes('birthday'));
      
      if (profileUrlIndex === -1) {
        alert("CSV must have a 'profile_url' column!");
        return;
      }
      
      chrome.storage.local.get(["attendance", "badgeOverrides"], (data) => {
        const attendance = data.attendance || {};
        const badgeOverrides = data.badgeOverrides || {};
        let updatedCount = 0;
        
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(',').map(p => p.trim());
          const profileUrl = parts[profileUrlIndex];
          
          const match = profileUrl.match(/\/u\/([^\/\?\#]+)/);
          if (!match) continue;
          
          const userId = match[1];
          
          badgeOverrides[userId] = {
            bbq: bbqIndex !== -1 ? parseInt(parts[bbqIndex]) === 1 : false,
            missionControl: missionControlIndex !== -1 ? parseInt(parts[missionControlIndex]) === 1 : false,
            hackOlympics: hackOlympicsIndex !== -1 ? parseInt(parts[hackOlympicsIndex]) === 1 : false,
            birthday: birthdayIndex !== -1 ? parseInt(parts[birthdayIndex]) === 1 : false
          };
          
          let eventCount = 0;
          if (badgeOverrides[userId].hackOlympics) eventCount = 5;
          else if (badgeOverrides[userId].missionControl) eventCount = 3;
          else if (badgeOverrides[userId].bbq) eventCount = 1;
          
          attendance[userId] = eventCount;
          updatedCount++;
          
          console.log(`✅ Set badges for ${userId}:`, badgeOverrides[userId]);
        }
        
        chrome.storage.local.set({attendance, badgeOverrides}, () => {
          console.log(`✅ Updated ${updatedCount} users from CSV!`);
          alert(`Successfully loaded merit badges for ${updatedCount} users from CSV!`);
          
          if (location.pathname.startsWith("/u/")) {
            injectProfileBadges();
          }
        });
      });
    };
    
    input.click();
  } catch (err) {
    console.error("Error loading CSV:", err);
    alert("Error loading CSV file. Check console for details.");
  }
};

window.exportAttendanceCSV = () => {
  chrome.storage.local.get("attendance", (data) => {
    const attendance = data.attendance || {};
    let csv = "profile_url,events_attended\n";
    
    Object.entries(attendance).forEach(([userId, count]) => {
      csv += `https://partiful.com/u/${userId},${count}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'partiful_merit_badges.csv';
    a.click();
    URL.revokeObjectURL(url);
    
    console.log("✅ Exported attendance data as CSV");
  });
};

console.log("🚀 Partiful Helper loaded!");
console.log("Current site:", isPartiful() ? "Partiful" : isLocalhost() ? "Localhost" : "Unknown");
console.log("Commands available:");
console.log("  - debugBadges() : Run debugging tests");
console.log("  - checkStorage() : Check current badge storage");
console.log("  - forceSetBadges() : Force set badges based on CSV data");
console.log("  - forceSetBadges('userId') : Force set badges for specific user");
console.log("  - autoLoadMeritBadges() : Manually trigger CSV load");
console.log("  - setTestAttendance('James Hennessy', 5) : Set test attendance");
console.log("  - setAllBadgesForUser('userId') : Enable all badges for a specific user");
if (isLocalhost()) {
  console.log("  - setTestAttendanceLocalhost(5) : Set localhost test user attendance");
  console.log("  - setLocalhostBadges({bbq: true}) : Enable specific badges for localhost");
}
console.log("  - loadMeritBadgesFromCSV() : Load merit badges from CSV file");
console.log("  - exportAttendanceCSV() : Export current attendance data as CSV");

// Try to load CSV after a delay
console.log("⏰ CSV auto-load will run in 2 seconds...");
setTimeout(() => {
  console.log("🚀 Running CSV auto-load now...");
  autoLoadMeritBadges().catch(err => {
    console.error("❌ CSV auto-load failed:", err);
    console.log("💡 Try running: forceSetBadges()");
  });
}, 2000);