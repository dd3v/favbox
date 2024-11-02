import { parseHTML } from 'linkedom';
import bookmarkHelper from '@/helpers/bookmark';
import tagHelper from '@/helpers/tags';

export default class MetadataParser {
  #bookmark;

  #httpResponse;

  #dom;

  /**
  * Creates an instance of a class that processes a bookmark;
  *
  * @param {Object} bookmark - The bookmark object from browser.
  * @param {Object} httpResponse - The response object from the HTTP request made to the bookmark URL.
  */
  constructor(bookmark, httpResponse) {
    const { document } = parseHTML(httpResponse.html);
    this.#bookmark = bookmark;
    this.#dom = document;
    this.#httpResponse = httpResponse;
  }

  /**
  * Retrieves the title from various sources in the HTML document.
  *
  * @returns {string|null} - The title of the document or null if not found.
  */
  getTitle() {
    const title = this.#bookmark.title
      ?? this.#dom.title
      ?? this.#dom.querySelector('meta[property="og:title"], meta[name="twitter:title"]')?.getAttribute('content')
      ?? this.#dom.querySelector('h1')?.textContent
      ?? this.#dom.querySelector('h2')?.textContent;
    return title || null;
  }

  /**
  * Retrieves the description from various meta tags in the HTML document.
  *
  * @returns {string|null} - The description of the document or null if not found.
  */
  getDescription() {
    const selectors = [
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
      'meta[name="description"]',
    ];
    return this.#dom.querySelector(selectors.join(','))?.getAttribute('content') ?? null;
  }

  /**
  * Retrieves the Apple Touch icon URL from the HTML document.
  *
  * @returns {string|null} - The URL of the Apple Touch icon or null if not found.
  * @private
  */
  #getAppleTouchImageFromPage() {
    const htmlElem = this.#dom.querySelector('link[rel="apple-touch-icon"][sizes="152x152"], link[rel="apple-touch-icon"][sizes="180x180"]');
    const src = (htmlElem?.getAttribute('content') || htmlElem?.getAttribute('href')) ?? null;
    return src;
  }

  /**
  * Retrieves the Open Graph image URL from the HTML document.
  *
  * @returns {string|null} - The URL of the Open Graph image or null if not found.
  * @private
  */
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

  /**
  * Retrieves the main image URL from the HTML document.
  *
  * @returns {string|null} - The URL of the main image or null if not found.
  */
  getImage() {
    const src = this.#getOGImageFromPage() || this.#getAppleTouchImageFromPage();
    return src ? new URL(src, this.#bookmark.url).href : null;
  }

  /**
  * Retrieves the domain from the bookmark URL.
  *
  * @returns {string} - The domain of the bookmark URL.
  */
  getDomain() {
    return new URL(this.#bookmark.url).hostname.replace(/^www\./, '');
  }

  /**
  * Retrieves the favicon URL from the HTML document.
  *
  * @returns {string} - The URL of the favicon or a default favicon URL if not found.
  */
  getFavicon() {
    let link = this.#dom.querySelector('link[rel="icon"][type="image/svg+xml"]')?.getAttribute('href');
    if (!link) {
      link = this.#dom.querySelector('link[rel="shortcut icon"], link[rel="icon"]')?.getAttribute('href');
    }
    return link ? new URL(link, this.#bookmark.url).href : `https://${this.getDomain()}/favicon.ico`;
  }

  /**
  * Retrieves the URL of the bookmark.
  *
  * @returns {string} - The URL of the bookmark.
  */
  getUrl() {
    return this.#bookmark.url;
  }

  /**
  * Retrieves the type of the content.
  *
  * @returns {string} - The type of the bookmark.
  */
  getType() {
    return this.#dom.querySelector('meta[property="og:type"]')?.getAttribute('content')?.split('.')?.shift()
      ?.toLowerCase() ?? 'website';
  }

  /**
  * Retrieves the keywords from the HTML document's meta tags.
  *
  * @returns {string[]} - An array of keywords or an empty array if no keywords are found.
  */
  getKeywords() {
    const keywords = this.#dom.querySelector('meta[name="keywords"]')?.getAttribute('content');
    if (!keywords) return [];
    return keywords.split(',').map((keyword) => keyword.trim().toLowerCase()).filter((keyword) => keyword.length > 0);
  }

  /**
  * Retrieves the locale of the web page.
  *
  * @returns {Promise<string|null>} - A promise that resolves to the locale of the document or null if not found.
  */
  async getLocale() {
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

  /**
  *
  * @returns {Promise<Object>} - A promise that resolves to an object representing the bookmark entity.
  */
  async getFavboxBookmark() {
    const [folder] = await chrome.bookmarks.get(this.#bookmark.parentId);
    const foldersTree = await bookmarkHelper.getFoldersTreeByBookmark(this.#bookmark.id);
    const entity = {
      id: parseInt(this.#bookmark.id, 10),
      folder,
      folderId: parseInt(this.#bookmark.parentId, 10),
      folderName: foldersTree.titles.at(-1),
      title: tagHelper.getTitle(this.#bookmark.title),
      description: this.getDescription(),
      favicon: this.getFavicon(),
      image: this.getImage(),
      domain: this.getDomain(),
      type: this.getType(),
      keywords: this.getKeywords(),
      url: this.#bookmark.url,
      tags: tagHelper.getTags(this.#bookmark.title),
      pinned: 0,
      notes: '',
      locale: await this.getLocale(),
      httpStatus: this.#httpResponse.httpStatus,
      dateAdded: this.#bookmark.dateAdded,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return entity;
  }
}
