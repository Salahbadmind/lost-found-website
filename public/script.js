// API Base URL
const API_URL = '/api/items';

// DOM Elements
const viewTab = document.getElementById('view-tab');
const addTab = document.getElementById('add-tab');
const tabButtons = document.querySelectorAll('.tab-btn');
const itemForm = document.getElementById('item-form');
const itemsContainer = document.getElementById('items-container');
const filterType = document.getElementById('filter-type');
const searchInput = document.getElementById('search-input');
const locationFilter = document.getElementById('location-filter');
const searchBtn = document.getElementById('search-btn');
const messageDiv = document.getElementById('message');
const usernameDisplay = document.getElementById('username-display');
const logoutBtn = document.getElementById('logout-btn');

// Check authentication and load user info
async function checkAuth() {
  try {
    const response = await fetch('/api/auth/me');
    if (response.status === 401) {
      window.location.href = '/login';
      return;
    }
    const result = await response.json();
    if (result.success && result.user) {
      usernameDisplay.textContent = `Welcome, ${result.user.username}!`;
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    window.location.href = '/login';
  }
}

// Logout
logoutBtn.addEventListener('click', async () => {
  fetch('/api/auth/logout', { method: 'POST' })
    .then(() => {
      window.location.href = '/login';
    })
    .catch(error => {
      console.error('Logout error:', error);
    });
});

// Tab switching
tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        
        // Update active tab button
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active tab content
        viewTab.classList.remove('active');
        addTab.classList.remove('active');
        
        if (tab === 'view') {
            viewTab.classList.add('active');
            loadItems();
        } else {
            addTab.classList.add('active');
        }
    });
});

// Load items on page load
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    loadItems();
});

// Load items from API
async function loadItems() {
    try {
        const params = new URLSearchParams();
        
        if (filterType.value) {
            params.append('type', filterType.value);
        }
        if (locationFilter.value) {
            params.append('location', locationFilter.value);
        }
        if (searchInput.value) {
            params.append('search', searchInput.value);
        }
        
        const url = params.toString() ? `${API_URL}?${params}` : API_URL;
        const response = await fetch(url);
        
        if (response.status === 401) {
            window.location.href = '/login';
            return;
        }
        
        const result = await response.json();
        
        if (result.success) {
            displayItems(result.data);
        } else {
            showMessage('Error loading items: ' + result.error, 'error');
        }
    } catch (error) {
        showMessage('Error loading items: ' + error.message, 'error');
        console.error('Error:', error);
    }
}

// Display items in the grid
function displayItems(items) {
    if (items.length === 0) {
        itemsContainer.innerHTML = `
            <div class="empty-state">
                <h2>No items found</h2>
                <p>Try adjusting your filters or add a new item!</p>
            </div>
        `;
        return;
    }
    
    itemsContainer.innerHTML = items.map(item => `
        <div class="item-card ${item.type}">
            <span class="item-type ${item.type}">${item.type.toUpperCase()}</span>
            <h3 class="item-name">${escapeHtml(item.name)}</h3>
            <p class="item-description">${escapeHtml(item.description)}</p>
            <p class="item-location">${escapeHtml(item.location)}</p>
            ${item.contactInfo ? `<p class="item-contact">📧 ${escapeHtml(item.contactInfo)}</p>` : ''}
            <p class="item-date">Posted: ${formatDate(item.createdAt)}</p>
            <div class="item-actions">
                <button class="btn btn-delete" onclick="deleteItem('${item._id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Handle form submission
itemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('item-name').value.trim(),
        description: document.getElementById('item-description').value.trim(),
        location: document.getElementById('item-location').value.trim(),
        type: document.getElementById('item-type').value,
        contactInfo: document.getElementById('item-contact').value.trim(),
        imageUrl: document.getElementById('item-image').value.trim()
    };
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Item added successfully!', 'success');
            itemForm.reset();
            
            // Switch to view tab and reload items
            tabButtons[0].click();
            loadItems();
        } else {
            showMessage('Error adding item: ' + result.error, 'error');
        }
    } catch (error) {
        showMessage('Error adding item: ' + error.message, 'error');
        console.error('Error:', error);
    }
});

// Delete item
async function deleteItem(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${itemId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Item deleted successfully!', 'success');
            loadItems();
        } else {
            showMessage('Error deleting item: ' + result.error, 'error');
        }
    } catch (error) {
        showMessage('Error deleting item: ' + error.message, 'error');
        console.error('Error:', error);
    }
}

// Search functionality
searchBtn.addEventListener('click', loadItems);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        loadItems();
    }
});
filterType.addEventListener('change', loadItems);
locationFilter.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        loadItems();
    }
});

// Show message
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    
    setTimeout(() => {
        messageDiv.classList.remove('success', 'error');
    }, 3000);
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

