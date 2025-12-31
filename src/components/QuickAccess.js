/*
  QuickAccess
  - Small set of action shortcuts to create new expenses, receipts, trips and reports.
*/
import { useNavigate } from 'react-router-dom';

const QuickAccess = () => {
  const navigate = useNavigate();
  
  const handleNewExpense = () => {
    navigate('/expenses?new=true');
  };
  
  const handleAddReceipt = () => {
    navigate('/expenses?receipt=true');
  };
  
  // Open report creation modal (Dashboard listens to query param `report=true`)
  const handleCreateReport = () => {
    navigate('/dashboard?report=true');
  };
  
  const handleCreateTrip = () => {
    navigate('/trips?new=true');
  };

  return (
    <div className="card quick-access">
      <h2>Quick Access</h2>
      <div className="quick-actions">
        <button className="action-button new-expense" onClick={handleNewExpense}>
          <span className="button-icon">+</span>
          <span className="button-text">New expense</span>
        </button>
        
        <button className="action-button add-receipt" onClick={handleAddReceipt}>
          <span className="button-icon">+</span>
          <span className="button-text">Add receipt</span>
        </button>
        
        <button className="action-button create-report" onClick={handleCreateReport}>
          <span className="button-icon">+</span>
          <span className="button-text">Create report</span>
        </button>
        
        <button className="action-button create-trip" onClick={handleCreateTrip}>
          <span className="button-icon">+</span>
          <span className="button-text">Create trip</span>
        </button>
      </div>
    </div>
  );
};

export default QuickAccess;