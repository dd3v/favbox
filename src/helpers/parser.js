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

  #getAppleTouchImageFromPage() {
    const htmlElem = this.#html.querySelector('link[rel="apple-touch-icon"][sizes="152x152"], link[rel="apple-touch-icon"][sizes="180x180"]');
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
    const src = this.#getOGImageFromPage() || this.#getAppleTouchImageFromPage();
    return src ? new URL(src, this.#bookmark.url).href : null;
  }

  getDomain() {
    return new URL(this.#bookmark.url).hostname;
  }

  getFavicon() {
    let link = this.#html.querySelector('link[rel="icon"][type="image/svg+xml"]')?.getAttribute('href');
    if (!link) {
      link = this.#html.querySelector('link[rel="shortcut icon"], link[rel="icon"]')?.getAttribute('href');
    }

    return link ? new URL(link, this.#bookmark.url).href : `https://${this.getDomain()}/favicon.ico`;
  }

  getUrl() {
    return this.#bookmark.url;
  }

  getType() {
    return this.#html.querySelector('meta[property="og:type"]')?.getAttribute('content').toLowerCase() ?? null;
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
    return keywords.split(',').map((keyword) => keyword.trim().toLocaleLowerCase()).filter((keyword) => keyword.length > 0);
  }

  async getLocale() {
    const locale = this.#html.querySelector('meta[property="og:locale"]')?.getAttribute('content');
    if (locale) {
      return locale;
    }
    const result = await chrome.i18n.detectLanguage(this.#bookmark.title + this.getDescription());

    return result.languages.shift()?.language;
  }

  async getFavboxBookmark() {
    const folder = await this.getFolder();
    const entity = {
      id: parseInt(this.#bookmark.id, 10),
      folder,
      folderName: folder.title,
      title: tagHelper.getTitle(this.#bookmark.title),
      description: this.getDescription(),
      favicon: this.getFavicon(),
      image: this.getImage(),
      domain: this.getDomain(),
      type: this.getType(),
      keywords: this.getKeywords(),
      url: this.#bookmark.url,
      tags: tagHelper.getTags(this.#bookmark.title),
      favorite: 0,
      locale: await this.getLocale(),
      error: this.#hasError,
      dateAdded: this.#bookmark.dateAdded,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return entity;
  }
}
