import { parseHTML } from 'linkedom';
import tagHelper from '@/helpers/tags';

export default class MetadataParser {
  #bookmark;

  #httpResponse;

  #dom;

  #folders;

  /**
  * Creates an instance of a class that processes a bookmark.
  *
  * @param {Object} bookmark - The bookmark object from browser.
  * @param {Object} httpResponse - The response object from the HTTP request made to the bookmark URL.
  * @param {Map<string, string>} [folders=new Map()] - Cache map of folder IDs to folder names.
  */
  constructor(bookmark, httpResponse, folders = new Map()) {
    const { document } = parseHTML(httpResponse.html);
    this.#bookmark = bookmark;
    this.#dom = document;
    this.#httpResponse = httpResponse;
    this.#folders = folders;
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
  * Retrieves the image from the HTML document.
  *
  * @returns {string|null} - The URL of the Apple Touch icon or null if not found.
  * @private
  */
  #searchPagePreview() {
    const htmlElem = this.#dom.querySelector([
      'img[class*="hero"]',
      'img[class*="banner"]',
      'img[class*="cover"]',
      'img[class*="featured"]',
      'img[class*="preview"]',
      'img[id*="post-image"]',
      'article img:first-of-type',
      'main img:first-of-type',
      '.content img:first-of-type',
    ].join(','));
    const src = (htmlElem?.getAttribute('content') || htmlElem?.getAttribute('href') || htmlElem?.getAttribute('src')) ?? null;
    return src;
  }

  /**
  * Retrieves the Open Graph/Meta image URL from the HTML document.
  *
  * @returns {string|null} - The URL of the Open Graph image or null if not found.
  * @private
  */
  #getImageFromMeta() {
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
    const src = this.#getImageFromMeta() || this.#searchPagePreview();
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
  * Gets folder name from cache instead of making API call
  *
  * @returns {string} - The folder name or 'Unknown' if not found.
  */
  #getFolderName() {
    return this.#folders.get(this.#bookmark.parentId.toString()) || 'Unknown';
  }

  /**
  *
  * @returns {Promise<Object>} - A promise that resolves to an object representing the bookmark entity.
  */
  async getFavboxBookmark() {
    const entity = {
      id: this.#bookmark.id,
      folderId: this.#bookmark.parentId,
      folderName: this.#getFolderName(),
      title: tagHelper.getTitle(this.#bookmark.title),
      description: this.getDescription(),
      favicon: this.getFavicon(),
      image: this.getImage(),
      domain: this.getDomain(),
      keywords: this.getKeywords(),
      url: this.#bookmark.url,
      tags: tagHelper.getTags(this.#bookmark.title),
      pinned: 0,
      notes: '',
      httpStatus: this.#httpResponse.httpStatus,
      dateAdded: this.#bookmark.dateAdded,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return entity;
  }
}
