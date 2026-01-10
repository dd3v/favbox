/**
 * Joins a title and tags into a single string.
 * @param {string} title
 * @param {Array<string>} tags
 * @returns {string}
 */
export function joinTitleAndTags(title, tags = []) {
  const filteredTags = (tags || []).filter(Boolean);
  if (filteredTags.length === 0) {
    return title || '';
  }
  return `${title || ''} ${String.fromCodePoint(0x1f3f7)} ${filteredTags.map((tag) => `#${tag}`).join(' ')}`;
}

/**
 * Extracts the title from a string that may contain tags.
 * @param {string} string
 * @returns {string} The extracted title.
 */
export function extractTitle(string) {
  if (!string) return '';
  return string.split(String.fromCodePoint(0x1f3f7))[0]?.trim() || '';
}

/**
 * Extracts tags from a string.
 * @param {string} string
 * @returns {Array<string>} An array of extracted tags.
 */
export function extractTags(string) {
  if (!string) return [];
  const parts = string.split(String.fromCodePoint(0x1f3f7)).map((part) => part.trim());
  if (parts.length < 2 || parts[1].length === 0) {
    return [];
  }
  return parts[1]
    .split(/(?=#)/)
    .map((tag) => tag.trim().replace(/^#/, ''))
    .filter((tag) => tag && tag.length > 0 && !/^\uFE0F+$/.test(tag));
}
