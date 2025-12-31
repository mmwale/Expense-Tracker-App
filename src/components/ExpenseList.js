import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { formatCurrency } from '../utils/localStorage';
import ExpenseForm from './ExpenseForm';
/*
  ExpenseList
  - Displays a table of expenses with sorting, bulk actions (export/delete), and per-item actions (edit/delete).
  - Controlled selections are stored in `selectedExpenses` for bulk operations.
*/
const ExpenseList = ({ expenses }) => {
  // Context helpers
  const { deleteExpense } = useContext(AppContext);
  // Local UI state
  const [editingExpense, setEditingExpense] = useState(null); // expense currently being edited
  const [selectedExpenses, setSelectedExpenses] = useState([]); // ids selected for bulk ops
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc'
  });
  // Handle edit action
  const handleEdit = (expense) => {
    setEditingExpense(expense);
  };
  // Handle delete action
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
    }
  };
  // Close edit form
  const closeEditForm = () => {
    setEditingExpense(null);
  };
  // Handle selection of individual expense
  const handleSelectExpense = (id) => {
    if (selectedExpenses.includes(id)) {
      setSelectedExpenses(selectedExpenses.filter(expId => expId !== id));
    } else {
      setSelectedExpenses([...selectedExpenses, id]);
    }
  };
  // Handle select all expenses
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedExpenses(expenses.map(exp => exp.id));
    } else {
      setSelectedExpenses([]);
    }
  };
// Handle bulk delete action
  const handleDeleteSelected = () => {
    if (selectedExpenses.length === 0) return;
    if (!window.confirm(`Delete ${selectedExpenses.length} selected expense(s)?`)) return;
    selectedExpenses.forEach(id => deleteExpense(id));
    setSelectedExpenses([]);
  };
// Handle bulk export action - create CSV and trigger download
  const handleExportSelected = () => {
    if (selectedExpenses.length === 0) return;

    // Build CSV rows (header + selected rows)
    const rows = [['Date','Subject','Employee','Team','Amount','Category','Description']];
    const selected = expenses.filter(exp => selectedExpenses.includes(exp.id));
    selected.forEach(exp => {
      rows.push([new Date(exp.date).toLocaleDateString(), exp.subject, exp.employee, exp.team, exp.amount, exp.category || '', exp.description || '']);
    });

    // Escape and join into CSV string
    const csvContent = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(',')).join('\n');

    // Trigger browser download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses_export_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  // Get sorted expenses
  const getSortedExpenses = () => {
    const sortableExpenses = [...expenses];
    if (sortConfig.key) {
      sortableExpenses.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableExpenses;
  };
  // Get sorted expenses
  const sortedExpenses = getSortedExpenses();
  // Get sort indicator for column headers
  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
    }
    return '';
  };
  // Render the expense list
  return (
    <div className="expense-list">
      {sortedExpenses.length === 0 ? (
        <div className="no-expenses">
          <p>No expenses found. Create a new expense to get started.</p>
        </div>
      ) : (
        <>
          <div className="bulk-actions">
            <div className="select-all">
              <input 
                type="checkbox"
                checked={selectedExpenses.length === expenses.length && expenses.length > 0}
                onChange={handleSelectAll}
              />
              <span>Select All</span>
            </div>
            
            {selectedExpenses.length > 0 && (
              <div className="bulk-buttons">
                <button className="btn btn-secondary" onClick={handleExportSelected}>Export Selected</button>
                <button className="btn btn-danger" onClick={handleDeleteSelected}>Delete Selected</button>
              </div>
            )}
          </div>
          
          <table className="expense-table">
            <thead>
              <tr>
                <th className="select-column"></th>
                <th className="sortable" onClick={() => handleSort('date')}>
                  Date{getSortIndicator('date')}
                </th>
                <th className="sortable" onClick={() => handleSort('subject')}>
                  Subject{getSortIndicator('subject')}
                </th>
                <th className="sortable" onClick={() => handleSort('employee')}>
                  Employee{getSortIndicator('employee')}
                </th>
                <th className="sortable" onClick={() => handleSort('team')}>
                  Team{getSortIndicator('team')}
                </th>
                <th className="sortable" onClick={() => handleSort('category')}>
                  Category{getSortIndicator('category')}
                </th>
                <th className="sortable amount-column" onClick={() => handleSort('amount')}>
                  Amount{getSortIndicator('amount')}
                </th>
                <th className="actions-column">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedExpenses.map(expense => (
                <tr key={expense.id} className={expense.reported ? 'reported' : ''}>
                  <td>
                    <input 
                      type="checkbox"
                      checked={selectedExpenses.includes(expense.id)}
                      onChange={() => handleSelectExpense(expense.id)}
                    />
                  </td>
                  <td>{new Date(expense.date).toLocaleDateString()}</td>
                  <td>{expense.subject}</td>
                  <td>{expense.employee}</td>
                  <td>
                    <span className={`team-badge ${expense.team?.toLowerCase()}`}>
                      {expense.team}
                    </span>
                  </td>
                  <td>{expense.category || ''}</td>
                  <td className="amount-column">{formatCurrency(expense.amount)}</td>
                  <td className="actions-column">
                    <button 
                      className="action-btn edit-btn" 
                      onClick={() => handleEdit(expense)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button 
                      className="action-btn delete-btn" 
                      onClick={() => handleDelete(expense.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      
      {editingExpense && (
        <ExpenseForm 
          expenseToEdit={editingExpense} 
          onClose={closeEditForm} 
        />
      )}
    </div>
  );
};

export default ExpenseList;