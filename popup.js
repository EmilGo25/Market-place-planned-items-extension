// DOM elements
const itemNameInput = document.getElementById('item-name');
const itemPriceInput = document.getElementById('item-price');
const itemUrlInput = document.getElementById('item-url');
const addItemBtn = document.getElementById('add-item-btn');
const itemsList = document.getElementById('items-list');
const itemCount = document.getElementById('item-count');
const clearAllBtn = document.getElementById('clear-all-btn');
const toggleSettingsBtn = document.getElementById('toggle-settings-btn');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const settingsSection = document.getElementById('settings-section');
const whitelistSites = document.getElementById('whitelist-sites');

// Load items on popup open
loadItems();

// Load whitelist sites
loadWhitelistSites();

// Add item
addItemBtn.addEventListener('click', () => {
  const name = itemNameInput.value.trim();
  const price = itemPriceInput.value.trim();
  const url = itemUrlInput.value.trim();

  if (!name) {
    alert('Please enter an item name');
    return;
  }

  chrome.storage.local.get(['buyingList'], (result) => {
    const items = result.buyingList || [];
    items.push({
      name,
      price: price || null,
      url: url || null,
      addedAt: new Date().toISOString()
    });

    chrome.storage.local.set({ buyingList: items }, () => {
      itemNameInput.value = '';
      itemPriceInput.value = '';
      itemUrlInput.value = '';
      loadItems();
    });
  });
});

// Enter key to add item
itemNameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addItemBtn.click();
  }
});

// Load and display items
function loadItems() {
  chrome.storage.local.get(['buyingList'], (result) => {
    const items = result.buyingList || [];
    itemCount.textContent = items.length;

    if (items.length === 0) {
      itemsList.innerHTML = '<div class="empty-state">No items yet. Add your first item above!</div>';
      return;
    }

    itemsList.innerHTML = items.map((item, index) => `
      <div class="item-card">
        <div class="item-info">
          <div class="item-name">${escapeHtml(item.name)}</div>
          <div class="item-date">${formatDate(item.addedAt)}</div>
          ${item.price ? `<div class="item-price">${escapeHtml(item.price)}</div>` : ''}
          ${item.url ? `<a href="${item.url}" target="_blank" class="item-link">View on Amazon →</a>` : ''}
        </div>
        <button class="remove-btn" data-index="${index}">×</button>
      </div>
    `).join('');

    // Add remove functionality
    itemsList.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        removeItem(index);
      });
    });
  });
}

// Format date for display
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return diffMins <= 1 ? 'Just now' : `${diffMins} mins ago`;
    }
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}

// Remove item
function removeItem(index) {
  chrome.storage.local.get(['buyingList'], (result) => {
    const items = result.buyingList || [];
    items.splice(index, 1);
    chrome.storage.local.set({ buyingList: items }, () => {
      loadItems();
    });
  });
}

// Clear all items
clearAllBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all items?')) {
    chrome.storage.local.set({ buyingList: [] }, () => {
      loadItems();
    });
  }
});

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Toggle settings view
toggleSettingsBtn.addEventListener('click', () => {
  const mainContent = document.querySelectorAll('.add-item-section, .items-section, .popup-footer');
  const isSettingsVisible = settingsSection.style.display !== 'none';
  
  if (isSettingsVisible) {
    settingsSection.style.display = 'none';
    mainContent.forEach(el => el.style.display = 'block');
  } else {
    settingsSection.style.display = 'block';
    mainContent.forEach(el => el.style.display = 'none');
  }
});

closeSettingsBtn.addEventListener('click', () => {
  settingsSection.style.display = 'none';
  const mainContent = document.querySelectorAll('.add-item-section, .items-section, .popup-footer');
  mainContent.forEach(el => el.style.display = 'block');
});

// Load and display whitelisted sites
function loadWhitelistSites() {
  if (typeof WHITE_SITES === 'undefined') {
    whitelistSites.innerHTML = '<div class="error">Could not load whitelist configuration</div>';
    return;
  }

  const uniqueDomains = [...new Set(WHITE_SITES.map(site => {
    // Remove www. prefix for display
    return site.replace(/^www\./, '');
  }))];

  whitelistSites.innerHTML = uniqueDomains.map(site => `
    <div class="whitelist-item">
      <span class="site-icon">🌐</span>
      <span class="site-name">${escapeHtml(site)}</span>
    </div>
  `).join('');
}

