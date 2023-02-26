import Parser from '@/libs/parser';

console.warn('Content script..');
let port;
function connect() {
  port = chrome.runtime.connect({ name: 'favbox' });
  port.onDisconnect.addListener(connect);
  port.onMessage.addListener((msg) => {
    console.log('received', msg, 'from bg');
  });
}
try {
  connect();
  const parser = new Parser(document.location.href, document);
  const pageInfo = parser.getFullPageInfo();
  port.postMessage({ action: 'cache', data: pageInfo });
} catch (e) {
  console.error('Content script error', e);
}
