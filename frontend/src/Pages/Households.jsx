import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as ioIcons from "react-icons/io5";
import * as mdIcons from "react-icons/md";
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
    }
  };

  useEffect(() => {
    fetchHouseholds();
  }, []);

// Add a household
const addHousehold = async (e) => {
  e.preventDefault();
  try {
    await axios.post(API_URL, {
      id,
      houseName,
      residents
    });
    fetchHouseholds();
    setId('');
    setHouseName('');
    setResidents([]);
  } catch (error) {
      toast.error('Error adding household!');
  }
  setIsModalOpenAdd(false);
};

// Delete a household
const deleteHousehold = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success('Household deleted!');
      fetchHouseholds();
    } catch (error) {
      toast.error('Error deleting household!');
    }
};

  // Delete all households
  const handleDeleteAll = async () => {
    try {
      await axios.delete(API_URL);
      toast.success('All households deleted successfully!');
      fetchHouseholds();
    } catch (error) {
      toast.error('Error deleting all households!');
      console.error('Error deleting all households', error);
    }
  };

  // Handle search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  //filter households
  const filteredHouseholds = households.filter(household =>
    household.id.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

    // households information modal 
    const householdInfoModal = () => {
      if (!selectedHousehold) return null;

      return (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className='household-info-modal'>
            <h3>Household Information</h3>
            <p>Household Name</p>
            <div className='household-name-container'>{selectedHousehold.houseName} </div>
            <div className='household-info-table-container'>
              <table className='households-info-table'>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Ages</th>
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
        </Modal>
      )
    };

    return (
      <div className='households-container'>
        {householdInfoModal()}
        <p>Household Information</p>
        <Modal isOpen={isModalOpenAdd} onClose={() => setIsModalOpenAdd(false)}>
          <div className='household-add-modal'>
            <input
              className='input-household-id'
              type="text"
              placeholder="Household ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
            <input
              className='input-household-name'
              type="text"
              placeholder="Household Name"
              value={houseName}
              onChange={(e) => setHouseName(e.target.value)}
              required
            />
            <button className='btn-add-resident' onClick={() => setResidents([...residents, { name: '', gender: '', age: '' }])}>
              Add Resident
            </button>
            <button className='btn-sv-hsh' onClick={addHousehold}>Save Household</button>
            <div className='attr-hsh-outer'>
              {residents.map((resident, index) => (
                <div className='attr-hsh' key={index}>
                  <div className='input-field-hsh'>
                    <label>Name</label>
                    <input
                      type="text"
                      placeholder="Name"
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
                    <input
                      type="text"
                      placeholder="Gender"
                      value={resident.gender}
                      onChange={(e) => {
                          const newResidents = [...residents];
                          newResidents[index].gender = e.target.value;
                          setResidents(newResidents);
                      }}
                      required
                    />
                  </div>
                  <div className='input-field-hsh'>
                    <label>Age</label>
                    <input
                      type="number"
                      placeholder="Age"
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
              ))}
            </div>
          </div>
        </Modal>

        <div className='handle-households'>
          <div>
            <button className="btn" onClick={() => setIsModalOpenAdd(true)}>Add Resident</button>

            <button className="hh-btn-del-all" onClick={handleDeleteAll}><mdIcons.MdDeleteOutline /></button>
          </div>

          <div className='household-search-container'>
            <input
              className='search'
              type="search"
              placeholder="Search Residents"
              value={searchTerm}
              onChange={handleSearchChange}
            /> 
            <div className='search-icon'>
              <ioIcons.IoSearch/>
            </div>
          </div>
        </div>

        <div className='households-table-container'>
          <table className='households-table'>
            <thead>
              <tr>
                <th>Actions</th>
                <th>Name</th>
                <th>Residents</th>
              </tr>
            </thead>
            <tbody>
              {filteredHouseholds.length > 0 ? (
                filteredHouseholds.map((households) => (
                <tr key={households.id}>
                  <td>
                    <button onClick={() => { setSelectedHousehold(households); setIsModalOpen(true); }} className='eyes'><ioIcons.IoEyeSharp /></button>
                    <button className='edit'><mdIcons.MdEdit /></button>
                    <button onClick={() => deleteHousehold(households.id)} className='delete'><mdIcons.MdDeleteOutline /></button>
                  </td>
                  <td>{households.houseName}</td>
                  <td>{households.residents ? households.residents.length : 0}</td>
                </tr>
                ))
                ) : (
                  <tr>
                    <td colSpan="9">No students found</td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
        <ToastContainer />
      </div>
  );

};

export default Households;


