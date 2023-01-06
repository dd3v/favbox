import Parser from '@/libs/parser';

console.warn('content.js here');
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getCurrentTabPreview') {
    console.warn(request.tab);
    try {
      const parser = new Parser(document);
      const preview = {
        title: request.tab.title,
        url: request.tab.url,
        favicon: request.tab.favIconUrl,
        image: parser.getImage(),
        domain: parser.getDomain(),
        description: parser.getDescription(),
      };
      console.warn(preview);
      sendResponse({ preview });
    } catch (e) {
      console.warn(e);
    }
  }
});
