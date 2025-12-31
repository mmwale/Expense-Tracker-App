/*
  TripItem
  - Displays a trip card and optional expanded details (transport, accommodation, notes).
  - Uses `deleteTrip` from context to allow deletion.
*/
import { useAppContext } from '../context/AppContext';

const TripItem = ({ trip, isExpanded, onToggleExpand }) => {
  const { deleteTrip } = useAppContext();
  const { 
    id, 
    destination, 
    purpose, 
    traveler, 
    team, 
    startDate, 
    endDate, 
    status, 
    transportMode, 
    accommodation, 
    notes,
    budget 
  } = trip;
  
  // Helper: format a date string for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  // Helper: map status to CSS class for visuals
  const getStatusClass = (status) => {
    switch(status) {
      case 'planned': return 'status-planned';
      case 'ongoing': return 'status-ongoing';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  return (
    <div className="trip-item">
      <div className="trip-info">
        <div className="trip-header" onClick={() => onToggleExpand && onToggleExpand(id)}>
          <h3>{destination}</h3>
          {status && <span className={`trip-status ${getStatusClass(status)}`}>{status}</span>}
        </div>
        
        <div className="trip-dates">
          <p>From: {formatDate(startDate)}</p>
          <p>To: {formatDate(endDate)}</p>
        </div>
        
        <div className="trip-meta">
          <p className="trip-purpose">{purpose}</p>
          {traveler && <p className="trip-traveler">Traveler: {traveler}</p>}
          {team && <p className="trip-team">Team: {team}</p>}
          {budget && <p className="trip-budget">Budget: ${parseFloat(budget).toFixed(2)}</p>}
        </div>

        {isExpanded && (
          <div className="trip-details">
            {transportMode && (
              <div className="trip-detail-item">
                <span className="detail-label">Transport:</span>
                <span className="detail-value">{transportMode}</span>
              </div>
            )}
            
            {accommodation && (
              <div className="trip-detail-item">
                <span className="detail-label">Accommodation:</span>
                <span className="detail-value">{accommodation}</span>
              </div>
            )}
            
            {notes && (
              <div className="trip-notes">
                <span className="detail-label">Notes:</span>
                <p>{notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="trip-actions">
        {onToggleExpand && (
          <button className="btn-expand" onClick={() => onToggleExpand(id)}>
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        )}
        <button className="btn-delete" onClick={() => deleteTrip(id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default TripItem;