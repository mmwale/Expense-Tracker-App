/*
  localStorage.js
  - Wrapper helpers around browser localStorage to keep persistence logic centralized and guarded.
  - Provides safe JSON serialization/deserialization and small collection helpers used by AppContext.
*/

// Save data to localStorage
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Get data from localStorage
export const getFromLocalStorage = (key, defaultValue = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error('Error getting from localStorage:', error);
    return defaultValue;
  }
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Add a new item to a stored collection
export const addItem = (key, item) => {
  const currentItems = getFromLocalStorage(key, []);
  const updatedItems = [...currentItems, item];
  saveToLocalStorage(key, updatedItems);
  return updatedItems;
};

// Delete an item from a stored collection
export const deleteItem = (key, itemId) => {
  const currentItems = getFromLocalStorage(key, []);
  const updatedItems = currentItems.filter(item => item.id !== itemId);
  saveToLocalStorage(key, updatedItems);
  return updatedItems;
};

// Update an item in a stored collection
export const updateItem = (key, updatedItem) => {
  const currentItems = getFromLocalStorage(key, []);
  const updatedItems = currentItems.map(item => 
    item.id === updatedItem.id ? updatedItem : item
  );
  saveToLocalStorage(key, updatedItems);
  return updatedItems;
};

// Get the next ID for a new item
export const getNextId = (key) => {
  const items = getFromLocalStorage(key, []);
  if (items.length === 0) return 1;
  
  const maxId = Math.max(...items.map(item => 
    typeof item.id === 'number' ? item.id : parseInt(item.id) || 0
  ));
  return maxId + 1;
};