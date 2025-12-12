# Buying Board Chrome Extension

A Chrome extension that displays your planned buying list when you visit shopping websites.

## Features

- 📝 Add items to your buying list with name, price, and URL
- 🛒 View your list as a sidebar on whitelisted shopping sites
- 🌐 Works on multiple shopping sites (Amazon, eBay, Walmart, Target, Best Buy, etc.)
- 🔒 Whitelist configuration to control which sites show the extension
- 🗑️ Remove items from the list
- 💾 Items are saved locally in your browser
- 🎨 Modern, clean UI
- ⚙️ Settings panel to view whitelisted sites

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
3. Optionally add a price and URL
4. Click "Add Item"

### Viewing Your List on Shopping Sites

1. Visit any whitelisted shopping site (e.g., Amazon, eBay, Walmart)
2. Your buying list will automatically appear as a sidebar on the right side
3. Click the "−" button to collapse/expand the list
4. Click "×" on any item to remove it
5. The sidebar is draggable - click and drag the header to reposition it

### Managing Items

- Use the extension popup to add, view, and remove items
- Changes sync automatically between the popup and the website sidebar
- Click "Clear All" to remove all items at once

### Configuring Whitelisted Sites

1. Click the extension icon to open the popup
2. Click the "⚙️ Settings" button at the bottom
3. View the list of whitelisted shopping sites
4. To add or remove sites, edit the `config.js` file

**Default Whitelisted Sites:**
- Amazon (all regions: .com, .co.uk, .ca, .de)
- eBay
- Walmart
- Target
- Best Buy

## Files Structure

- `manifest.json` - Extension configuration
- `config.js` - Whitelist configuration for allowed sites
- `popup.html` - Extension popup UI
- `popup.js` - Popup functionality
- `popup.css` - Popup styling
- `content.js` - Script that runs on whitelisted sites
- `styles.css` - Sidebar styling
- `README.md` - This file

## Permissions

- `storage` - To save your buying list locally
- `host_permissions` - To run on whitelisted shopping sites

## Customizing the Whitelist

To customize which sites the extension works on:

1. Open `config.js` in the extension folder
2. Edit the `WHITE_SITES` array to add or remove domains
3. Example:
   ```javascript
   const WHITE_SITES = [
     'amazon.com',
     'www.amazon.com',
     'ebay.com',
     'www.ebay.com',
     // Add your custom shopping sites here
   ];
   ```
4. Save the file and reload the extension in Chrome

**Tips:**
- Include both `www` and non-`www` versions of domains if needed
- Use base domain names (e.g., `amazon.com` works for all Amazon subdomains)
- The extension automatically checks for subdomain matches

## Notes

- All data is stored locally in your browser
- The extension only works on whitelisted shopping sites
- You can add items even without visiting a shopping site
- The sidebar can be repositioned by dragging
- Settings can be accessed via the popup to view active sites

