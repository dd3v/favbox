let port;
/**
 *
 */
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
    const headElement = document.head;
    const headHTML = headElement ? headElement.outerHTML : '';
    const completeHTML = `<!DOCTYPE html><html>${headHTML}<body></body></html>`;
    sendResponse({ html: completeHTML });
  }
});

console.log('</> Content script loaded');
