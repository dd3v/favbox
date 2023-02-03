const getList = (bookmarks) => {
  const folders = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const bookmark of bookmarks) {
    if (bookmark.children) {
      folders.push(bookmark);
      folders.push(...getList(bookmark.children));
    }
  }
  return folders;
};

const getBookmarkFolders = async () => {
  const tree = await chrome.bookmarks.getTree();
  return getList(tree).filter((folder) => folder.title !== '');
};

const getFolderById = async (id) => {
  const folders = await getBookmarkFolders();
  return folders.find((item) => item.id === id);
};

const getFolderList = async () => {
  const folders = await getBookmarkFolders();
  return folders.map((item) => item.title);
};

export { getFolderList, getBookmarkFolders, getFolderById };
