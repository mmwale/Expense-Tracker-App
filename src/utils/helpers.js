/*
  helpers.js
  - Small collection of reusable utility functions used across the app for formatting, grouping and basic transforms.
  - Keep these pure and side-effect free to ease testing and reuse.
*/

// Date formatting functions
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Format currency
  export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Group expenses by category
  export const groupByCategory = (expenses) => {
    return expenses.reduce((acc, expense) => {
      const category = expense.category || 'Other';
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += parseFloat(expense.amount);
      return acc;
    }, {});
  };
  
  // Group expenses by team
  export const groupByTeam = (expenses) => {
    return expenses.reduce((acc, expense) => {
      const team = expense.team || 'Unassigned';
      if (!acc[team]) {
        acc[team] = 0;
      }
      acc[team] += parseFloat(expense.amount);
      return acc;
    }, {});
  };
  
  // Group expenses by date
  export const groupByDate = (expenses) => {
    return expenses.reduce((acc, expense) => {
      const date = formatDate(expense.date);
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += parseFloat(expense.amount);
      return acc;
    }, {});
  };
  
  // Format data for chart display
  export const formatChartData = (data) => {
    return Object.keys(data).map(key => ({
      label: key,
      value: data[key]
    }));
  };
  
  // Calculate total expenses
  export const calculateTotal = (expenses) => {
    return expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0).toFixed(2);
  };
  
  // Generate a unique ID
  export const generateId = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
  };
  
  // Filter expenses by date range
  export const filterByDateRange = (expenses, startDate, endDate) => {
    if (!startDate && !endDate) return expenses;
    
    let filtered = [...expenses];
    
    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter(expense => new Date(expense.date) >= start);
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter(expense => new Date(expense.date) <= end);
    }
    
    return filtered;
  };