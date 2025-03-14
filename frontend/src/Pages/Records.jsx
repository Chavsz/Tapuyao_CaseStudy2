import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import Modal from "../modal"; 
import * as ioIcons from "react-icons/io5";

const API_URL = 'http://localhost:5001/residents';
const UPLOAD_URL = 'http://localhost:5001/upload-csv';

function Records() {
  const [formData, setFormData] = useState({ id: '', firstName: '', lastName: '', middleName: '', birthDate: '', age: '', placeBirth: '', address: '', gender: '', voterStatus: '', civilStatus: '', email: '', phoneNumber: '', fatherLname: '', fatherFname: '', motherLname: '', motherFname: ''  });
  const [residents, setResidents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [theme, setTheme] = useState("light")

  // Fetch all residents
  const fetchResidents = async () => {
    try {
      const response = await axios.get(API_URL);
      setResidents(response.data);
    } catch (error) {
      console.error('Error fetching residents:', error);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // Add new resident
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData);
      toast.success('resident added successfully!');
      fetchResidents();
      setFormData({ id: '', firstName: '', lastName: '', middleName: '', birthDate: '', age: '', placeBirth: '', address: '', gender: '', voterStatus: '', civilStatus: '', email: '', phoneNumber: '', fatherLname: '', fatherFname: '', motherLname: '', motherFname: ''   });
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Error adding resident!');
    }
  };

  // Update existing resident
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${formData.id}`, formData);
      toast.success('resident updated successfully!');
      fetchResidents();
      setFormData({ id: '', firstName: '', lastName: '', middleName: '', birthDate: '', age: '', placeBirth: '', address: '', gender: '', voterStatus: '', civilStatus: '', email: '', phoneNumber: '', fatherLname: '', fatherFname: '', motherLname: '', motherFname: ''  });
      setIsEditing(false);
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Error updating resident!');
    }
  };

  // Delete resident
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success('resident deleted!');
      fetchResidents();
    } catch (error) {
      toast.error('Error deleting resident!');
    }
  };

  // Populate form for updating resident
  const handleEdit = (resident) => {
    setFormData(resident);
    setIsEditing(true);
    setIsModalOpen(true);
  };

   // Handle search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  //filter students
  const filteredResidents = residents.filter(resident =>
    resident.firstName.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      await axios.post(UPLOAD_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('CSV file uploaded successfully!');
      fetchResidents();
    } catch (error) {
      toast.error('Error uploading CSV file!');
      console.error('Error uploading CSV file:', error);
    }
  };

  return (
    <div className='records' >

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <div className='form'>
      {!isEditing ? (
        <form onSubmit={handleAddSubmit}>
          <div className='id-form'>
            <div className='input-field'>
              <label>ID</label>
              <input type="text" name="id" placeholder="ID" value={formData.id} onChange={handleChange} required />
            </div>

            <div className='input-field'>
              <label>Firstname</label>
              <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange}required  />
            </div>

            <div className='input-field'>
              <label>Lastname</label>
              <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange}required  />
            </div>

            <div className='input-field'>
              <label>Middlename</label>
              <input type="text" name="middleName" placeholder="Middle Name" value={formData.middleName} onChange={handleChange} required />
            </div>
          </div>

          <div className='second-form'>
            <div className='input-field'>
              <label>Birth Date</label>
              <input type="date" name="birthDate" placeholder="Birth Date" value={formData.birthDate} onChange={handleChange}  required />
            </div>
            
            <div className='input-field'>
              <label>Age</label>
              <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange}required   />
            </div>

            <div className='input-field'>
              <label>Email</label>
              <input type="text" name="email" placeholder="Email" value={formData.email} onChange={handleChange}required />
            </div>
          </div>
          <label>Place of Birth</label>
          <input type="text" name="placeBirth" placeholder="Place of Birth" value={formData.placeBirth} onChange={handleChange} required  />
          <label>Address</label>
          <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />

          <label>Gender</label>
          <select name='gender' value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
          </select>

          <label>Voter Status</label>
          <select name='voterStatus' value={formData.voterStatus} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Registered">Registered</option>
                <option value="Not Registered">Not Registered</option>
          </select>

          <label>Civil Status</label>
          <input type="text" name="civilStatus" placeholder="Civil Status" value={formData.civilStatus} onChange={handleChange} required />
          
          <label>Phone Number</label>
          <input type="number" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange}required  />
          <p>Father</p>
          <label>Last Name</label>
          <input type="text" name="fatherLname" placeholder="Father Last Name" value={formData.fatherLname} onChange={handleChange} required  />
          <label>First Name</label>
          <input type="text" name="fatherFname" placeholder="Father First Name" value={formData.fatherFname} onChange={handleChange} required  />
          <p>Mother</p>
          <label>Last Name</label>
          <input type="text" name="motherLname" placeholder="Mother Last Name" value={formData.motherLname} onChange={handleChange} required />
          <label>First Name</label>
          <input type="text" name="motherFname" placeholder="Mother First Name" value={formData.motherFname} onChange={handleChange} required />
          <button type="submit">Add resident</button>
        </form>
      ) : (
        <form onSubmit={handleEditSubmit}>
          <div className='id-form'>
            <div className='input-field'>
              <label>ID</label>
              <input type="text" name="id" placeholder="ID" value={formData.id} onChange={handleChange} required />
            </div>

            <div className='input-field'>
              <label>Firstname</label>
              <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange}required  />
            </div>

            <div className='input-field'>
              <label>Lastname</label>
              <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange}required  />
            </div>

            <div className='input-field'>
              <label>Middlename</label>
              <input type="text" name="middleName" placeholder="Middle Name" value={formData.middleName} onChange={handleChange} required />
            </div>
          </div>

          <div className='second-form'>
            <div className='input-field'>
              <label>Birth Date</label>
              <input type="date" name="birthDate" placeholder="Birth Date" value={formData.birthDate} onChange={handleChange}  required />
            </div>
            
            <div className='input-field'>
              <label>Age</label>
              <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange}required   />
            </div>

            <div className='input-field'>
              <label>Email</label>
              <input type="text" name="email" placeholder="Email" value={formData.email} onChange={handleChange}required />
            </div>
          </div>
          <label>Place of Birth</label>
          <input type="text" name="placeBirth" placeholder="Place of Birth" value={formData.placeBirth} onChange={handleChange} required  />
          <label>Address</label>
          <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />

          <label>Gender</label>
          <select name='gender' value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
          </select>

          <label>Voter Status</label>
          <select name='voterStatus' value={formData.voterStatus} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Registered">Registered</option>
                <option value="Not Registered">Not Registered</option>
          </select>

          <label>Civil Status</label>
          <input type="text" name="civilStatus" placeholder="Civil Status" value={formData.civilStatus} onChange={handleChange} required />
          
          <label>Phone Number</label>
          <input type="number" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange}required  />
          <p>Father</p>
          <label>Last Name</label>
          <input type="text" name="fatherLname" placeholder="Father Last Name" value={formData.fatherLname} onChange={handleChange} required  />
          <label>First Name</label>
          <input type="text" name="fatherFname" placeholder="Father First Name" value={formData.fatherFname} onChange={handleChange} required  />
          <p>Mother</p>
          <label>Last Name</label>
          <input type="text" name="motherLname" placeholder="Mother Last Name" value={formData.motherLname} onChange={handleChange} required />
          <label>First Name</label>
          <input type="text" name="motherFname" placeholder="Mother First Name" value={formData.motherFname} onChange={handleChange} required />
          <button type="submit">Update resident</button>
        </form>
      )}
      </div>
      </Modal>

      <div className='handle-residents'>
        <div className='search-container'>
          <div className='search-icon'>
            <ioIcons.IoSearch/>
          </div>
          <input
            className='search'
            type="search"
            placeholder="Search Residents"
            value={searchTerm}
            onChange={handleSearchChange}
          /> 
        </div>
        <button className="btn" onClick={() => setIsModalOpen(true)}>Add Resident</button>
        <input type="file" accept=".csv" onChange={handleFileUpload} />
      </div>
      
      <div className='table-wrapper'>
        <table className='table'>
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Middle Name</th>
              <th>Birth Date</th>
              <th>Age</th>
              <th>Place of Birth</th>
              <th>Address</th>
              <th>Gender</th>
              <th>Voter Status</th>
              <th>Civil Status</th>
              <th>Email</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {filteredResidents.length > 0 ? (
              filteredResidents.map((resident) => (
              <tr key={resident.id}>
                <td>
                  <button className='edit' onClick={() => handleEdit(resident)}>Edit</button>
                  <button className='del' onClick={() => handleDelete(resident.id)}>Delete</button>
                </td>
                <td>{resident.id}</td>
                <td>{resident.firstName}</td>
                <td>{resident.lastName}</td>
                <td>{resident.middleName}</td>
                <td>{resident.birthDate}</td>
                <td>{resident.age}</td>
                <td>{resident.placeBirth}</td>
                <td>{resident.address}</td>
                <td>{resident.gender}</td>
                <td>{resident.voterStatus}</td>
                <td>{resident.civilStatus}</td>
                <td>{resident.email}</td>
                <td>{resident.phoneNumber}</td>
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
  )
}

export default Records;