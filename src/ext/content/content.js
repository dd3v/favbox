let port;
function connect() {
  console.warn('Keep alive connection..');
  port = browser.runtime.connect({ name: 'favbox' });
  port.onDisconnect.addListener(connect);
  port.onMessage.addListener((msg) => {
    console.log('received', msg, 'from bg');
  });
  port.postMessage({ action: 'ping' });
}
try {
  connect();
} catch (e) {
  console.error('Content script error', e);
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getHTML') {
    sendResponse({ html: document.documentElement.outerHTML });
  }
});

console.log('</> Content script loaded');
