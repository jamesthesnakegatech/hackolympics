const cache = {};

// Intercept authorization headers
chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    const headers = details.requestHeaders;
    for (let header of headers) {
      if (header.name.toLowerCase() === 'authorization') {
        console.log("🎯 Caught token:", header.value);
        // Store token for potential use
        if (details.url.includes('partiful.com')) {
          chrome.storage.local.set({ partifulAuthToken: header.value });
        }
      }
    }
    return { requestHeaders: headers };
  },
  { urls: ["*://*.partiful.com/*"] },
  ["requestHeaders"]
);

// Handle blob URL requests from content script
chrome.runtime.onMessage.addListener((msg, src, reply) => {
  if (msg.type === 'getBadgeURL') {
    if (cache[msg.path]) return reply({url: cache[msg.path]});
    fetch(chrome.runtime.getURL(msg.path))
      .then(r=>r.blob())
      .then(b=>{
        const u = URL.createObjectURL(b);
        cache[msg.path] = u;
        reply({url: u});
      });
    return true;
  }
});