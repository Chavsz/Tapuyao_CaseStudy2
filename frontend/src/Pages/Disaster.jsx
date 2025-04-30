import React, { useState, useEffect } from 'react';
import './Pages.css';

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

  // Handle disaster form submission with backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/disasters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newDisaster,
          households: Math.floor(Math.random() * 100),
          residents: Math.floor(Math.random() * 500)
        }),
      });

      if (response.ok) {
        fetchDisasters(); // Refresh the list
        setNewDisaster({ // Reset form
          type: '',
          date: '',
          location: '',
          severity: ''
        });
      }
    } catch (error) {
      console.error('Error adding disaster:', error);
    }
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
            <h2>Log New Disaster</h2>
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
                    type="text"
                    name="date"
                    placeholder="dd/mm/yy"
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
              <button type="submit" className="submit-btn">Add Disaster</button>
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
                        <button className="edit-btn">Edit</button>
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
          <h2>Affected Residents Information</h2>
          <p>This section would contain information about affected residents and relief efforts.</p>
          {/* We could add forms and tables for resident information here */}
        </div>
      )}
    </div>
  );
};

export default DisasterManagement;