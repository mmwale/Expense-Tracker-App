import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import TripForm from './TripForm';
import TripItem from './TripItem';

/*
  TripList
  - Shows all trips as cards/list, supports edit/delete and expanding to view details via TripItem.
*/
const TripList = ({ trips }) => {
  const { deleteTrip } = useContext(AppContext);
  const [editingTrip, setEditingTrip] = useState(null); // currently editing trip
  const [expandedTripId, setExpandedTripId] = useState(null); // which trip is expanded
  
  const handleEdit = (trip) => {
    setEditingTrip(trip);
  };
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      deleteTrip(id);
    }
  };
  
  const closeEditForm = () => {
    setEditingTrip(null);
  };
  
  const toggleTripDetails = (id) => {
    if (expandedTripId === id) {
      setExpandedTripId(null);
    } else {
      setExpandedTripId(id);
    }
  };

  return (
    <div className="trip-list">
      {trips.length === 0 ? (
        <div className="no-trips">
          <p>No trips found. Create a new trip to get started.</p>
        </div>
      ) : (
        <div className="trip-cards">
          {trips.map(trip => (
            <TripItem 
              key={trip.id}
              trip={trip}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isExpanded={expandedTripId === trip.id}
              onToggleExpand={toggleTripDetails}
            />
          ))}
        </div>
      )}
      
      {editingTrip && (
        <TripForm 
          tripToEdit={editingTrip} 
          onClose={closeEditForm} 
        />
      )}
    </div>
  );
};

export default TripList;