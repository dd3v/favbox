/**
 * A helper object for manipulating tags in a string.
 *
 * @namespace tagHelper
 */
const tagHelper = {
  /**
  * Converts a string and an array of tags into a single string with tags appended.
  *
  * @param {string} string - The base string to which tags will be appended.
  * @param {Array<string>} tags - An array of tags to append to the string.
  * @returns {string} - The resulting string with tags appended.
  */
  toString: (string, tags) => (tags.length === 0 ? string : `${string} ${String.fromCodePoint(0x1f3f7)} ${tags.map((tag) => `#${tag}`).join(' ')}`),
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
  * @returns {Array<string>} - An array of extracted tags.
  */
  getTags: (string) => {
    const parts = string
      .split(String.fromCodePoint(0x1f3f7))
      .map((tag) => tag.trim());
    if (parts.length === 1) {
      return [];
    }
    return parts
      .pop()
      .match(/([^#]+)/g)
      .map((tag) => tag.trim());
  },
};

export default tagHelper;
