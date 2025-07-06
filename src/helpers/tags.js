/**
 * A helper object for manipulating tags in a string.
 *
 * @namespace tagHelper
 */
const tagHelper = {
  /**
  * Converts a string and an array of tags into a single string.
  *
  * @param {string} string - The base string to which tags will be appended.
  * @param {Array<string>} tags - An array of tags.
  * @returns {string} - The resulting string with tags.
  */
  toString: (string, tags) => {
    const filterTags = tags.filter(Boolean);
    if (tags.length === 0 || filterTags.length === 0) {
      return string;
    }
    return `${string} ${String.fromCodePoint(0x1f3f7)} ${tags.map((tag) => `#${tag}`).join(' ')}`;
  },
  /**
  * Extracts the title from a string that may contain tags.
  *
  * @param {string} string - The string from which to extract the title.
  * @returns {string} - The extracted title.
  */
  getTitle: (string) => string.split(String.fromCodePoint(0x1f3f7)).shift().trim(),
  /**
  * Extracts tags from a string.
  *
  * @param {string} string - The string from which to extract tags.
  * @returns {Array<string>} An array of extracted tags.
  */
  getTags: (string) => {
    const parts = string.split(String.fromCodePoint(0x1f3f7)).map((part) => part.trim());
    if (parts.length < 2 || parts[1].length === 0) {
      return [];
    }
    const tags = parts[1]
      .split(/(?=#)/)
      .map((tag) => tag.trim().replace(/^#/, ''))
      .filter((tag) => tag && tag.length > 0 && !/^\uFE0F+$/.test(tag));
    return tags;
  },

};

export default tagHelper;
