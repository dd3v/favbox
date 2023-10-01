import { parseHTML } from 'linkedom';
import bookmarkHelper from '@/helpers/bookmarks';
import tagHelper from '@/helpers/tags';

export default class Parser {
  #html;

  #hasError;

  #bookmark;

  constructor(response) {
    const { document } = parseHTML(response.html);
    this.#bookmark = response.bookmark;
    this.#html = document;
    this.#hasError = response.error;
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

  #getImageWithAltFromPage() {
    const images = this.#html.getElementsByTagName('img');
    let largestImage = null;
    let largestSize = 0;
    for (const img of images) {
      if (img.alt.length >= 45) {
        const imageSize = img.alt.length;
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
    const src = this.#getOGImageFromPage() || this.#getAppleTouchImageFromPage() || this.#getImageWithAltFromPage();

    console.warn(src);
    return src ? new URL(src, this.#bookmark.url).href : null;
  }

  getDomain() {
    return new URL(this.#bookmark.url).hostname;
  }

  async #pingFavicon() {
    try {
      if (this.#hasError) return false;
      const url = `https://${this.getDomain()}/favicon.ico`;
      const response = await fetch(url, { method: 'HEAD' });
      if (response.status === 200) {
        return url;
      }
      return false;
    } catch (error) {
      console.warn(error);
      return false;
    }
  }

  async getFavicon() {
    const selectors = ['link[rel="shortcut icon"]', 'link[rel="icon"]'];
    const link = this.#html.querySelector(selectors.join(','))?.getAttribute('href');

    if (link) {
      return new URL(link, this.#bookmark.url).href;
    }

    const icon = await this.#pingFavicon();
    return icon || null;
  }

  getUrl() {
    return this.#bookmark.url;
  }

  getType() {
    return this.#html.querySelector('meta[property="og:type"]')?.getAttribute('content') ?? null;
  }

  async getFolder() {
    const folders = await bookmarkHelper.getFolders();
    return folders.find((item) => item.id === this.#bookmark.parentId);
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

  async getFavboxBookmark() {
    const folder = await this.getFolder();
    const entity = {
      id: parseInt(this.#bookmark.id, 10),
      folder,
      folderName: folder.title,
      title: tagHelper.getTitle(this.#bookmark.title),
      description: this.getDescription(),
      favicon: await this.getFavicon(),
      image: this.getImage(),
      domain: this.getDomain(),
      type: this.getType(),
      keywords: this.getKeywords(),
      url: this.#bookmark.url,
      tags: tagHelper.getTags(this.#bookmark.title),
      favorite: 0,
      error: this.#hasError,
      dateAdded: this.#bookmark.dateAdded,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return entity;
  }
}
