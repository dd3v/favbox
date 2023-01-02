import Parser from '@/libs/parser';
import PageRequest from '@/libs/pageRequest';
import HtmlDocument from '@/libs/htmlDocument';

const getLinkPreview = async (url) => {
  const page = await (new PageRequest(url)).getData();
  const html = (new HtmlDocument(page.text)).getHtmlDocument();
  const parser = new Parser(html);

  const title = parser.getTitle();
  const image = parser.getImage();
  // FIXME: if empty try to get data from browser
  const domain = parser.getDomain();
  const description = parser.getDescription();
  // FIXME: use browser if empty;
  console.warn(domain);
  console.warn(image);
  console.warn(title);
  console.warn(description);
};

export default getLinkPreview;
