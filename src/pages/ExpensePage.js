/*
  ExpensePage
  - Main expenses listing screen with filtering, new-expense modal and add-receipt modal.
  - Uses context helpers `addExpense` and `updateExpense` to persist data.
*/
import { useCallback, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import { AppContext } from '../context/AppContext';
import { formatCurrency } from '../utils/localStorage';

const ExpensePage = () => {
  const { expenses, teams, categories, addExpense, updateExpense, addToast } = useContext(AppContext);
  const [showNewExpenseForm, setShowNewExpenseForm] = useState(false);
  const [showReceiptUpload, setShowReceiptUpload] = useState(false);
  const [receiptText, setReceiptText] = useState('');
  const [receiptAmount, setReceiptAmount] = useState('');
  const [receiptCategory, setReceiptCategory] = useState('');
  const [selectedExpenseId, setSelectedExpenseId] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [filters, setFilters] = useState({
    team: '',
    dateFrom: '',
    dateTo: '',
    search: '',
  });
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const applyFilters = useCallback(() => {
    let result = [...expenses];
    
    // Apply team filter
    if (filters.team) {
      result = result.filter(expense => expense.team === filters.team);
    }
    
    // Apply date range filter
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter(expense => new Date(expense.date) >= fromDate);
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of the day
      result = result.filter(expense => new Date(expense.date) <= toDate);
    }
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(expense => 
        expense.subject.toLowerCase().includes(searchLower) ||
        expense.employee.toLowerCase().includes(searchLower) ||
        expense.description?.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by date (newest first)
    result.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setFilteredExpenses(result);
  }, [expenses, filters.team, filters.dateFrom, filters.dateTo, filters.search]);
  
  useEffect(() => {
    // Check URL parameters
    const params = new URLSearchParams(location.search);
    if (params.get('new') === 'true') {
      setShowNewExpenseForm(true);
    }
    if (params.get('receipt') === 'true') {
      setShowReceiptUpload(true);
    }
    
    // Clear URL parameters after checking
    if (params.has('new') || params.has('receipt')) {
      navigate('/expenses', { replace: true });
    }
    
    // Apply initial filtering
    applyFilters();
  }, [location, navigate, applyFilters]);
  
  
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    applyFilters();
  };
  
  const clearFilters = () => {
    setFilters({
      team: '',
      dateFrom: '',
      dateTo: '',
      search: '',
    });
    setFilteredExpenses([...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)));
  };
  
  const handleNewExpense = () => {
    setShowNewExpenseForm(true);
  };
  
  const handleUploadReceipt = () => {
    setShowReceiptUpload(true);
  };
  
  const closeModal = () => {
    setShowNewExpenseForm(false);
    setShowReceiptUpload(false);
  };

  // Handle saving a receipt (either attach to existing expense or create as new expense)
  const handleSaveReceipt = () => {
    if (!receiptText.trim() && !(receiptAmount && receiptAmount !== '')) {
      addToast({ type: 'error', message: 'Please enter receipt details or amount.' });
      return;
    }

    const amountValue = receiptAmount && receiptAmount !== '' ? parseFloat(receiptAmount) : null;

    if (selectedExpenseId) {
      // Update selected expense with receipt info
      const exp = expenses.find(e => e.id === selectedExpenseId);
      if (exp) {
        const updated = { ...exp };
        if (receiptText.trim()) updated.receiptText = receiptText;
        if (amountValue !== null && !isNaN(amountValue)) updated.amount = amountValue.toString();
        if (receiptCategory) updated.category = receiptCategory;
        updateExpense(updated);
        addToast({ type: 'success', message: 'Receipt saved to selected expense.' });
      }
    } else {
      // Create a new expense from the receipt
      addExpense({
        subject: 'Receipt',
        employee: '',
        team: '',
        amount: (amountValue !== null && !isNaN(amountValue)) ? amountValue.toString() : '0',
        category: receiptCategory || '',
        description: receiptText,
        receiptText
      });
      addToast({ type: 'success', message: 'Receipt added as a new expense.' });
    }

    // Reset form and close modal
    setReceiptText('');
    setReceiptAmount('');
    setReceiptCategory('');
    setSelectedExpenseId('');
    setShowReceiptUpload(false);
  };

  return (
    <div className="expense-page">
      <div className="page-header">
        <h1>Expenses</h1>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleNewExpense}>+ New Expense</button>
          <button className="btn btn-secondary" onClick={handleUploadReceipt}>+ Add Receipt</button>
        </div>
      </div>
      
      <div className="filter-section">
        <form onSubmit={handleFilterSubmit}>
          <div className="filter-row">
            <div className="filter-group">
              <label>Team</label>
              <select 
                name="team" 
                value={filters.team} 
                onChange={handleFilterChange}
              >
                <option value="">All Teams</option>
                {teams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>From</label>
              <input 
                type="date" 
                name="dateFrom" 
                value={filters.dateFrom} 
                onChange={handleFilterChange} 
              />
            </div>
            
            <div className="filter-group">
              <label>To</label>
              <input 
                type="date" 
                name="dateTo" 
                value={filters.dateTo} 
                onChange={handleFilterChange} 
              />
            </div>
            
            <div className="filter-group search-group">
              <input 
                type="text" 
                name="search" 
                placeholder="Search expenses..." 
                value={filters.search} 
                onChange={handleFilterChange} 
              />
            </div>
            
            <div className="filter-actions">
              <button type="submit" className="btn btn-filter">Filter</button>
              <button type="button" className="btn btn-clear" onClick={clearFilters}>Clear</button>
            </div>
          </div>
        </form>
      </div>
      
      <div className="expense-summary">
        <div className="summary-item">
          <span className="summary-label">Total</span>
          <span className="summary-value">
            {formatCurrency(filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0))}
          </span>
        </div>
        
        <div className="summary-item">
          <span className="summary-label">Count</span>
          <span className="summary-value">{filteredExpenses.length}</span>
        </div>
      </div>
      
      <ExpenseList expenses={filteredExpenses} />
      
      {showNewExpenseForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Expense</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <ExpenseForm onClose={closeModal} />
          </div>
        </div>
      )}
      
      {showReceiptUpload && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Receipt Details</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="receipt-upload-form">
              <div className="form-group">
                <label>Receipt Amount</label>
                <input type="number" step="0.01" value={receiptAmount} onChange={(e) => setReceiptAmount(e.target.value)} placeholder="0.00" />
              </div>

              <div className="form-group">
                <label>Receipt Details</label>
                <textarea value={receiptText} onChange={(e) => setReceiptText(e.target.value)} rows={4} placeholder="Enter receipt details" />
              </div>

              <div className="form-group">
                <label>Category (Optional)</label>
                <select value={receiptCategory} onChange={(e) => setReceiptCategory(e.target.value)}>
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Related Expense (Optional)</label>
                <select value={selectedExpenseId} onChange={(e) => setSelectedExpenseId(e.target.value)}>
                  <option value="">Select an expense</option>
                  {expenses.map(exp => (
                    <option key={exp.id} value={exp.id}>
                      {exp.subject} - {formatCurrency(exp.amount)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" disabled={!(receiptText.trim() || receiptAmount)} onClick={handleSaveReceipt}>Save</button>
                <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensePage;