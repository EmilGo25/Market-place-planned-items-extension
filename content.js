// Create the buying board sidebar
function createBuyingBoard() {
  // Check if board already exists
  if (document.getElementById('buying-board-extension')) {
    return;
  }

  const board = document.createElement('div');
  board.id = 'buying-board-extension';
  board.className = 'buying-board-container';

  // Collapsed circle view
  const collapsedView = document.createElement('div');
  collapsedView.id = 'buying-board-collapsed';
  collapsedView.className = 'buying-board-collapsed';
  collapsedView.innerHTML = `
    <div class="collapsed-count">0</div>
  `;

  const header = document.createElement('div');
  header.className = 'buying-board-header';
  header.innerHTML = `
    <h3 class="drag-handle">🛒 My Buying List</h3>
    <button id="buying-board-toggle" class="toggle-btn">−</button>
  `;

  // Add item form
  const addItemForm = document.createElement('div');
  addItemForm.id = 'buying-board-add-form';
  addItemForm.className = 'buying-board-add-form';
  addItemForm.innerHTML = `
    <input type="text" id="sidebar-item-name" placeholder="Add new item..." class="sidebar-input">
    <button id="sidebar-add-btn" class="sidebar-add-btn">+</button>
  `;

  const contentWrapper = document.createElement('div');
  contentWrapper.id = 'buying-board-content';
  contentWrapper.className = 'buying-board-content';
  
  const listContainer = document.createElement('div');
  listContainer.id = 'buying-board-list';
  listContainer.className = 'buying-board-list';

  contentWrapper.appendChild(addItemForm);
  contentWrapper.appendChild(listContainer);

  board.appendChild(collapsedView);
  board.appendChild(header);
  board.appendChild(contentWrapper);

  // Add to page
  document.body.appendChild(board);

  // Make draggable
  makeDraggable(board, header, collapsedView);

  // Load and display items
  loadItems();

  // Toggle collapse/expand
  const toggleBtn = document.getElementById('buying-board-toggle');
  toggleBtn.addEventListener('click', () => {
    toggleCollapsed();
  });

  // Click collapsed circle to expand
  collapsedView.addEventListener('click', () => {
    toggleCollapsed();
  });

  function toggleCollapsed() {
    const content = document.getElementById('buying-board-content');
    const headerEl = document.querySelector('.buying-board-header');
    const collapsedEl = document.getElementById('buying-board-collapsed');
    const isCollapsed = board.classList.contains('collapsed');
    
    if (isCollapsed) {
      // Expand
      board.classList.remove('collapsed');
      content.style.display = 'block';
      headerEl.style.display = 'flex';
      collapsedEl.style.display = 'none';
      toggleBtn.textContent = '−';
    } else {
      // Collapse
      board.classList.add('collapsed');
      content.style.display = 'none';
      headerEl.style.display = 'none';
      collapsedEl.style.display = 'flex';
      toggleBtn.textContent = '+';
    }
  }

  // Add item from sidebar
  const sidebarAddBtn = document.getElementById('sidebar-add-btn');
  const sidebarItemName = document.getElementById('sidebar-item-name');
  
  sidebarAddBtn.addEventListener('click', () => {
    addItemFromSidebar();
  });

  sidebarItemName.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addItemFromSidebar();
    }
  });

  // Listen for storage changes from popup
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.buyingList) {
      loadItems();
    }
  });
}

// Add item from sidebar
function addItemFromSidebar() {
  const nameInput = document.getElementById('sidebar-item-name');
  const name = nameInput.value.trim();

  if (!name) return;

  chrome.storage.local.get(['buyingList'], (result) => {
    const items = result.buyingList || [];
    items.push({
      name,
      price: null,
      url: null,
      addedAt: new Date().toISOString()
    });

    chrome.storage.local.set({ buyingList: items }, () => {
      nameInput.value = '';
      loadItems();
    });
  });
}

// Make element draggable
function makeDraggable(element, handle, collapsedHandle) {
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;

  handle.style.cursor = 'move';
  collapsedHandle.style.cursor = 'move';

  handle.addEventListener('mousedown', dragStart);
  collapsedHandle.addEventListener('mousedown', dragStartCollapsed);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', dragEnd);

  function dragStart(e) {
    if (e.target.classList.contains('toggle-btn')) return;
    
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;

    if (e.target === handle || e.target.classList.contains('drag-handle')) {
      isDragging = true;
      document.body.classList.add('buying-board-dragging');
      e.preventDefault();
    }
  }

  function dragStartCollapsed(e) {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
    isDragging = true;
    document.body.classList.add('buying-board-dragging');
    e.stopPropagation();
    e.preventDefault();
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault();
      
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;

      xOffset = currentX;
      yOffset = currentY;

      setTranslate(currentX, currentY, element);
    }
  }

  function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
    document.body.classList.remove('buying-board-dragging');
  }

  function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
  }
}

// Load items from storage and display them
function loadItems() {
  chrome.storage.local.get(['buyingList'], (result) => {
    const listContainer = document.getElementById('buying-board-list');
    if (!listContainer) return;

    const items = result.buyingList || [];
    
    // Update collapsed view count
    const collapsedCount = document.querySelector('.collapsed-count');
    if (collapsedCount) {
      collapsedCount.textContent = items.length;
    }
    
    if (items.length === 0) {
      listContainer.innerHTML = '<div class="empty-state">No items yet. Add one above!</div>';
      return;
    }

    listContainer.innerHTML = items.map((item, index) => `
      <div class="buying-board-item" data-index="${index}">
        <div class="item-content">
          <div class="item-name">${escapeHtml(item.name)}</div>
          <div class="item-date">${formatDate(item.addedAt)}</div>
          ${item.price ? `<div class="item-price">${escapeHtml(item.price)}</div>` : ''}
          ${item.url ? `<a href="${item.url}" target="_blank" class="item-link">View on Amazon</a>` : ''}
        </div>
        <button class="item-remove" data-index="${index}" title="Remove item">×</button>
      </div>
    `).join('');

    // Add remove functionality
    listContainer.querySelectorAll('.item-remove').forEach(btn => {
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

// Remove item from list
function removeItem(index) {
  chrome.storage.local.get(['buyingList'], (result) => {
    const items = result.buyingList || [];
    items.splice(index, 1);
    chrome.storage.local.set({ buyingList: items }, () => {
      loadItems();
    });
  });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createBuyingBoard);
} else {
  createBuyingBoard();
}

// Re-initialize on navigation (SPA behavior)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(createBuyingBoard, 1000);
  }
}).observe(document, { subtree: true, childList: true });

