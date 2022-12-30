// Example of a simple user data object
const user = {
  username: 'demo-user',
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('new event');
  // 2. A page requested user data, respond with a copy of `user`
  if (message === 'get-user-data') {
    setTimeout(() => {
      sendResponse(user);
    }, 5000);
  }
  return true;
});

// https://developer.chrome.com/docs/extensions/reference/tabs/#event-onUpdated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.warn(tabId);
  console.warn(changeInfo);
  console.warn(tab);
  console.warn(`status === ${changeInfo.status}`);

  if (changeInfo.status === 'complete') {
    console.warn('Tab loaded');
    console.log(tab.url);
    console.log(tab.favIconUrl);
    console.log(tab.title);
  }

//  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//    console.log('try to get current tab info');
//    // since only one tab should be active and in the current window at once
//    // the return variable should only have one entry
//    const activeTab = tabs[0];
//    console.warn(activeTab.url);
//    // eslint-disable-next-line no-unused-vars
//    const activeTabId = activeTab.id; // or do whatever you need
//  });
});
