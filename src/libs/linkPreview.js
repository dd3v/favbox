const getTitle = (doc) => {
  const meta = doc.querySelector('meta[property="og:title"]')
    ?? doc.querySelector('meta[name="twitter:title"]');
  const title = meta?.getAttribute('content');
  if (title) return title;
  const documentTitle = doc?.title;
  if (documentTitle) return documentTitle;
  const heading = doc.querySelector('h1') ?? doc.querySelector('h2');
  const headingTitle = heading?.textContent;
  if (headingTitle) return headingTitle;
  return null;
};

const getDescription = (doc) => {
  const meta = doc.querySelector('meta[property="og:description"]')
    ?? doc.querySelector('meta[name="twitter:description"]');
  const description = meta?.getAttribute('content');
  if (description) return description;
  const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content');
  if (metaDescription) return metaDescription;

  return null;
};

const getImage = (doc) => {
  const meta = doc.querySelector('meta[property="og:image"]')
    ?? doc.querySelector('meta[name="twitter:image"]');
  const image = meta?.getAttribute('content');
  if (image) return image;
  const linkImage = doc.querySelector('link[rel="image_src"]')?.getAttribute('href');
  if (linkImage) return linkImage;
  // TODO: what if try to find?
  return null;
};

const getDomain = (doc) => {
  const link = doc.querySelector('link[ref="canonical"]')?.getAttribute('href');
  if (link) return link;
  const ogLink = doc.querySelector('meta[property="og:url')?.getAttribute('content');
  if (ogLink) return ogLink;
  return null;
};

const getLinkPreview = async (url) => {
  console.warn(url);
  const response = await fetch(url);
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  const html = await response.text();
  const contentType = response.headers.get('Content-Type');
  console.warn(html);
  console.log(contentType);
  const parser = new DOMParser();

  // Parse the text
  const doc = parser.parseFromString(html, 'text/html');
  const title = getTitle(doc);
  const image = getImage(doc);
  // FIXME: if empty try to get data from browser
  const domain = getDomain(doc);
  const description = getDescription(doc);
  // FIXME: use browser if empty;
  console.warn(domain);
  console.warn(image);
  console.warn(title);
  console.warn(description);
};

export default getLinkPreview;
