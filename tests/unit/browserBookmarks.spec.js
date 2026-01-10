import {
  getBookmarksCount,
  getBookmarksFromNode,
  getFolderTree,
  getFoldersMap,
  getBookmarksIterator,
} from '@/services/browserBookmarks';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import browser from 'webextension-polyfill';

vi.mock('webextension-polyfill', () => ({
  default: {
    bookmarks: {
      getTree: vi.fn(),
    },
  },
}));
const mockGetTree = vi.mocked(browser.bookmarks.getTree);

describe('browserBookmarks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTree.mockClear();
  });

  describe('getBookmarksCount', () => {
    it('should count bookmarks in tree', async () => {
      const mockTree = [
        {
          id: '0',
          children: [
            {
              id: '1',
              title: 'Folder 1',
              children: [
                { id: '2', title: 'Bookmark 1', url: 'https://example.com' },
                { id: '3', title: 'Bookmark 2', url: 'https://google.com' },
              ],
            },
            {
              id: '4',
              title: 'Folder 2',
              children: [
                { id: '5', title: 'Bookmark 3', url: 'https://github.com' },
              ],
            },
          ],
        },
      ];
      mockGetTree.mockResolvedValue(mockTree);

      const count = await getBookmarksCount();
      expect(count).toBe(3);
    });

    it('should return 0 for empty tree', async () => {
      mockGetTree.mockResolvedValue([{ id: '0', children: [] }]);
      const count = await getBookmarksCount();
      expect(count).toBe(0);
    });

    it('should handle nested folders', async () => {
      const mockTree = [
        {
          id: '0',
          children: [
            {
              id: '1',
              title: 'Folder 1',
              children: [
                {
                  id: '2',
                  title: 'Subfolder',
                  children: [
                    { id: '3', title: 'Bookmark 1', url: 'https://example.com' },
                  ],
                },
              ],
            },
          ],
        },
      ];
      mockGetTree.mockResolvedValue(mockTree);
      const count = await getBookmarksCount();
      expect(count).toBe(1);
    });
  });

  describe('getBookmarksFromNode', () => {
    it('should extract bookmarks from node', () => {
      const node = {
        id: '1',
        title: 'Folder',
        children: [
          { id: '2', title: 'Bookmark 1', url: 'https://example.com' },
          { id: '3', title: 'Bookmark 2', url: 'https://google.com' },
        ],
      };
      const bookmarks = getBookmarksFromNode(node);
      expect(bookmarks).toHaveLength(2);
      expect(bookmarks[0]).toEqual({ id: '2', url: 'https://example.com' });
      expect(bookmarks[1]).toEqual({ id: '3', url: 'https://google.com' });
    });

    it('should handle node with url (bookmark itself)', () => {
      const node = {
        id: '1',
        title: 'Bookmark',
        url: 'https://example.com',
      };
      const bookmarks = getBookmarksFromNode(node);
      expect(bookmarks).toHaveLength(1);
      expect(bookmarks[0]).toEqual({ id: '1', url: 'https://example.com' });
    });

    it('should return empty array for null node', () => {
      expect(getBookmarksFromNode(null)).toEqual([]);
    });

    it('should return empty array for undefined node', () => {
      expect(getBookmarksFromNode(undefined)).toEqual([]);
    });

    it('should handle nested folders', () => {
      const node = {
        id: '1',
        title: 'Folder',
        children: [
          {
            id: '2',
            title: 'Subfolder',
            children: [
              { id: '3', title: 'Bookmark 1', url: 'https://example.com' },
            ],
          },
          { id: '4', title: 'Bookmark 2', url: 'https://google.com' },
        ],
      };
      const bookmarks = getBookmarksFromNode(node);
      expect(bookmarks).toHaveLength(2);
    });

    it('should ignore folders without url', () => {
      const node = {
        id: '1',
        title: 'Folder',
        children: [
          { id: '2', title: 'Subfolder', children: [] },
          { id: '3', title: 'Bookmark', url: 'https://example.com' },
        ],
      };
      const bookmarks = getBookmarksFromNode(node);
      expect(bookmarks).toHaveLength(1);
      expect(bookmarks[0].id).toBe('3');
    });
  });

  describe('getFolderTree', () => {
    it('should build folder tree with counts', async () => {
      const mockTree = [
        {
          id: '0',
          children: [
            {
              id: '1',
              title: 'Folder 1',
              children: [
                { id: '2', title: 'Bookmark 1', url: 'https://example.com' },
                { id: '3', title: 'Bookmark 2', url: 'https://google.com' },
              ],
            },
            {
              id: '4',
              title: 'Folder 2',
              children: [
                { id: '5', title: 'Bookmark 3', url: 'https://github.com' },
              ],
            },
          ],
        },
      ];
      mockGetTree.mockResolvedValue(mockTree);

      const tree = await getFolderTree();
      expect(tree).toHaveLength(2);
      expect(tree[0]).toMatchObject({
        id: '1',
        label: 'Folder 1',
        count: 2,
      });
      expect(tree[1]).toMatchObject({
        id: '4',
        label: 'Folder 2',
        count: 1,
      });
    });

    it('should handle nested folders with correct counts', async () => {
      const mockTree = [
        {
          id: '0',
          children: [
            {
              id: '1',
              title: 'Folder 1',
              children: [
                { id: '2', title: 'Bookmark 1', url: 'https://example.com' },
                {
                  id: '3',
                  title: 'Subfolder',
                  children: [
                    { id: '4', title: 'Bookmark 2', url: 'https://google.com' },
                    { id: '5', title: 'Bookmark 3', url: 'https://github.com' },
                  ],
                },
              ],
            },
          ],
        },
      ];
      mockGetTree.mockResolvedValue(mockTree);

      const tree = await getFolderTree();
      expect(tree).toHaveLength(1);
      expect(tree[0].count).toBe(3); // 1 direct + 2 from subfolder
      expect(tree[0].children).toHaveLength(1);
      expect(tree[0].children[0].count).toBe(2);
    });

    it('should filter out bookmarks (only folders)', async () => {
      const mockTree = [
        {
          id: '0',
          children: [
            { id: '1', title: 'Bookmark 1', url: 'https://example.com' },
            {
              id: '2',
              title: 'Folder',
              children: [
                { id: '3', title: 'Bookmark 2', url: 'https://google.com' },
              ],
            },
          ],
        },
      ];
      mockGetTree.mockResolvedValue(mockTree);

      const tree = await getFolderTree();
      expect(tree).toHaveLength(1);
      expect(tree[0].id).toBe('2');
    });

    it('should not include children property when folder has no subfolders', async () => {
      const mockTree = [
        {
          id: '0',
          children: [
            {
              id: '1',
              title: 'Folder 1',
              children: [
                { id: '2', title: 'Bookmark 1', url: 'https://example.com' },
              ],
            },
          ],
        },
      ];
      mockGetTree.mockResolvedValue(mockTree);

      const tree = await getFolderTree();
      expect(tree[0].children).toBeUndefined();
    });
  });

  describe('getFoldersMap', () => {
    it('should create map of folder ids to titles', async () => {
      const mockTree = [
        {
          id: '0',
          children: [
            {
              id: '1',
              title: 'Folder 1',
              children: [
                { id: '2', title: 'Bookmark', url: 'https://example.com' },
              ],
            },
            {
              id: '3',
              title: 'Folder 2',
              children: [],
            },
          ],
        },
      ];
      mockGetTree.mockResolvedValue(mockTree);

      const map = await getFoldersMap();
      expect(map).toBeInstanceOf(Map);
      expect(map.get('1')).toBe('Folder 1');
      expect(map.get('3')).toBe('Folder 2');
    });

    it('should handle nested folders', async () => {
      const mockTree = [
        {
          id: '0',
          children: [
            {
              id: '1',
              title: 'Folder 1',
              children: [
                {
                  id: '2',
                  title: 'Subfolder',
                  children: [],
                },
              ],
            },
          ],
        },
      ];
      mockGetTree.mockResolvedValue(mockTree);

      const map = await getFoldersMap();
      expect(map.get('1')).toBe('Folder 1');
      expect(map.get('2')).toBe('Subfolder');
    });
  });

  describe('getBookmarksIterator', () => {
    it('should iterate over all bookmarks', async () => {
      const mockTree = [
        {
          id: '0',
          children: [
            {
              id: '1',
              title: 'Folder 1',
              children: [
                { id: '2', title: 'Bookmark 1', url: 'https://example.com' },
                { id: '3', title: 'Bookmark 2', url: 'https://google.com' },
              ],
            },
            { id: '4', title: 'Bookmark 3', url: 'https://github.com' },
          ],
        },
      ];
      mockGetTree.mockResolvedValue(mockTree);

      const bookmarks = [];
      for await (const bookmark of getBookmarksIterator()) {
        bookmarks.push(bookmark);
      }

      expect(bookmarks).toHaveLength(3);
      expect(bookmarks[0].id).toBe('2');
      expect(bookmarks[1].id).toBe('3');
      expect(bookmarks[2].id).toBe('4');
    });

    it('should handle empty tree', async () => {
      mockGetTree.mockResolvedValue([{ id: '0', children: [] }]);

      const bookmarks = [];
      for await (const bookmark of getBookmarksIterator()) {
        bookmarks.push(bookmark);
      }

      expect(bookmarks).toHaveLength(0);
    });

    it('should handle nested folders', async () => {
      const mockTree = [
        {
          id: '0',
          children: [
            {
              id: '1',
              title: 'Folder',
              children: [
                {
                  id: '2',
                  title: 'Subfolder',
                  children: [
                    { id: '3', title: 'Bookmark', url: 'https://example.com' },
                  ],
                },
              ],
            },
          ],
        },
      ];
      mockGetTree.mockResolvedValue(mockTree);

      const bookmarks = [];
      for await (const bookmark of getBookmarksIterator()) {
        bookmarks.push(bookmark);
      }

      expect(bookmarks).toHaveLength(1);
      expect(bookmarks[0].id).toBe('3');
    });
  });
});
