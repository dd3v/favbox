import Parser from '@/libs/parser';

console.warn('FavoriteBox');
(async () => {
  const parser = new Parser(document.location.href, document);
  const pageInfo = {
    title: parser.getTitle(),
    url: parser.getUrl(),
    favicon: parser.getFavicon(),
    image: parser.getImage(),
    domain: parser.getDomain(),
    description: parser.getDescription(),
  };
  await chrome.runtime.sendMessage({ action: 'cache', data: pageInfo });
})();
