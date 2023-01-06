import Parser from '@/libs/parser';

console.warn('content.js here');
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getCurrentTabPreview') {
    console.warn(message.data);
    try {
      const parser = new Parser(document);
      const preview = {
        title: message.data.title,
        url: message.data.url,
        favicon: message.data.favIconUrl,
        image: parser.getImage(),
        domain: parser.getDomain(),
        description: parser.getDescription(),
      };
      sendResponse({ result: true, data: preview });
    } catch (e) {
      console.warn(e);
    }
  }
  return true;
});
