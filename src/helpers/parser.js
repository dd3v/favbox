import { parseHTML } from 'linkedom';
import bookmarkHelper from '@/helpers/bookmarks';
import tagHelper from '@/helpers/tags';

export default class Parser {
  #bookmark;

  #httpResponse;

  #dom;

  /**
   * Creates an instance of a class that processes a bookmark;
   *
   * @param {Object} bookmark - The bookmark object from browser.
   * @param {Object} httpResponse - The response object from the HTTP request made to the bookmark URL.
   * @param {string} httpResponse.html - The HTML content of the response.
   * @param {number} httpResponse.error - Error code.
   */
  constructor(bookmark, httpResponse) {
    const { document } = parseHTML(httpResponse.html);
    this.#bookmark = bookmark;
    this.#dom = document;
    this.#httpResponse = httpResponse;
  }

  getTitle() {
    const title = this.#bookmark.title
      ?? this.#dom.title
      ?? this.#dom.querySelector('meta[property="og:title"], meta[name="twitter:title"]')?.getAttribute('content')
      ?? this.#dom.querySelector('h1')?.textContent
      ?? this.#dom.querySelector('h2')?.textContent;
    return title || null;
  }

  getDescription() {
    const selectors = [
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
      'meta[name="description"]',
    ];
    return this.#dom.querySelector(selectors.join(','))?.getAttribute('content') ?? null;
  }

  #getAppleTouchImageFromPage() {
    const htmlElem = this.#dom.querySelector('link[rel="apple-touch-icon"][sizes="152x152"], link[rel="apple-touch-icon"][sizes="180x180"]');
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
    const htmlElem = this.#dom.querySelector(selectors.join(','));
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
    let link = this.#dom.querySelector('link[rel="icon"][type="image/svg+xml"]')?.getAttribute('href');
    if (!link) {
      link = this.#dom.querySelector('link[rel="shortcut icon"], link[rel="icon"]')?.getAttribute('href');
    }
    return link ? new URL(link, this.#bookmark.url).href : `https://${this.getDomain()}/favicon.ico`;
  }

  getUrl() {
    return this.#bookmark.url;
  }

  getType() {
    return this.#dom.querySelector('meta[property="og:type"]')?.getAttribute('content')?.split('.')?.shift()
      ?.toLowerCase() ?? 'website';
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
    const keywords = this.#dom.querySelector(selectors.join(','))?.getAttribute('content');
    if (!keywords || keywords.length === 0) return [];
    return keywords.split(',').map((keyword) => keyword.trim().toLocaleLowerCase()).filter((keyword) => keyword.length > 0);
  }

  async getLocale() {
    if (this.#httpResponse.error !== 0) {
      return null;
    }
    const htmlLang = this.#dom?.documentElement?.lang?.split(/[_-]/).shift()?.toUpperCase();
    if (htmlLang) {
      return htmlLang;
    }
    const metaLocale = this.#dom.querySelector('meta[property="og:locale"]')?.getAttribute('content').split(/[_-]/)?.shift()
      ?.toUpperCase();
    if (metaLocale) {
      return metaLocale;
    }
    const elements = Array.from(this.#dom.querySelectorAll('button, label, h1, h2, h3, h4, h5, h6, p'));
    const description = elements.map((el) => el.textContent).concat([this.getDescription() || '', this.getKeywords() || '']).join(' ');
    if (description.trim()) {
      const result = await chrome.i18n.detectLanguage(description);
      if (result.languages?.length) {
        console.warn(description, result.languages);
        return result.languages[0].language.toUpperCase();
      }
    }
    return null;
  }

  async getFavboxBookmark() {
    const foldersTree = await bookmarkHelper.getFoldersTreeByBookmark(this.#bookmark.id);
    const entity = {
      id: parseInt(this.#bookmark.id, 10),
      bfolder: await bookmarkHelper.getById(this.#bookmark.parentId),
      folder: foldersTree.at(-1),
      folders: foldersTree,
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
      error: this.#httpResponse.error,
      dateAdded: this.#bookmark.dateAdded,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return entity;
  }
}
