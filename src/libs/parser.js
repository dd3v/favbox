export default class Parser {
  #html;

  #url;

  constructor(url, html) {
    this.#url = url;
    this.#html = html;
  }

  getTitle() {
    const title = this.#html.querySelector('meta[property="og:title"], meta[name="twitter:title"]')?.getAttribute('content')
      ?? this.#html.title
      ?? this.#html.querySelector('h1')?.textContent
      ?? this.#html.querySelector('h2')?.textContent;

    return title || null;
  }

  getDescription() {
    const selectors = [
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
      'meta[name="description"]',
    ];
    return this.#html.querySelector(selectors.join(','))?.getAttribute('content') ?? null;
  }

  #getLargestImageFromPage() {
    const images = this.#html.getElementsByTagName('img');
    let largestImage = null;
    let largestSize = 0;
    for (const img of images) {
      if (img.width >= 300) {
        const imageSize = img.width * img.height;
        if (imageSize > largestSize) {
          largestSize = imageSize;
          largestImage = img;
        }
      }
    }
    return largestImage ? largestImage.src : null;
  }

  #getAppleTouchImageFromPage() {
    const htmlElem = this.#html.querySelector('link[rel="apple-touch-icon"][sizes="152x152"]');
    const src = (htmlElem?.getAttribute('content') || htmlElem?.getAttribute('href')) ?? null;
    return src;
  }

  #getOGImageFromPage() {
    const selectors = [
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
      'meta[property="og:image:url"]',
      'meta[name="image"]',
      'meta[name="og:image"]',
      'link[rel="image_src"]',
      'meta[property="forem:logo"]',
    ];
    const htmlElem = this.#html.querySelector(selectors.join(','));
    return (htmlElem?.getAttribute('content') || htmlElem?.getAttribute('href')) ?? null;
  }

  getImage() {
    let src = this.#getOGImageFromPage();

    if (src === null) {
      src = this.#getLargestImageFromPage();
    }
    if (src === null) {
      src = this.#getAppleTouchImageFromPage();
    }

    console.warn(src);
    console.warn(this.#html);

    return src ? new URL(src, this.#url).href : null;
  }

  getDomain() {
    return new URL(this.#url).hostname;
  }

  getFavicon() {
    const selectors = ['link[rel="shortcut icon"]', 'link[rel="icon"]'];
    const link = this.#html.querySelector(selectors.join(','))?.getAttribute('href');
    return link ? new URL(link, this.#url).href : null;
  }

  getUrl() {
    return this.#url;
  }

  getType() {
    return this.#html.querySelector('meta[property="og:type"]')?.getAttribute('content') ?? null;
  }

  getKeywords() {
    const selectors = [
      'meta[name="keywords"]',
      'meta[name="keynews_keywordswords"]',
    ];
    const keywords = this.#html.querySelector(selectors.join(','))?.getAttribute('content');
    if (!keywords || keywords.length === 0) return null;
    return keywords.split(',').map((keyword) => keyword.trim()).filter((keyword) => keyword.length > 0);
  }

  getFullPageInfo() {
    return {
      title: this.getTitle(),
      description: this.getDescription(),
      image: this.getImage(),
      domain: this.getDomain(),
      favicon: this.getFavicon(),
      url: this.getUrl(),
      keywords: this.getKeywords(),
      type: this.getType(),
    };
  }
}
