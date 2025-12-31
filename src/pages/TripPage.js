import { useCallback, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TripForm from '../components/TripForm';
import TripList from '../components/TripList';
import { AppContext } from '../context/AppContext';

/*
  TripPage
  - Lists trips and allows filtering by status, date range and search.
  - Integrates `TripForm` for creating new trips and `TripList` for listing results.
*/
const TripPage = () => {
  const { trips } = useContext(AppContext);
  const [showNewTripForm, setShowNewTripForm] = useState(false);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
    search: '',
  });
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const applyFilters = useCallback(() => {
    let result = [...trips];
    
    // Apply status filter
    if (filters.status) {
      result = result.filter(trip => trip.status === filters.status);
    }
    
    // Apply date range filter
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter(trip => {
        const tripStart = new Date(trip.startDate);
        return tripStart >= fromDate;
      });
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of the day
      result = result.filter(trip => {
        const tripEnd = new Date(trip.endDate);
        return tripEnd <= toDate;
      });
    }
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(trip => 
        trip.destination.toLowerCase().includes(searchLower) ||
        trip.purpose.toLowerCase().includes(searchLower) ||
        trip.traveler.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by start date (newest first)
    result.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    // Update filtered trips
    setFilteredTrips(result);
  }, [trips, filters.status, filters.dateFrom, filters.dateTo, filters.search]);
  
  useEffect(() => {
    // Check URL parameters
    const params = new URLSearchParams(location.search);
    if (params.get('new') === 'true') {
      setShowNewTripForm(true);
    }
    
    // Clear URL parameters after checking
    if (params.has('new')) {
      navigate('/trips', { replace: true });
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
      status: '',
      dateFrom: '',
      dateTo: '',
      search: '',
    });
    
    setFilteredTrips([...trips].sort((a, b) => new Date(b.startDate) - new Date(a.startDate)));
  };
  
  const handleNewTrip = () => {
    setShowNewTripForm(true);
  };
  
  const closeModal = () => {
    setShowNewTripForm(false);
  };

  return (
    <div className="trip-page">
      <div className="page-header">
        <h1>Trips</h1>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleNewTrip}>+ New Trip</button>
        </div>
      </div>
      
      <div className="filter-section">
        <form onSubmit={handleFilterSubmit}>
          <div className="filter-row">
            <div className="filter-group">
              <label>Status</label>
              <select 
                name="status" 
                value={filters.status} 
                onChange={handleFilterChange}
              >
                <option value="">All Statuses</option>
                <option value="planned">Planned</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
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
                placeholder="Search trips..." 
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
      
      <div className="trip-summary">
        <div className="summary-item">
          <span className="summary-label">Total Trips</span>
          <span className="summary-value">{filteredTrips.length}</span>
        </div>
        
        <div className="summary-item">
          <span className="summary-label">Upcoming Trips</span>
          <span className="summary-value">
            {filteredTrips.filter(trip => 
              new Date(trip.startDate) > new Date() && trip.status !== 'cancelled'
            ).length}
          </span>
        </div>
        
        <div className="summary-item">
          <span className="summary-label">Completed Trips</span>
          <span className="summary-value">
            {filteredTrips.filter(trip => trip.status === 'completed').length}
          </span>
        </div>
      </div>
      
      <TripList trips={filteredTrips} />
      
      {showNewTripForm && (
        <TripForm onClose={closeModal} />
      )}
    </div>
  );
};

export default TripPage;