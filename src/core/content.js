import Parser from '@/libs/parser';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.warn(request);
  if (request.action === 'getCurrentTabPreview') {
    const parser = new Parser(document);
    try {
      const preview = {
        title: parser.getTitle(),
        image: parser.getImage(),
        domain: parser.getDomain(),
        description: parser.getDescription(),
      };
      console.warn(preview);
      sendResponse({
        preview,
      });
    } catch (e) {
      console.warn(e);
    }
  }
});
