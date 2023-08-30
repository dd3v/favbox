let port;
function connect() {
  console.warn('Keep alive connection..');
  port = chrome.runtime.connect({ name: 'favbox' });
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

const container = document.createElement('div');
container.style.display = 'none';
container.style.position = 'fixed';
container.style.top = '50%';
container.style.left = '50%';
container.style.transform = 'translate(-50%, -50%)';
container.style.width = '80%';
container.style.height = '80%';
container.style.maxWidth = '1000px';
container.style.maxHeight = '1000px';
container.style.backgroundColor = '#fff';
container.style.zIndex = '10000';
container.style.borderRadius = '10px';
container.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
container.style.overflow = 'hidden';

const iframe = document.createElement('iframe');
iframe.src = chrome.runtime.getURL('/ext/browser/index.html');
iframe.style.width = '100%';
iframe.style.height = '100%';
iframe.style.border = 'none';

container.appendChild(iframe);

const backdrop = document.createElement('div');
backdrop.style.display = 'none';
backdrop.style.position = 'fixed';
backdrop.style.top = '0';
backdrop.style.left = '0';
backdrop.style.width = '100%';
backdrop.style.height = '100%';
backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
backdrop.style.zIndex = '9999';

backdrop.appendChild(container);

backdrop.addEventListener('click', () => {
  backdrop.style.display = 'none';
});

document.body.appendChild(backdrop);

const open = () => {
  backdrop.style.display = 'block';
  container.style.display = 'block';

  iframe.contentWindow.postMessage({ type: 'favbox', name: 'iframe' }, '*');
};

const close = () => {
  backdrop.style.display = 'none';
  container.style.display = 'none';
  document.activeElement.blur();
};

document.body.appendChild(backdrop);

document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.shiftKey && event.keyCode === 75) {
    open();
  } else if (event.keyCode === 27) {
    close();
  }
});

window.addEventListener('message', (event) => {
  if (event.data.type === 'favbox' && event.data.name === 'close') {
    close();
  }
});

backdrop.addEventListener('click', () => {
  close();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getHTML') {
    sendResponse({ html: document.documentElement.outerHTML });
  }
});
