const fetchHelper = {
  getData: async (url, timeout = 5000) => {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(id);

      if (!response.ok) {
        const error = new Error(`An error has occurred: ${response.status}`);
        error.code = response.status;
        throw error;
      }

      const text = await response.text();
      return {
        text,
        contentType: response.headers.get('Content-Type'),
      };
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw error;
    }
  },

};
export default fetchHelper;
