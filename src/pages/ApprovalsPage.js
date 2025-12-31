import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { formatCurrency } from '../utils/localStorage';

const ApprovalsPage = () => {
  const { expenses, approveExpense, rejectExpense, updateExpense } = useAppContext();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Processed approvals (approved/rejected) view state
  const [processedView, setProcessedView] = useState('all'); // 'all' | 'approved' | 'rejected'
  const [processedSortBy, setProcessedSortBy] = useState('date');

  // Undo a processed approval by setting its status back to 'pending'
  const undoApproval = (expense) => {
    updateExpense({ ...expense, status: 'pending' });
  };

  // Filter expenses needing approval
  const pendingApprovals = expenses.filter(expense => expense.status === 'pending');

  // Processed approvals
  const processedApprovals = expenses.filter(expense => expense.status === 'approved' || expense.status === 'rejected');

  const filteredApprovals = pendingApprovals.filter(expense => {
    if (filter === 'high') return parseFloat(expense.amount) > 1000;
    if (filter === 'medium') return parseFloat(expense.amount) <= 1000 && parseFloat(expense.amount) > 500;
    if (filter === 'low') return parseFloat(expense.amount) <= 500;
    return true;
  });

  const filteredProcessed = processedApprovals.filter(expense => {
    if (processedView === 'approved') return expense.status === 'approved';
    if (processedView === 'rejected') return expense.status === 'rejected';
    return true;
  });

  const sortedApprovals = [...filteredApprovals].sort((a, b) => {
    if (sortBy === 'amount') return parseFloat(b.amount) - parseFloat(a.amount);
    return new Date(b.date) - new Date(a.date);
  });

  const sortedProcessed = [...filteredProcessed].sort((a, b) => {
    if (processedSortBy === 'amount') return parseFloat(b.amount) - parseFloat(a.amount);
    return new Date(b.date) - new Date(a.date);
  });

  // Note: pending/filtered/sorted approvals are defined above — no duplicates here.

  return (
    <div className="approvals-page">
      <h1>Approvals</h1>
      <div className="approvals-controls">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Expenses</option>
          <option value="high">High ({'>'}$1000)</option>
          <option value="medium">Medium ($500-$1000)</option>
          <option value="low">Low ({'<'}$500)</option>
        </select>
        
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
        </select>
      </div>
      <div className="approvals-list">
        <h2>Pending Approvals</h2>
        <div className="approvals-controls">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="high">High ({'>'}$1000)</option>
            <option value="medium">Medium ($500-$1000)</option>
            <option value="low">Low ({'<'}$500)</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>
        </div>

        {sortedApprovals.length > 0 ? (
          sortedApprovals.map(expense => (
            <div key={expense.id} className="approval-item">
              <div className="approval-details">
                <h3>{expense.subject}</h3>
                <p>{expense.employee} • {expense.team}</p>
                <p>Amount: {formatCurrency(expense.amount)}</p>
              </div>
              <div className="approval-actions">
                <button className="btn btn-approve" onClick={() => approveExpense(expense.id)}>Approve</button>
                <button className="btn btn-reject" onClick={() => rejectExpense(expense.id)}>Reject</button>
              </div>
            </div>
          ))
        ) : (
          <p>No pending approvals</p>
        )}

        <hr />

        <h2>Processed Approvals</h2>
        <div className="approvals-controls">
          <select value={processedView} onChange={(e) => setProcessedView(e.target.value)}>
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select value={processedSortBy} onChange={(e) => setProcessedSortBy(e.target.value)}>
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>
        </div>

        {sortedProcessed.length > 0 ? (
          sortedProcessed.map(expense => (
            <div key={expense.id} className={`approval-item processed ${expense.status}`}>
              <div className="approval-details">
                <h3>{expense.subject}</h3>
                <p>{expense.employee} • {expense.team}</p>
                <p>Amount: {formatCurrency(expense.amount)}</p>
                <p>Status: <strong className={`status-badge ${expense.status}`}>{expense.status}</strong></p>
              </div>
              <div className="approval-actions processed-actions">
                <button className="btn btn-undo" onClick={() => undoApproval(expense)}>Undo</button>
              </div>
            </div>
          ))
        ) : (
          <p>No processed approvals</p>
        )}
      </div>
    </div>
  );
};

export default ApprovalsPage;