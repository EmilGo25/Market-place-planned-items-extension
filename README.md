# Buying Board Chrome Extension

A Chrome extension that displays your planned buying list when you visit Amazon.com.

## Features

- 📝 Add items to your buying list with name, price, and Amazon URL
- 🛒 View your list as a sidebar on Amazon.com pages
- 🗑️ Remove items from the list
- 💾 Items are saved locally in your browser
- 🎨 Modern, clean UI

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in the top right)
3. Click "Load unpacked"
4. Select this extension folder
5. The extension is now installed!

## Usage

### Adding Items

1. Click the extension icon in your Chrome toolbar
2. Enter the item name (required)
3. Optionally add a price and Amazon URL
4. Click "Add Item"

### Viewing Your List on Amazon

1. Visit any Amazon.com page
2. Your buying list will automatically appear as a sidebar on the right side
3. Click the "−" button to collapse/expand the list
4. Click "×" on any item to remove it

### Managing Items

- Use the extension popup to add, view, and remove items
- Changes sync automatically between the popup and the Amazon sidebar
- Click "Clear All" to remove all items at once

## Files Structure

- `manifest.json` - Extension configuration
- `popup.html` - Extension popup UI
- `popup.js` - Popup functionality
- `popup.css` - Popup styling
- `content.js` - Script that runs on Amazon.com
- `styles.css` - Sidebar styling
- `README.md` - This file

## Permissions

- `storage` - To save your buying list locally
- `host_permissions` - To run on Amazon.com pages

## Notes

- All data is stored locally in your browser
- The extension only works on Amazon.com pages
- You can add items even without visiting Amazon

