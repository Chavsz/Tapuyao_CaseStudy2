import React, { useState, useEffect } from 'react';
import './Pages.css';
import Modal from '../Components/Modal_HouseholdInfo';
import * as ioIcons from "react-icons/io5";
import * as mdIcons from "react-icons/md";

const DisasterManagement = () => {
  const [activeTab, setActiveTab] = useState('disasters');
  const [disasters, setDisasters] = useState([]);
  
  // State for new disaster form
  const [newDisaster, setNewDisaster] = useState({
    type: '',
    date: '',
    location: '',
    severity: ''
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // 1. Add state for editing disaster
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editDisaster, setEditDisaster] = useState(null);

  // 2. Add state for affected residents
  const [affectedHouseholds, setAffectedHouseholds] = useState([]);
  const [affectedModalOpen, setAffectedModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedAffected, setSelectedAffected] = useState(null);
  const [newAffected, setNewAffected] = useState({
    id: '',
    householdName: '',
    contacts: '',
    address: '',
    impact: '',
    disaster: '',
    residents: [{ name: '' }],
  });
  const [affectedSearch, setAffectedSearch] = useState('');

  // Fetch disasters on component mount
  useEffect(() => {
    fetchDisasters();
  }, []);

  // Fetch all disasters from backend
  const fetchDisasters = async () => {
    try {
      const response = await fetch('http://localhost:5001/disasters');
      const data = await response.json();
      setDisasters(data);
    } catch (error) {
      console.error('Error fetching disasters:', error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDisaster({
      ...newDisaster,
      [name]: value
    });
  };

  // Update handleSubmit for disaster creation and editing
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const response = await fetch(`http://localhost:5001/disasters/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newDisaster),
        });
        if (response.ok) {
          fetchDisasters();
          setNewDisaster({ type: '', date: '', location: '', severity: '' });
          setIsEditing(false);
          setEditingId(null);
        }
      } else {
        const response = await fetch('http://localhost:5001/disasters', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...newDisaster,
            households: 0,
            residents: 0
          }),
        });
        if (response.ok) {
          fetchDisasters();
          setNewDisaster({ type: '', date: '', location: '', severity: '' });
        }
      }
    } catch (error) {
      console.error('Error handling disaster:', error);
    }
  };

  // Handle edit button click
  const handleEdit = (disaster) => {
    setNewDisaster({
      type: disaster.type,
      date: disaster.date,
      location: disaster.location,
      severity: disaster.severity
    });
    setIsEditing(true);
    setEditingId(disaster.id);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setNewDisaster({ type: '', date: '', location: '', severity: '' });
    setIsEditing(false);
    setEditingId(null);
  };

  // Handle disaster deletion with backend
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/disasters/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchDisasters(); // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting disaster:', error);
    }
  };

  // Filter disasters based on search term
  const filteredDisasters = disasters.filter(disaster => {
    return (
      disaster.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disaster.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disaster.id.includes(searchTerm)
    );
  });

  // Edit modal handlers
  const openEditModal = (disaster) => {
    setEditDisaster(disaster);
    setEditModalOpen(true);
  };
  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditDisaster(null);
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditDisaster({ ...editDisaster, [name]: value });
  };
  const handleEditSave = async () => {
    try {
      await fetch(`http://localhost:5001/disasters/${editDisaster.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editDisaster),
      });
      fetchDisasters();
      closeEditModal();
    } catch (error) {
      console.error('Error updating disaster:', error);
    }
  };

  // Fetch affected households
  const fetchAffectedHouseholds = async () => {
    try {
      const res = await fetch('http://localhost:5001/affected-households');
      const data = await res.json();
      setAffectedHouseholds(data);
    } catch (err) {
      console.error('Error fetching affected households:', err);
    }
  };
  useEffect(() => { fetchAffectedHouseholds(); }, []);

  // Add affected household
  const handleAddAffected = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5001/affected-households', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAffected),
      });
      setAffectedModalOpen(false);
      setNewAffected({
        id: '', householdName: '', contacts: '', address: '', impact: '', disaster: '', residents: [{ name: '' }],
      });
      fetchAffectedHouseholds();
    } catch (err) {
      alert('Error adding affected household');
    }
  };
  // Delete affected household
  const handleDeleteAffected = async (id) => {
    if (!window.confirm('Delete this affected household?')) return;
    try {
      await fetch(`http://localhost:5001/affected-households/${id}`, { method: 'DELETE' });
      fetchAffectedHouseholds();
    } catch (err) {
      alert('Error deleting affected household');
    }
  };
  // Delete all
  const handleDeleteAllAffected = async () => {
    if (!window.confirm('Delete ALL affected households?')) return;
    try {
      await fetch('http://localhost:5001/affected-households', { method: 'DELETE' });
      fetchAffectedHouseholds();
    } catch (err) {
      alert('Error deleting all affected households');
    }
  };
  // View details
  const openViewModal = (affected) => {
    setSelectedAffected(affected);
    setViewModalOpen(true);
  };
  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedAffected(null);
  };
  // Modal resident handlers
  const handleAddResidentField = () => {
    setNewAffected({ ...newAffected, residents: [...newAffected.residents, { name: '' }] });
  };
  const handleRemoveResidentField = (idx) => {
    const updated = [...newAffected.residents];
    updated.splice(idx, 1);
    setNewAffected({ ...newAffected, residents: updated });
  };
  const handleResidentNameChange = (idx, value) => {
    const updated = [...newAffected.residents];
    updated[idx].name = value;
    setNewAffected({ ...newAffected, residents: updated });
  };
  // Modal input handler
  const handleAffectedInput = (e) => {
    const { name, value } = e.target;
    setNewAffected({ ...newAffected, [name]: value });
  };
  // Filtered affected households
  const filteredAffected = affectedHouseholds.filter(hh =>
    hh.householdName.toLowerCase().includes(affectedSearch.toLowerCase()) ||
    hh.disaster.toLowerCase().includes(affectedSearch.toLowerCase())
  );

  return (
    <div className="disaster-management">
      <h1>Disaster Management</h1>
      
      {/* Tabs */}
      <div className="tabs">
        <button 
          className={activeTab === 'disasters' ? 'active' : ''} 
          onClick={() => handleTabChange('disasters')}
        >
          Disaster Logs
        </button>
        <button 
          className={activeTab === 'residents' ? 'active' : ''} 
          onClick={() => handleTabChange('residents')}
        >
          Affected Residents
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'disasters' && (
        <div className="tab-content">
          {/* New Disaster Form */}
          <div className="disaster-form">
            <h2>{isEditing ? 'Edit Disaster' : 'Log New Disaster'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="type"
                    placeholder="Disaster Type (e.g., Fire, Disaster)"
                    value={newDisaster.type}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="date"
                    name="date"
                    value={newDisaster.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={newDisaster.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <select
                    name="severity"
                    value={newDisaster.severity}
                    onChange={handleInputChange}
                    className='select-severity'
                    required
                  >
                    <option value="">Severity</option>
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                    <option value="Severe">Severe</option>
                    <option value="Extreme">Extreme</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                {isEditing && (
                  <button type="button" className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                )}
                <button type="submit" className="submit-btn">
                  {isEditing ? 'Update Disaster' : 'Add Disaster'}
                </button>
              </div>
            </form>
          </div>

          {/* Search and Disaster List */}
          <div className="disaster-list">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="disaster-table">
              <table className='disaster-table-inner'>
                <thead>
                  <tr>
                    <th className="action-column">Action</th>
                    <th>Disaster ID</th>
                    <th>Disaster</th>
                    <th>Severity</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Households</th>
                    <th>Residents</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDisasters.map((disaster) => (
                    <tr key={disaster.id}>
                      <td className="action-column">
                        <button className="edit-btn" onClick={() => handleEdit(disaster)}>Edit</button>
                        <button 
                          className="delete-btn" 
                          onClick={() => handleDelete(disaster.id)}
                        >
                          Delete
                        </button>
                      </td>
                      <td>{disaster.id}</td>
                      <td>{disaster.type}</td>
                      <td>{disaster.severity}</td>
                      <td>{disaster.location}</td>
                      <td>{disaster.date}</td>
                      <td>{disaster.households}</td>
                      <td>{disaster.residents}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Affected Residents Tab Content */}
      {activeTab === 'residents' && (
        <div className="tab-content">
          <div className="affected-residents-header">
            <div className="stats-container">
              <div className="stat-badge households">
                <span>Total Households: {affectedHouseholds.length}</span>
              </div>
              <div className="stat-badge residents">
                <span>Total Residents: {affectedHouseholds.reduce((sum, h) => sum + (h.residents?.length || 0), 0)}</span>
              </div>
            </div>
            <div className="actions-container">
              <button className="btn-add" onClick={() => setAffectedModalOpen(true)}>
                <span>+</span> Add Household
              </button>
              <button 
                className="hh-btn-del-all" 
                onClick={handleDeleteAllAffected} 
              >
                Delete All
              </button>
            </div>
          </div>

          <div className="affected-search-container">
            <span className="search-icon"></span>
            <input 
              className="search" 
              type="search" 
              placeholder="Search by household name or disaster type..." 
              value={affectedSearch} 
              onChange={e => setAffectedSearch(e.target.value)} 
            />
          </div>

          <div className="affected-table-container">
            {filteredAffected.length > 0 ? (
              <table className="affected-table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Household Name</th>
                    <th>Residents</th>
                    <th>Disaster</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAffected.map(hh => (
                    <tr key={hh.id}>
                      <td>
                        <div className="affected-actions">
                          <button 
                            className="btn-action view" 
                            title="View Details" 
                            onClick={() => openViewModal(hh)}
                          >
                            <ioIcons.IoEyeSharp />
                          </button>
                          <button 
                            className="btn-action delete" 
                            title="Delete" 
                            onClick={() => handleDeleteAffected(hh.id)}
                          >
                            <mdIcons.MdDeleteOutline />
                          </button>
                        </div>
                      </td>
                      <td className="household-name">{hh.householdName}</td>
                      <td>
                        <div className="residents-count">
                          <span>{hh.residents?.length || 0}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`disaster-tag ${hh.disaster.toLowerCase()}`}>
                          {hh.disaster}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data-container">
                <div className="no-data-icon">📋</div>
                <div className="no-data-text">No affected households found</div>
              </div>
            )}
          </div>

          {/* Add Household Modal */}
          <Modal isOpen={affectedModalOpen} onClose={() => setAffectedModalOpen(false)}>
            <div className="household-add-modal" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
              <h3>Add Affected Residents</h3>
              <form onSubmit={handleAddAffected}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Household ID</label>
                    <input type="text" name="id" value={newAffected.id} onChange={handleAffectedInput} required />
                  </div>
                  <div className="form-group">
                    <label>Household Name</label>
                    <input type="text" name="householdName" value={newAffected.householdName} onChange={handleAffectedInput} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Contacts</label>
                    <input type="text" name="contacts" value={newAffected.contacts} onChange={handleAffectedInput} required />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input type="text" name="address" value={newAffected.address} onChange={handleAffectedInput} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Impact</label>
                    <select name="impact" value={newAffected.impact} onChange={handleAffectedInput} required>
                      <option value="">Select Impact</option>
                      <option value="Injured">Injured</option>
                      <option value="House Damaged">House Damaged</option>
                      <option value="Lost Livelihood">Lost Livelihood</option>
                      <option value="Missing">Missing</option>
                      <option value="Deceased">Deceased</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Disaster</label>
                    <select name="disaster" value={newAffected.disaster} onChange={handleAffectedInput} required>
                      <option value="">Select Disaster</option>
                      {disasters.map(d => <option key={d.id} value={d.type}>{d.type}</option>)}
                    </select>
                  </div>
                </div>
                <div className="residents-section">
                  <div className="residents-header">
                    <h4>Residents</h4>
                    <button type="button" className="btn-add-resident" onClick={handleAddResidentField}>+ Add Resident</button>
                  </div>
                  <div className="attr-hsh-outer">
                    {newAffected.residents.map((resident, idx) => (
                      <div key={idx} className="resident-card">
                        <div className="resident-header">
                          <span>Resident #{idx + 1}</span>
                          <button type="button" className="btn-remove-resident" onClick={() => handleRemoveResidentField(idx)}>&times;</button>
                        </div>
                        <div className="attr-hsh">
                          <div className="input-field-hsh">
                            <label>Name</label>
                            <input type="text" value={resident.name} onChange={e => handleResidentNameChange(idx, e.target.value)} required />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={() => setAffectedModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-save">Save</button>
                </div>
              </form>
            </div>
          </Modal>
          {/* View Details Modal */}
          <Modal isOpen={viewModalOpen} onClose={closeViewModal}>
            {selectedAffected && (
              <div className="household-info-modal">
                <h3>Affected Household Details</h3>
                <div className="household-detail-section">
                  <p className="section-label">Household Name</p>
                  <div className="household-name-container">{selectedAffected.householdName}</div>
                </div>
                <div className="household-detail-section">
                  <p className="section-label">Contacts</p>
                  <div className="household-name-container">{selectedAffected.contacts}</div>
                </div>
                <div className="household-detail-section">
                  <p className="section-label">Address</p>
                  <div className="household-name-container">{selectedAffected.address}</div>
                </div>
                <div className="household-detail-section">
                  <p className="section-label">Impact</p>
                  <div className="household-name-container">{selectedAffected.impact}</div>
                </div>
                <div className="household-detail-section">
                  <p className="section-label">Disaster</p>
                  <div className="household-name-container">{selectedAffected.disaster}</div>
                </div>
                <div className="household-detail-section">
                  <p className="section-label">Residents ({selectedAffected.residents.length})</p>
                  <div className="household-info-table-container">
                    <table className="households-info-table">
                      <thead>
                        <tr><th>Name</th></tr>
                      </thead>
                      <tbody>
                        {selectedAffected.residents.map((r, i) => (
                          <tr key={i}><td>{r.name}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </Modal>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="modal-overlay-household-info">
          <div className="modal-content-household-info" style={{ maxWidth: 500, padding: 32 }}>
            <span className="close" onClick={closeEditModal}>&times;</span>
            <h3 style={{ color: '#1171df', marginBottom: 20, fontWeight: 600, fontSize: 22, textAlign: 'center' }}>Edit Disaster Log</h3>
            <form onSubmit={e => { e.preventDefault(); handleEditSave(); }}>
              <div className="form-row" style={{ marginBottom: 18 }}>
                <div className="form-group">
                  <label style={{ fontWeight: 500, color: '#555', marginBottom: 6, display: 'block' }}>Disaster</label>
                  <input type="text" name="type" value={editDisaster.type} onChange={handleEditChange} placeholder="Disaster Type" className="input" style={{ marginBottom: 0 }} />
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: 500, color: '#555', marginBottom: 6, display: 'block' }}>Date</label>
                  <input type="text" name="date" value={editDisaster.date} onChange={handleEditChange} placeholder="Date" className="input" style={{ marginBottom: 0 }} />
                </div>
              </div>
              <div className="form-row" style={{ marginBottom: 18 }}>
                <div className="form-group">
                  <label style={{ fontWeight: 500, color: '#555', marginBottom: 6, display: 'block' }}>Location</label>
                  <input type="text" name="location" value={editDisaster.location} onChange={handleEditChange} placeholder="Location" className="input" style={{ marginBottom: 0 }} />
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: 500, color: '#555', marginBottom: 6, display: 'block' }}>Severity</label>
                  <select name="severity" value={editDisaster.severity} onChange={handleEditChange} className='select-severity' style={{ marginBottom: 0 }}>
                    <option value="">Severity</option>
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                    <option value="Severe">Severe</option>
                    <option value="Extreme">Extreme</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer" style={{ justifyContent: 'center', marginTop: 30 }}>
                <button type="button" className="btn-cancel" onClick={closeEditModal} style={{ minWidth: 100 }}>Cancel</button>
                <button type="submit" className="btn-save" style={{ minWidth: 100 }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisasterManagement;