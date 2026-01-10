const ping = () => {
  const onMessage = (msg, port) => {
    console.log('received', msg, 'from', port.sender);
  };
  const deleteTimer = (port) => {
    if (port.timer) {
      clearTimeout(port.timer);
      delete port.timer;
    }
  };
  const forceReconnect = (port) => {
    console.warn('Reconnect...');
    deleteTimer(port);
    port.disconnect();
  };

  // https://bugs.chromium.org/p/chromium/issues/detail?id=1152255
  // https://bugs.chromium.org/p/chromium/issues/detail?id=1189678
  browser.runtime.onConnect.addListener((port) => {
    if (port.name !== 'favbox') return;
    port.onMessage.addListener(onMessage);
    port.onDisconnect.addListener(deleteTimer);
    port.timer = setTimeout(forceReconnect, 30000, port);
  });
};

export default ping;
