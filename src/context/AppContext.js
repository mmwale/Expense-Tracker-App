/*
  App Context
  - Provides application-wide state and action helpers for expenses, trips, teams, categories and simple utilities.
  - Keep the provider lightweight and expose imperative functions (add/update/delete) used by components.
*/
import { createContext, useContext, useEffect, useState } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/localStorage';

// Create the context and a typed hook wrapper for convenience
export const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

// Initial values for global state (kept minimal here)
const initialState = {
  teams: ['Engineering', 'Marketing', 'Sales', 'HR'], // Add predefined team categories
  // ...other state properties...
};

export const AppProvider = ({ children }) => {
  // Core application state (local in-memory + persisted to localStorage)
  const [expenses, setExpenses] = useState([]); // list of expense objects
  const [pendingApprovals] = useState([]); // legacy placeholder (kept for compatibility with UI)
  const [unreportedAdvances] = useState([]); // placeholder for future feature
  const [trips, setTrips] = useState([]); // list of trips

  // Teams and categories are fixed sets used for dropdowns in the UI
  const [teams, setTeams] = useState(initialState.teams);
  const [categories, setCategories] = useState([
    'Accommodation',
    'Comms',
    'Services',
    'Food',
    'Fuel',
    'Office Supplies',
    'Travel Expenses',
    'Client Dinner',
    'Hotel',
  ]);

  // Generic container for other app-level configuration (kept for backward compatibility)
  const [state, setState] = useState(initialState);

  /*
    Persisted storage handling
    - Load persisted `expenses` and `trips` on mount.
    - Save changes back to localStorage when lists change.
  */
  useEffect(() => {
    const storedExpenses = getFromLocalStorage('expenses', []);
    const storedTrips = getFromLocalStorage('trips', []);
    setExpenses(storedExpenses);
    setTrips(storedTrips);
  }, []);

  // Persist expenses whenever they change
  useEffect(() => {
    saveToLocalStorage('expenses', expenses);
  }, [expenses]);

  // Persist trips whenever they change
  useEffect(() => {
    saveToLocalStorage('trips', trips);
  }, [trips]);

  /*
    Expense CRUD helpers
    - addExpense: creates a new expense object, sets defaults (id, date, status)
    - deleteExpense: removes an expense by id
    - updateExpense: replaces matching expense with updated object
    - approveExpense / rejectExpense: convenience helpers that set status
  */
  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
      date: expense.date || new Date().toISOString().split('T')[0],
      status: expense.status || 'pending',
      amount: expense.amount || '0'
    };
    setExpenses([...expenses, newExpense]);
    return newExpense;
  };

  // Delete an expense by id
  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  // Update an expense object (replace by id)
  const updateExpense = (updatedExpense) => {
    setExpenses(expenses.map(expense => 
      expense.id === updatedExpense.id ? updatedExpense : expense
    ));
  };

  // Approve or reject an expense (status update)
  const approveExpense = (id) => {
    setExpenses(expenses.map(exp => 
      exp.id === id ? {...exp, status: 'approved'} : exp
    ));
  };
  
  const rejectExpense = (id) => {
    setExpenses(expenses.map(exp => 
      exp.id === id ? {...exp, status: 'rejected'} : exp
    ));
  };

  // And calculate unreportedExpenses
const unreportedExpenses = expenses.filter(exp => !exp.reported);

  // Add a new trip
  const addTrip = (trip) => {
    const newTrip = {
      ...trip,
      id: Date.now().toString(),
      startDate: trip.startDate || new Date().toISOString().split('T')[0]
    };
    setTrips([...trips, newTrip]);
    return newTrip;
  };

  // Delete a trip
  const deleteTrip = (id) => {
    setTrips(trips.filter(trip => trip.id !== id));
  };

  // Update a trip
  const updateTrip = (updatedTrip) => {
    setTrips(trips.map(trip => 
      trip.id === updatedTrip.id ? updatedTrip : trip
    ));
  };

  // Get expenses for a specific trip
  const getExpensesByTrip = (tripId) => {
    return expenses.filter(expense => expense.tripId === tripId);
  };

  // Get total expenses
  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
  };

  // Get expenses by team
  const getExpensesByTeam = (team) => {
    return expenses.filter(expense => expense.team === team);
  };

  // Get expenses by category
  const getExpensesByCategory = (category) => {
    return expenses.filter(expense => expense.category === category);
  };

  // Get expenses by date range
  const getExpensesByDateRange = (startDate, endDate) => {
    let filtered = [...expenses];
    
    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter(expense => new Date(expense.date) >= start);
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(expense => new Date(expense.date) <= end);
    }
    
    return filtered;
  };

  // Add a new team to the list used by dropdowns
  const addTeam = (team) => {
    setTeams(prev => [...prev, team]);
    // keep state.teams in sync for backward compatibility
    setState((prevState) => ({
      ...prevState,
      teams: [...prevState.teams, team],
    }));
  };

  // Add a new category to the categories list
  const addCategoryFn = (category) => {
    setCategories(prev => [...prev, category]);
  };

  // Toasts: small in-app notification system used instead of alert()
  const [toasts, setToasts] = useState([]);
  const addToast = ({ type = 'info', message = '', duration = 4000 }) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const toast = { id, type, message };
    setToasts((prev) => [...prev, toast]);

    // Auto remove after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter(t => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter(t => t.id !== id));
  };

  // Get upcoming trips
  const getUpcomingTrips = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return trips.filter(trip => new Date(trip.startDate) >= today)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  };

  // Small UI component rendered inside the provider so children can call `addToast`.
  const ToastContainer = () => (
    <div className="toast-container" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <div className="toast-message">{t.message}</div>
          <button className="toast-close" onClick={() => removeToast(t.id)}>×</button>
        </div>
      ))}
    </div>
  );

  return (
    <AppContext.Provider value={{
      expenses,
      trips,
      state,
      pendingApprovals,
      unreportedExpenses,
      unreportedAdvances,
      teams,
      categories,
      addExpense,
      addTeam,
      deleteExpense,
      updateExpense,
      approveExpense,
      rejectExpense,
      addTrip,
      deleteTrip,
      updateTrip,
      addCategory: addCategoryFn,
      addToast,
      getExpensesByTrip,
      getTotalExpenses,
      getExpensesByTeam,
      getExpensesByCategory,
      getExpensesByDateRange,
      getUpcomingTrips,
    }}>
      {children}
      <ToastContainer />
    </AppContext.Provider>
  );
};