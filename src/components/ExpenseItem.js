/*
  ExpenseItem
  - Small presentational component for a single expense tile in lists/card views.
  - Shows date, subject, employee, team badge, amount, and action buttons (edit/delete).
*/
import { formatCurrency } from '../utils/localStorage';

const ExpenseItem = ({ expense, onEdit, onDelete }) => {
  // Destructure expense object
  const { id, subject, employee, team, amount, date, reported } = expense;
  
  // Format date for display
  const formattedDate = new Date(date).toLocaleDateString();

  // Render the expense item
  return (
    <div className={`expense-item ${reported ? 'reported' : ''}`}>
      <div className="expense-date">{formattedDate}</div>
      <div className="expense-details">
        <div className="expense-subject">{subject}</div>
        <div className="expense-employee">{employee}</div>
        <div className="expense-team">
          <span className={`team-badge ${team?.toLowerCase()}`}>{team}</span>
        </div>
      </div>
      <div className="expense-amount">{formatCurrency(amount)}</div>
      <div className="expense-actions">
        <button 
          className="action-btn edit-btn" 
          onClick={() => onEdit(expense)}
          title="Edit"
        >
          ✏️
        </button>
        <button 
          className="action-btn delete-btn" 
          onClick={() => onDelete(id)}
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default ExpenseItem;