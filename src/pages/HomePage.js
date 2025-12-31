/*
  HomePage
  - Dashboard-style landing page showing quick counts and small summaries.
*/
import { useContext } from 'react';
import QuickAccess from '../components/QuickAccess';
import { AppContext } from '../context/AppContext';
import { formatCurrency } from '../utils/localStorage';
import './HomePage.css';

const HomePage = () => {
  const { 
    pendingApprovals, 
    trips, 
    unreportedExpenses, 
    unreportedAdvances,
    expenses
  } = useContext(AppContext);

  // Get recent expenses
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="home-page">
      <div className="page-content">
        <div className="dashboard-row">
          <div className="card pending-tasks">
            <h2>Pending Tasks</h2>
            
            <div className="task-item">
              <div className="task-icon pending-icon"></div>
              <div className="task-label">Pending Approvals</div>
              <div className="task-count">{pendingApprovals.length}</div>
            </div>
            
            <div className="task-item">
              <div className="task-icon trip-icon"></div>
              <div className="task-label">New Trips Registered</div>
              <div className="task-count">{trips.filter(trip => !trip.processed).length}</div>
            </div>
            
            <div className="task-item">
              <div className="task-icon unreported-icon"></div>
              <div className="task-label">Unreported Expenses</div>
              <div className="task-count">{unreportedExpenses.length}</div>
            </div>
            
            <div className="task-item">
              <div className="task-icon upcoming-icon"></div>
              <div className="task-label">Upcoming Expenses</div>
              <div className="task-count">0</div>
            </div>
            
            <div className="task-item">
              <div className="task-icon advance-icon"></div>
              <div className="task-label">Unreported Advances</div>
              <div className="task-amount">{formatCurrency(unreportedAdvances.reduce((sum, adv) => sum + adv.amount, 0))}</div>
            </div>
          </div>
          
          <div className="card recent-expenses">
            <h2>Recent Expenses</h2>
            <table className="expense-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Employee</th>
                  <th>Team</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentExpenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.subject}</td>
                    <td>{expense.employee}</td>
                    <td>
                      <span className={`team-badge ${expense.team.toLowerCase()}`}>
                        {expense.team}
                      </span>
                    </td>
                    <td>{formatCurrency(expense.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <QuickAccess />
        
        <div className="card monthly-report">
          <h2>Monthly Report</h2>
          <div className="chart-container">
            <div className="chart team-spending">
              <h3>Team Spending Trend</h3>
              <div className="chart-placeholder">
                {/* Chart will be implemented with Chart.js */}
                <div>Team spending chart will appear here</div>
              </div>
            </div>
            
            <div className="chart day-to-day">
              <h3>Day-to-Day Expenses</h3>
              <div className="chart-placeholder">
                {/* Chart will be implemented with Chart.js */}
                <div>Daily expenses chart will appear here</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;