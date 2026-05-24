# Chronodex

A minimalist, customizable Chronodex planner for your Chrome New Tab page.

Current version: `1.1.0`

![screenshot](https://raw.githubusercontent.com/She110ck/chronodex/main/chronodex-1200.png)

## What It Does

Chronodex turns your new tab into a visual planner for the whole day. You can create time segments, resize and rotate them directly on the clock, rename them, recolor them, reorder them, and save the layout locally in Chrome.

## Features

- 24-hour Chronodex clock with `12` at the top and `0` at the bottom
- Editable colored time segments
- Segment list with title, duration, color, and remove controls
- Drag-and-drop segment reordering from the side panel
- Light and dark modes
- 24-hour and 12-hour clock label modes
- Local persistence with Chrome storage
- Responsive canvas resizing
- PNG export for printing or saving a paper-style Chronodex
- Chrome New Tab override

## Install Locally

1. Clone the repo:

```bash
git clone https://github.com/She110ck/chronodex.git
```

2. Open Chrome extensions:

```text
chrome://extensions
```

3. Enable Developer mode.

4. Click Load unpacked and select the `chronodex` folder.

## Package For Release

Create a Chrome Web Store-ready ZIP from the project root:

```bash
zip -r ../chronodex-extension.zip manifest.json index.html css scripts icons README.md LICENSE chronodex-1200.png
```

Before uploading a new release, update the `version` field in `manifest.json`.

The current packaged release is:

```text
../chronodex-extension.zip
```

## Roadmap

- Consider smoother current-time hands if CPU usage becomes a real issue
- Add editable data import/export if cross-device setup sharing becomes useful

## FAQ

**Why canvas?**  
Chronodex is highly visual and interactive, and canvas made the original prototype quick to build. SVG could also work well for this kind of planner.

**Can I export my planner?**  
Yes. Use the download button in the top-right corner to export the current Chronodex as a PNG.

**Does it sync between browsers or devices?**  
No. Segment data is saved locally with `chrome.storage.local`.

**Can I print it?**  
Yes. Export the PNG, then print it from your image viewer or browser.

**Can I change the list order?**  
Yes. Open the side panel and drag segment rows into the order you want.
