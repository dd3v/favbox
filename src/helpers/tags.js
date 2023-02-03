const tagHelper = {
  toString: (string, tags) => (tags.length === 0 ? string : `${string} ||| ${tags.map((tag) => `#${tag}`).join(' ')}`),
  getTitle: (string) => string.split('|||').shift().trim(),
  getTags: (string) => {
    const parts = string.split('|||');
    if (parts.length === 1) {
      return [];
    }
    return parts.pop().split(/\s+/).filter((tag) => tag.startsWith('#')).map((tag) => tag.replace('#', ''));
  },
};

export default tagHelper;
