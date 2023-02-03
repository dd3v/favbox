import Parser from '@/libs/parser';

try {
  const parser = new Parser(document.location.href, document);
  const pageInfo = parser.getFullPageInfo();
  await chrome.runtime.sendMessage({ action: 'cache', data: pageInfo });
} catch (e) {
  console.error('Caching error', e);
}
