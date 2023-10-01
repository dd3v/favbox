const fetchHelper = {
  requestBookmark: async (bookmark, timeout = 5000) => {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      const response = await fetch(bookmark.url, { signal: controller.signal });
      clearTimeout(id);
      if (!response.ok) {
        const error = new Error(`An error has occurred: ${response.status}`);
        error.code = response.status;
        throw error;
      }
      const text = await response.text();
      return {
        html: text,
        contentType: response.headers.get('Content-Type'),
        error: 0,
        bookmark,
      };
    } catch (e) {
      console.error(e);
      return {
        error: e?.code ?? 0,
        html: null,
        contentType: null,
        bookmark,
      };
    }
  },
};
export default fetchHelper;
