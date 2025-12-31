/*
  TripForm
  - Form for creating or editing a trip
  - Validates required fields and uses context helpers `addTrip` / `updateTrip`.
*/
import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

const TripForm = ({ onClose, tripToEdit }) => {
  // Context helpers and local form state
  const { teams, addTrip, updateTrip } = useContext(AppContext);
  const [formData, setFormData] = useState(tripToEdit || {
    destination: '',
    purpose: '',
    traveler: '',
    team: '',
    startDate: '',
    endDate: '',
    status: 'planned',
    transportMode: '',
    accommodation: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState({});
  
  // Validate trip fields (basic checks)
  const validateForm = () => {
    const newErrors = {};
    if (!formData.destination) newErrors.destination = 'Destination is required';
    if (!formData.purpose) newErrors.purpose = 'Purpose is required';
    if (!formData.traveler) newErrors.traveler = 'Traveler name is required';
    if (!formData.team) newErrors.team = 'Team is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    else if (new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date cannot be before start date';
    }
    
    // set validation state
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (tripToEdit) {
      updateTrip({ ...formData, id: tripToEdit.id });
    } else {
      addTrip(formData);
    }

    onClose();
  };

  /*
    Render: Trip Form (modal)
    - Inputs arranged in rows; validation errors displayed inline.
  */
  return (
    <div className="modal-backdrop">
      <div className="modal-content trip-form">
        <div className="modal-header">
          <h2>{tripToEdit ? 'Edit Trip' : 'New Trip'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            {/* Destination */}
            <div className="form-group">
              <label>Destination</label>
              <input 
                type="text" 
                name="destination" 
                value={formData.destination} 
                onChange={handleChange}
                className={errors.destination ? 'error' : ''}
              />
              {errors.destination && <div className="error-message">{errors.destination}</div>}
            </div>
            
            {/* Purpose */}
            <div className="form-group">
              <label>Purpose</label>
              <input 
                type="text" 
                name="purpose" 
                value={formData.purpose} 
                onChange={handleChange}
                className={errors.purpose ? 'error' : ''}
              />
              {errors.purpose && <div className="error-message">{errors.purpose}</div>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Traveler</label>
              <input 
                type="text" 
                name="traveler" 
                value={formData.traveler} 
                onChange={handleChange}
                className={errors.traveler ? 'error' : ''}
              />
              {errors.traveler && <div className="error-message">{errors.traveler}</div>}
            </div>
            
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
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input 
                type="date" 
                name="startDate" 
                value={formData.startDate} 
                onChange={handleChange}
                className={errors.startDate ? 'error' : ''}
              />
              {errors.startDate && <div className="error-message">{errors.startDate}</div>}
            </div>
            
            <div className="form-group">
              <label>End Date</label>
              <input 
                type="date" 
                name="endDate" 
                value={formData.endDate} 
                onChange={handleChange}
                className={errors.endDate ? 'error' : ''}
              />
              {errors.endDate && <div className="error-message">{errors.endDate}</div>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange}
              >
                <option value="planned">Planned</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Transportation</label>
              <select 
                name="transportMode" 
                value={formData.transportMode || ''} 
                onChange={handleChange}
              >
                <option value="">Select Transport</option>
                <option value="flight">Flight</option>
                <option value="train">Train</option>
                <option value="car">Car</option>
                <option value="bus">Bus</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Accommodation</label>
            <input 
              type="text" 
              name="accommodation" 
              value={formData.accommodation || ''} 
              onChange={handleChange}
              placeholder="Hotel name, address, etc."
            />
          </div>
          
          <div className="form-group">
            <label>Notes</label>
            <textarea 
              name="notes" 
              value={formData.notes || ''} 
              onChange={handleChange}
              rows="3"
              placeholder="Additional information about the trip..."
            ></textarea>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {tripToEdit ? 'Update Trip' : 'Add Trip'}
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

export default TripForm;