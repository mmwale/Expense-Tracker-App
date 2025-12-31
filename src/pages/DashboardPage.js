import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { useContext, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { formatCurrency } from '../utils/localStorage';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardPage = () => {
  const { expenses, teams, addToast } = useContext(AppContext);
  const [teamSpendingData, setTeamSpendingData] = useState(null);
  const [categorySpendingData, setCategorySpendingData] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if report creation was requested
    const params = new URLSearchParams(location.search);
    if (params.get('report') === 'true') {
      setShowReportModal(true);
    }
  }, [location]);

  useEffect(() => {
    // Prepare team spending data
    const teamSpending = {};
    teams.forEach(team => {
      teamSpending[team] = 0;
    });

    expenses.forEach(expense => {
      if (expense.team && teamSpending[expense.team] !== undefined) {
        teamSpending[expense.team] += parseFloat(expense.amount);
      }
    });

    setTeamSpendingData({
      labels: Object.keys(teamSpending),
      datasets: [
        {
          label: 'Team Spending',
          data: Object.values(teamSpending),
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 99, 132, 0.6)',
          ],
          borderWidth: 1,
        },
      ],
    });

    // Prepare category spending data
    const categories = {
      'Accommodation': 0,
      'Comms': 0,
      'Services': 0,
      'Food': 0,
      'Fuel': 0,
    };

    expenses.forEach(expense => {
      const category = expense.category || 'Other';
      if (categories[category] !== undefined) {
        categories[category] += parseFloat(expense.amount);
      }
    });

    setCategorySpendingData({
      labels: Object.keys(categories),
      datasets: [
        {
          label: 'Category Spending',
          data: Object.values(categories),
          backgroundColor: [
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(75, 192, 255, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
          ],
          borderWidth: 1,
        },
      ],
    });
  }, [expenses, teams]);

  const [reportStart, setReportStart] = useState('');
  const [reportEnd, setReportEnd] = useState('');
  const [reportTeam, setReportTeam] = useState('');

  const closeReportModal = () => {
    setShowReportModal(false);
  };

  // Generate a CSV report based on selected date range and team
  const handleGenerateReport = () => {
    // Filter expenses by selected criteria
    let result = [...expenses];

    if (reportStart) {
      const start = new Date(reportStart);
      result = result.filter(exp => new Date(exp.date) >= start);
    }

    if (reportEnd) {
      const end = new Date(reportEnd);
      end.setHours(23,59,59,999);
      result = result.filter(exp => new Date(exp.date) <= end);
    }

    if (reportTeam) {
      result = result.filter(exp => exp.team === reportTeam);
    }

    if (result.length === 0) {
      addToast({ type: 'info', message: 'No expenses found for the selected criteria.' });
      return;
    }

    // Build CSV
    const rows = [['Date','Subject','Employee','Team','Amount','Category','Description']];
    result.forEach(exp => {
      rows.push([
        new Date(exp.date).toLocaleDateString(),
        exp.subject,
        exp.employee,
        exp.team,
        exp.amount,
        exp.category || '',
        exp.description || ''
      ]);
    });

    const csvContent = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense_report_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    // Reset and close
    setReportStart('');
    setReportEnd('');
    setReportTeam('');
    setShowReportModal(false);
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Expenses</h3>
          <div className="stat-value">
            {formatCurrency(expenses.reduce((total, exp) => total + parseFloat(exp.amount), 0))}
          </div>
        </div>
        
        <div className="stat-card">
          <h3>Total Expense Count</h3>
          <div className="stat-value">{expenses.length}</div>
        </div>
        
        <div className="stat-card">
          <h3>Average Expense</h3>
          <div className="stat-value">
            {formatCurrency(
              expenses.length 
                ? expenses.reduce((total, exp) => total + parseFloat(exp.amount), 0) / expenses.length 
                : 0
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="chart-card">
          <h2>Team Spending Trend</h2>
          <div className="chart-container">
            {teamSpendingData && <Bar data={teamSpendingData} options={options} />}
          </div>
        </div>
        
        <div className="chart-card">
          <h2>Day-to-Day Expenses</h2>
          <div className="chart-container">
            {categorySpendingData && <Bar data={categorySpendingData} options={options} />}
          </div>
        </div>
      </div>

      {showReportModal && (
        <div className="modal-backdrop">
          <div className="modal-content report-modal">
            <h2>Create Expense Report</h2>
            <p>Generate a report for the selected time period:</p>
            
            <div className="report-form">
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" value={reportStart} onChange={(e) => setReportStart(e.target.value)} />
              </div>
              
              <div className="form-group">
                <label>End Date</label>
                <input type="date" value={reportEnd} onChange={(e) => setReportEnd(e.target.value)} />
              </div>
              
              <div className="form-group">
                <label>Team</label>
                <select value={reportTeam} onChange={(e) => setReportTeam(e.target.value)}>
                  <option value="">All Teams</option>
                  {teams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={handleGenerateReport}>Generate Report</button>
              <button className="btn btn-secondary" onClick={closeReportModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;