# FavBox

<p align="center">
<a href="https://github.com/dd3v/favbox/issues"><img src="https://img.shields.io/github/issues/dd3v/favbox" alt="issues"></a>
<a href="https://github.com/dd3v/favbox"><img src="https://img.shields.io/github/package-json/v/dd3v/favbox" alt="ver"></a>
<a href="https://github.com/dd3v/favbox"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="license"></a>
<a href="https://github.com/dd3v/favbox"><img src="https://img.shields.io/badge/Made%20With-Love-orange.svg" alt="love"></a>
</p>

![image](app_demo.png) 

<p align="center">
<a href="https://chrome.google.com/webstore/detail/favbox/eangbddipcghohfjefjmfihcjgjnnemj">
<img src="https://img.shields.io/badge/Google%20Chrome-4285F4?style=for-the-badge&logo=GoogleChrome&logoColor=white">
</a>
</p>


FavBox is a local-first **experimental** browser extension that enhances and simplifies bookmark management without cloud storage or third-party services. It extends your browser's native bookmarking features.

Key features:

🔄 Syncs with your browser profile \
🔒 No data sent to third-party services\
🎨 Minimalist, clean UI\
🏷️ Tag support for easy organization\
🔍 Advanced search, sorting, and filtering by tags, domains, folders, and keywords\
🌁 Multiple display modes\
🌗 Light and dark themes\
🗑️ Detects broken and duplicate bookmarks\
⌨️ Hotkeys for quick search access\
🗒️ Local notes support\
❤️ Free and open source

### Concept

![image](concept.png) 

### Implementation

FavBox scans all bookmarks in the browser, then makes requests to the saved pages and extracts data from them such as title, description, image, and meta tags to improve the search. All the data is stored in local storage IndexedDB. The extension also tracks all browser events related to bookmarks and synchronizes the data. It only extends the standard functionality and does not attempt to replace it. You can work with bookmarks both through the extension and the native browser’s built-in bookmark features.


FavBox is a fully local application. To keep tags synced across devices, it uses a trick. Since bookmarks are synchronized between devices, to keep tags synchronized, the app adds them to the page title.

For example, if you have a bookmark titled `Google Chrome — Wikipedia`, to save tags across devices, extension appends them to the title like this:
`Google Chrome — Wikipedia 🏷 #wiki #browser`

This way, your tags become available on other devices without using any cloud services — only through the standard Google Chrome profile sync.


```
├── public                 # Static assets (icons, etc.)
│   └── icons
├── src                    # Source code
│   ├── assets             # Global assets
│   ├── components         # Common reusable app components
│   │   └── app
│   ├── ext                # Browser extension includes main app, popup, content script, and service worker
│   │   ├── browser        # FavBox app
│   │   │   ├── components # FavBox components
│   │   │   ├── layouts   
│   │   │   └── views
│   │   ├── content        # Content scripts
│   │   ├── popup          # Extension PopUp window
│   │   └── sw             # Service Worker of the browser extension
│   ├── helpers            # Shared utilities
│   ├── parser             # Library to parse HTML content
│   ├── storage            # IndexedDB storage
│   │   └── idb
│   └── workers            # JS Workers
└── tests
    ├── integration
    └── unit
```

### Building
1. `pnpm run build` to build into `dist`
2. Enable dev mode in `chrome://extensions/` and `Load unpacked` extension

### Commands

- **`dev`**  Start development server  
- **`dev:firefox`**  Firefox development build (WIP)
- **`build`**  Production build  
- **`test:unit`** Run unit tests  
- **`test:integration`**   Run integration tests  

### TODO
- Use SQLite Wasm for storage (ideal for future experiments)
- Improve transaction implementation (ensure reliability & better performance)
- The extension already uses a polyfill to maintain compatibility with other browsers. It would be good to test this in Firefox. (WIP)