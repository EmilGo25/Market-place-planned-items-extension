// DOM elements
const itemNameInput = document.getElementById('item-name');
const itemPriceInput = document.getElementById('item-price');
const itemUrlInput = document.getElementById('item-url');
const addItemBtn = document.getElementById('add-item-btn');
const itemsList = document.getElementById('items-list');
const itemCount = document.getElementById('item-count');
const clearAllBtn = document.getElementById('clear-all-btn');

// Load items on popup open
loadItems();

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

