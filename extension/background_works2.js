const cache = {};
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