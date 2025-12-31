import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

// ExpenseForm component for adding/editing expenses
const ExpenseForm = ({ onClose, expenseToEdit }) => {
  const { teams, categories, addExpense, updateExpense } = useContext(AppContext);
  const [formData, setFormData] = useState(expenseToEdit || {
    subject: '',
    employee: '',
    team: '',
    amount: '',
    category: '',
    description: '',
    receiptText: ''
  });
  const [errors, setErrors] = useState({});
  
  // Validate form fields and return boolean
  const validateForm = () => {
    const newErrors = {};
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.employee) newErrors.employee = 'Employee name is required';
    if (!formData.team) newErrors.team = 'Team is required';
    if (!formData.amount) newErrors.amount = 'Amount is required';
    else if (isNaN(formData.amount) || formData.amount <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    // set validation state for the form
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes for both inputs and selects
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission: call add or update helper from context
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (expenseToEdit) {
      // Update existing expense
      updateExpense({ ...formData, id: expenseToEdit.id });
    } else {
      // Create a new expense
      addExpense(formData);
    }

    // Close modal after successful action
    onClose();
  };
/*
    Render: Expense Form Modal
    - Top header shows 'Edit' or 'New' depending on props
    - Form fields are controlled inputs bound to formData state
*/
  return (
    <div className="modal-backdrop">
      <div className="modal-content expense-form">
        <div className="modal-header">
          <h2>{expenseToEdit ? 'Edit Expense' : 'New Expense'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Subject field */}
          <div className="form-group">
            <label>Subject</label>
            <input 
              type="text" 
              name="subject" 
              value={formData.subject} 
              onChange={handleChange}
              className={errors.subject ? 'error' : ''}
            />
            {errors.subject && <div className="error-message">{errors.subject}</div>}
          </div>
          
          {/* Employee name */}
          <div className="form-group">
            <label>Employee</label>
            <input 
              type="text" 
              name="employee" 
              value={formData.employee} 
              onChange={handleChange}
              className={errors.employee ? 'error' : ''}
            />
            {errors.employee && <div className="error-message">{errors.employee}</div>}
          </div>
          
          {/* Team selector: populated from context `teams` */}
          <div className="form-group">
            <label>Team</label>
            <select 
              name="team" 
              value={formData.team} 
              onChange={handleChange}
              className={errors.team ? 'error' : ''}
            >
              <option value="">Select Team</option>
              {teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
            {errors.team && <div className="error-message">{errors.team}</div>}
          </div>
          
          {/* Amount input */}
          <div className="form-group">
            <label>Amount</label>
            <input 
              type="number" 
              name="amount" 
              value={formData.amount} 
              onChange={handleChange}
              step="0.01"
              min="0"
              className={errors.amount ? 'error' : ''}
            />
            {errors.amount && <div className="error-message">{errors.amount}</div>}
          </div>
          
          {/* Category selector: uses shared categories list */}
          <div className="form-group">
            <label>Category</label>
            <select 
              name="category" 
              value={formData.category || ''} 
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <textarea 
              name="description" 
              value={formData.description || ''} 
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>
          
          {/* Receipt details (text only) */}
          <div className="form-group">
            <label>Receipt</label>
            <textarea name="receiptText" value={formData.receiptText || ''} onChange={handleChange} rows="3" placeholder="Enter receipt details..."></textarea>
          </div>
          
          <div className="form-actions">
            <button onClick={handleSubmit} type="submit" className="btn btn-primary">
              {expenseToEdit ? 'Update Expense' : 'Add Expense'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;