import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import Modal from "../modal"; 
import * as ioIcons5 from "react-icons/io5";
import * as ioIcons from "react-icons/io5";
import * as mdIcons from "react-icons/md";

const API_URL = 'http://localhost:5001/residents';
const UPLOAD_URL = 'http://localhost:5001/upload-csv';

function Records() {
  const [formData, setFormData] = useState({ id: '', firstName: '', lastName: '', middleName: '', birthDate: '', age: '', placeBirth: '', address: '', gender: '', voterStatus: '', civilStatus: '', email: '', phoneNumber: '', fatherLname: '', fatherFname: '', motherLname: '', motherFname: ''  });
  const [residents, setResidents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [selectedResident, setSelectedResident] = useState(null);
  const [isResidentInfoOpen, setIsResidentInfoOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
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

  // Delete all residents
  const handleDeleteAll = async () => {
    try {
      await axios.delete(API_URL);
      toast.success('All residents deleted successfully!');
      fetchResidents();
    } catch (error) {
      toast.error('Error deleting all residents!');
      console.error('Error deleting all residents:', error);
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

  const indexOfLastStudent = currentPage * rowsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - rowsPerPage;
  const currentResidents = filteredResidents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredResidents.length / rowsPerPage);

  const handleSee = (resident) => {
    setSelectedResident(resident);
    setIsResidentInfoOpen(true);
  };

  const ResidentInfo = ({ resident, isOpen, onClose }) => {
    if (!resident) return null;
  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className='resident-info'>
          <h2>Resident Information</h2>
          <p><strong>ID:</strong> {resident.id}</p>
          <p><strong>First Name:</strong> {resident.firstName}</p>
          <p><strong>Last Name:</strong> {resident.lastName}</p>
          <p><strong>Middle Name:</strong> {resident.middleName}</p>
          <p><strong>Birth Date:</strong> {resident.birthDate}</p>
          <p><strong>Age:</strong> {resident.age}</p>
          <p><strong>Place of Birth:</strong> {resident.placeBirth}</p>
          <p><strong>Address:</strong> {resident.address}</p>
          <p><strong>Gender:</strong> {resident.gender}</p>
          <p><strong>Voter Status:</strong> {resident.voterStatus}</p>
          <p><strong>Civil Status:</strong> {resident.civilStatus}</p>
          <p><strong>Email:</strong> {resident.email}</p>
          <p><strong>Phone Number:</strong> {resident.phoneNumber}</p>
          <p><strong>Father's Last Name:</strong> {resident.fatherLname}</p>
          <p><strong>Father's First Name:</strong> {resident.fatherFname}</p>
          <p><strong>Mother's Last Name:</strong> {resident.motherLname}</p>
          <p><strong>Mother's First Name:</strong> {resident.motherFname}</p>
        </div>
      </Modal>
    );
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

      <ResidentInfo
        resident={selectedResident}
        isOpen={isResidentInfoOpen}
        onClose={() => setIsResidentInfoOpen(false)}
      />

      <div className='res-header'>Residents Information</div>

      <div className='handle-residents'>
        <div className='search-container'>
          <div className='search-icon'>
            <ioIcons5.IoSearch/>
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
        <div className='csv'>
          <input className='uploadBtn' id='uploadBtn' type="file" accept=".csv" onChange={handleFileUpload} />
          <label htmlFor="uploadBtn">Upload File</label>
        </div>
        <button className="btn-del-all" onClick={handleDeleteAll}><mdIcons.MdDeleteOutline /></button>
      </div>
      
      <div className='table-wrapper'>
        <table className='table'>
          <thead>
            <tr>
              <th>Actions</th>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Middle Name</th>
              <th>Birth Date</th>
              <th>Age</th>
              <th>Place of Birth</th>
              <th>Address</th>
              <th>Gender</th>
              <th>Email</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {currentResidents.length > 0 ? (
              currentResidents.map((resident) => (
              <tr key={resident.id}>
                <td> 
                  <div className='actions-btn'>
                    <button className='check' onClick={() => handleSee(resident)}><ioIcons.IoEyeSharp /></button>
                    <button className='edit' onClick={() => handleEdit(resident)}><mdIcons.MdEdit /></button>
                    <button className='del' onClick={() => handleDelete(resident.id)}><mdIcons.MdDeleteOutline /></button>
                  </div>
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

        <div className='paging-container'>
          <div className='paging-row'>
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1}>
              &lt;
            </button>
            <span className='pagin'> {currentPage} of {totalPages} </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
              disabled={currentPage === totalPages}>
              &gt;
            </button>
          </div>
        </div>
      </div> 
      <ToastContainer />
    </div>
  )
}

export default Records;