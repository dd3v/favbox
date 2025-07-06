import { parseHTML } from 'linkedom';

/**
 * Class for parsing bookmark metadata from HTML documents.
 */
export default class MetadataParser {
  #bookmark;

  #httpResponse;

  #dom;

  #folders;

  #tagHelper;

  /**
   * Creates an instance of MetadataParser.
   * @param {Object} bookmark - The bookmark object from browser.
   * @param {Object} httpResponse - The HTTP response object containing HTML.
   * @param {Object} tagHelper - Helper for tag and title processing.
   * @param {Map<string, string>} [folders=new Map()] - Cache map of folder IDs to names.
   */
  constructor(bookmark, httpResponse, tagHelper, folders = new Map()) {
    const { document } = parseHTML(httpResponse.html);
    this.#bookmark = bookmark;
    this.#dom = document;
    this.#httpResponse = httpResponse;
    this.#folders = folders;
    this.#tagHelper = tagHelper;
  }

  /**
   * Retrieves the title from various sources in the HTML document.
   * @returns {string} The document title, or an empty string if not found.
   */
  getTitle() {
    // Check if bookmark title is empty or whitespace
    if (!this.#bookmark.title?.trim()) {
      // Try document title first
      if (this.#dom.title) {
        return this.#dom.title;
      }
      const metaSelectors = [
        'meta[property="og:title"]',
        'meta[name="twitter:title"]',
      ];
      for (const selector of metaSelectors) {
        const element = this.#dom.querySelector(selector);
        if (element?.getAttribute('content')) {
          return element.getAttribute('content');
        }
      }
      const headingSelectors = ['h1', 'h2'];
      for (const selector of headingSelectors) {
        const element = this.#dom.querySelector(selector);
        if (element?.textContent?.trim()) {
          return element.textContent.trim();
        }
      }
      return '';
    }
    return this.#bookmark.title;
  }

  /**
   * Retrieves the description from various meta tags in the HTML document.
   * @returns {string|null} The document description, or null if not found.
   */
  getDescription() {
    const selectors = [
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
      'meta[name="description"]',
    ];

    for (const selector of selectors) {
      const element = this.#dom.querySelector(selector);
      if (element) {
        return element.getAttribute('content') ?? null;
      }
    }

    return null;
  }

  /**
   * Searches for preview image on the page.
   * @returns {string|null} The image URL, or null if not found.
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
   * @returns {string|null} The URL of the Open Graph image, or null if not found.
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

    for (const selector of selectors) {
      const element = this.#dom.querySelector(selector);
      if (element) {
        return element.getAttribute('content') || element.getAttribute('href') || null;
      }
    }

    return null;
  }

  /**
   * Retrieves the main image URL from the HTML document.
   * @returns {string|null} The URL of the main image, or null if not found.
   */
  getImage() {
    const src = this.#getImageFromMeta() || this.#searchPagePreview();
    return src ? new URL(src, this.#bookmark.url).href : null;
  }

  /**
   * Retrieves the domain from the bookmark URL.
   * @returns {string} The domain of the bookmark URL.
   */
  getDomain() {
    return new URL(this.#bookmark.url).hostname.replace(/^www\./, '');
  }

  /**
   * Retrieves the favicon URL from the HTML document.
   * @returns {string} The URL of the favicon or a default favicon URL if not found.
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
   * @returns {string} The URL of the bookmark.
   */
  getUrl() {
    return this.#bookmark.url;
  }

  /**
   * Retrieves the keywords from the HTML document's meta tags.
   * @returns {string[]} An array of keywords or an empty array if no keywords are found.
   */
  getKeywords() {
    const keywords = this.#dom.querySelector('meta[name="keywords"]')?.getAttribute('content');
    if (!keywords) return [];
    return keywords.split(',').map((keyword) => keyword.trim().toLowerCase()).filter((keyword) => keyword.length > 0);
  }

  /**
   * Gets folder name from cache instead of making API call.
   * @returns {string} The folder name or 'Unknown' if not found.
   * @private
   */
  #getFolderName() {
    return this.#folders.get(this.#bookmark.parentId.toString()) || 'Unknown';
  }

  /**
   * Builds a bookmark entity for Favbox.
   * @returns {Promise<Object>} A promise that resolves to the bookmark entity object.
   */
  async getFavboxBookmark() {
    const entity = {
      id: this.#bookmark.id,
      folderId: this.#bookmark.parentId,
      folderName: this.#getFolderName(),
      title: this.#tagHelper.getTitle(this.#bookmark.title),
      description: this.getDescription(),
      favicon: this.getFavicon(),
      image: this.getImage(),
      domain: this.getDomain(),
      keywords: this.getKeywords(),
      url: this.#bookmark.url,
      tags: this.#tagHelper.getTags(this.#bookmark.title),
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
