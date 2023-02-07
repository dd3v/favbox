const tagHelper = {
  toString: (string, tags) => (tags.length === 0 ? string : `${string} ${String.fromCodePoint(0x1f3f7)} ${tags.map((tag) => `#${tag}`).join(' ')}`),
  getTitle: (string) => string.split(String.fromCodePoint(0x1f3f7)).shift().trim(),
  getTags: (string) => {
    const parts = string.split(String.fromCodePoint(0x1f3f7)).map((tag) => tag.trim());
    if (parts.length === 1) {
      return [];
    }
    return parts.pop().match(/([^#]+)/g).map((tag) => tag.trim());
  },
};

export default tagHelper;
