import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as ioIcons from "react-icons/io5";
import * as mdIcons from "react-icons/md";
import * as faIcons from "react-icons/fa";
import * as biIcons from "react-icons/bi";
import './Pages.css';
import '../App.css';
import Modal from '../Components/Modal_HouseholdInfo';

const API_URL = 'http://localhost:5001/households';

const Households = () => {
  const [households, setHouseholds] = useState([]);
  const [id, setId] = useState('');
  const [houseName, setHouseName] = useState('');
  const [residents, setResidents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchHouseholds = async () => {
    try {
      const response = await axios.get(API_URL);
      setHouseholds(response.data);
    } catch (error) {
      console.error('Error fetching households:', error);
      toast.error('Failed to fetch households');
    }
  };

  useEffect(() => {
    fetchHouseholds();
  }, []);

  // Add a household
  const addHousehold = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!id || !houseName) {
      toast.warning('Please fill all required fields');
      return;
    }
    
    if (residents.length === 0) {
      toast.warning('Please add at least one resident');
      return;
    }
    
    // Check if any resident has empty fields
    const hasEmptyFields = residents.some(resident => 
      !resident.name || !resident.gender || !resident.age);
    
    if (hasEmptyFields) {
      toast.warning('Please fill all resident information');
      return;
    }
    
    try {
      await axios.post(API_URL, {
        id,
        houseName,
        residents
      });
      toast.success('Household added successfully!');
      fetchHouseholds();
      setId('');
      setHouseName('');
      setResidents([]);
      setIsModalOpenAdd(false);
    } catch (error) {
      toast.error('Error adding household!');
    }
  };

  // Remove a resident from the form
  const removeResident = (index) => {
    const newResidents = [...residents];
    newResidents.splice(index, 1);
    setResidents(newResidents);
  };

  // Delete a household
  const deleteHousehold = async (id) => {
    if (window.confirm('Are you sure you want to delete this household?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        toast.success('Household deleted!');
        fetchHouseholds();
      } catch (error) {
        toast.error('Error deleting household!');
      }
    }
  };

  // Delete all households
  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete ALL households? This action cannot be undone.')) {
      try {
        await axios.delete(API_URL);
        toast.success('All households deleted successfully!');
        fetchHouseholds();
      } catch (error) {
        toast.error('Error deleting all households!');
        console.error('Error deleting all households', error);
      }
    }
  };

  // Handle search
  const handleHouseholdsSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  //filter households
  const filteredHouseholds = households.filter(household =>
    household.houseName.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  // households information modal 
  const householdInfoModal = () => {
    if (!selectedHousehold) return null;

    return (
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className='household-info-modal'>
          <h3>Household Information</h3>
          <div className='household-detail-section'>
            <p className='section-label'>Household Name</p>
            <div className='household-name-container'>{selectedHousehold.houseName}</div>
          </div>
          
          <div className='household-detail-section'>
            <p className='section-label'>Residents ({selectedHousehold.residents.length})</p>
            <div className='household-info-table-container'>
              <table className='households-info-table'>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Age</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedHousehold.residents.map((resident, index) => (
                    <tr key={index}>
                      <td>{resident.name}</td>  
                      <td>{resident.gender}</td>  
                      <td>{resident.age}</td>  
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div className='households-container'>
      {householdInfoModal()}
      <div className='households-header'>
        <h1>Household Information</h1>
        <div className='household-stats'>
          <div className='stat-card'>
            <span className='stat-value'>{households.length}</span>
            <span className='stat-label'>Total Households</span>
          </div>
          <div className='stat-card'>
            <span className='stat-value'>
              {households.reduce((total, household) => total + (household.residents ? household.residents.length : 0), 0)}
            </span>
            <span className='stat-label'>Total Residents</span>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpenAdd} onClose={() => setIsModalOpenAdd(false)}>
        <div className='household-add-modal'>
          <h3>Add New Household</h3>
          <form onSubmit={addHousehold}>
            <div className='form-row'>
              <div className='form-group'>
                <label htmlFor="householdId">Household ID</label>
                <input
                  id="householdId"
                  className='input-household-id'
                  type="text"
                  placeholder="Enter ID"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  required
                />
              </div>
              <div className='form-group'>
                <label htmlFor="householdName">Household Name</label>
                <input
                  id="householdName"
                  className='input-household-name'
                  type="text"
                  placeholder="Enter household name"
                  value={houseName}
                  onChange={(e) => setHouseName(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className='residents-section'>
              <div className='residents-header'>
                <h4>Residents</h4>
                <button 
                  type="button" 
                  className='btn-add-resident' 
                  onClick={() => setResidents([...residents, { name: '', gender: '', age: '' }])}
                >
                  <faIcons.FaUserPlus /> Add Resident
                </button>
              </div>
              
              {residents.length === 0 && (
                <div className='no-residents-message'>
                  No residents added. Add at least one resident.
                </div>
              )}
              
              <div className='attr-hsh-outer'>
                {residents.map((resident, index) => (
                  <div className='resident-card' key={index}>
                    <div className='resident-header'>
                      <span>Resident #{index + 1}</span>
                      <button 
                        type="button" 
                        className='btn-remove-resident' 
                        onClick={() => removeResident(index)}
                      >
                        <mdIcons.MdClose />
                      </button>
                    </div>
                    <div className='attr-hsh'>
                      <div className='input-field-hsh'>
                        <label>Name</label>
                        <input
                          type="text"
                          placeholder="Enter name"
                          value={resident.name}
                          onChange={(e) => {
                            const newResidents = [...residents];
                            newResidents[index].name = e.target.value;
                            setResidents(newResidents);
                          }}
                          required
                        />
                      </div>
                      <div className='input-field-hsh'>
                        <label>Gender</label>
                        <select 
                          className='gender-hsh' 
                          name='gender' 
                          value={resident.gender}  
                          onChange={(e) => {
                            const newResidents = [...residents];
                            newResidents[index].gender = e.target.value;
                            setResidents(newResidents);
                          }} 
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div className='input-field-hsh'>
                        <label>Age</label>
                        <input
                          type="number"
                          placeholder="Enter age"
                          value={resident.age}
                          onChange={(e) => {
                            const newResidents = [...residents];
                            newResidents[index].age = e.target.value;
                            setResidents(newResidents);
                          }}
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className='modal-footer'>
              <button type="button" className='btn-cancel' onClick={() => setIsModalOpenAdd(false)}>
                Cancel
              </button>
              <button type="submit" className='btn-save'>
                <mdIcons.MdSave /> Save Household
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <div className='handle-households'>
        <div className='action-buttons'>
          <button className="btn-add" onClick={() => setIsModalOpenAdd(true)}>
            <faIcons.FaPlus /> Add Household
          </button>

          <button 
            className="hh-btn-del-all" 
            onClick={handleDeleteAll}
            disabled={households.length === 0}
          >
            <mdIcons.MdDeleteOutline /> Delete All
          </button>
        </div>

        <div className='household-search-container'>
          <div className='search-wrapper'>
            <biIcons.BiSearch className='search-icon' />
            <input
              className='search'
              type="search"
              placeholder="Search Household"
              value={searchTerm}
              onChange={handleHouseholdsSearchChange}
            /> 
          </div>
        </div>
      </div>

      <div className='households-table-container'>
        <table className='households-table'>
          <thead>
            <tr>
              <th width="15%">Actions</th>
              <th width="60%">Name</th>
              <th width="25%">Residents</th>
            </tr>
          </thead>
          <tbody>
            {filteredHouseholds.length > 0 ? (
              filteredHouseholds.map((household) => (
              <tr key={household.id}>
                <td>
                  <button 
                    onClick={() => { setSelectedHousehold(household); setIsModalOpen(true); }} 
                    className='btn-action eyes'
                    title="View Details"
                  >
                    <ioIcons.IoEyeSharp />
                  </button>
                  <button className='btn-action edit' title="Edit">
                    <mdIcons.MdEdit />
                  </button>
                  <button 
                    onClick={() => deleteHousehold(household.id)} 
                    className='btn-action delete'
                    title="Delete"
                  >
                    <mdIcons.MdDeleteOutline />
                  </button>
                </td>
                <td className="household-name">{household.houseName}</td>
                <td>
                  <div className="residents-count">
                    <faIcons.FaUsers className="resident-icon" />
                    <span>{household.residents ? household.residents.length : 0}</span>
                  </div>
                </td>
              </tr>
              ))
              ) : (
                <tr className="no-data-row">
                  <td colSpan="3">
                    <div className="no-data-message">
                      <mdIcons.MdOutlineHomeWork className="no-data-icon" />
                      <p>No households found</p>
                    </div>
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Households;