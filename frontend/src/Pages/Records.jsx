import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import Modal from "../modal"; 
import * as ioIcons5 from "react-icons/io5";
import * as ioIcons from "react-icons/io5";
import * as mdIcons from "react-icons/md";
import { QRCodeCanvas } from 'qrcode.react';

const API_URL = 'http://localhost:5001/residents';
const UPLOAD_URL = 'http://localhost:5001/upload-csv';

// Add export URL constant
const EXPORT_URL = 'http://localhost:5001/export-residents';

function Records() {
  const [formData, setFormData] = useState({ id: '', firstName: '', lastName: '', middleName: '', birthDate: '', age: '', placeBirth: '', address: '', gender: '', voterStatus: '', civilStatus: '', email: '', phoneNumber: '', fatherLname: '', fatherFname: '', motherLname: '', motherFname: ''  });
  const [residents, setResidents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [selectedResident, setSelectedResident] = useState(null);
  const [isResidentInfoOpen, setIsResidentInfoOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showQR, setShowQR] = useState(false);
  const rowsPerPage = 10;
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
      if (isEditing) {
        await axios.put(`${API_URL}/${formData.id}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      fetchResidents();
      setFormData({ id: '', firstName: '', lastName: '', middleName: '', birthDate: '', age: '', placeBirth: '', address: '', gender: '', voterStatus: '', civilStatus: '', email: '', phoneNumber: '', fatherLname: '', fatherFname: '', motherLname: '', motherFname: ''   });
      setIsModalOpen(false);
      setIsEditing(false);
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

  //filter residents
  const filteredResidents = residents.filter(resident =>
    resident.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.voterStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.civilStatus.toLowerCase().includes(searchTerm.toLowerCase()) 
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

  const handleExport = async () => {
    try {
      window.open(EXPORT_URL, '_blank');
      toast.success('Exporting residents data...');
    } catch (error) {
      toast.error('Error exporting residents data!');
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

  const borderStatus = (status) => {
    if (status === 'Registered') {
      return 'res-reg';
    } else {
      return 'res-not-reg';
    }
  }

  const ResidentInfo = ({ resident, isOpen, onClose }) => {
    if (!resident) return null;
  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className='resident-info'>
          <h2>Resident Information</h2>
          {showQR && (
            <div className="qr-code-container">
              <QRCodeCanvas value={JSON.stringify(resident)} size={256} />
              <button onClick={() => setShowQR(false)}>Hide QR Code</button>
            </div>
          )}
          {!showQR && (
            <button onClick={() => setShowQR(true)}>Show QR Code</button>
          )}
          <p>ID: {resident.id}</p>
          <p>First Name: {resident.firstName}</p>
          <p>Last Name: {resident.lastName}</p>
          <p>Middle Name: {resident.middleName}</p>
          <p>Birth Date: {resident.birthDate}</p>
          <p>Age: {resident.age}</p>
          <p>Place of Birth: {resident.placeBirth}</p>
          <p>Address: {resident.address}</p>
          <p>Gender: {resident.gender}</p>
          <p>Voter Status: {resident.voterStatus}</p>
          <p>Civil Status: {resident.civilStatus}</p>
          <p>Email: {resident.email}</p>
          <p>Phone Number: {resident.phoneNumber}</p>
          <p>Father</p>
          <p>Last Name: {resident.fatherLname}</p>
          <p>First Name: {resident.fatherFname}</p>
          <p>Mother</p>
          <p>Last Name: {resident.motherLname}</p>
          <p>First Name: {resident.motherFname}</p>
        </div>
      </Modal>
    );
  };

  return (
    <div className='records' >

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className='form'>
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

            <div className='second-form'>
              <div className='input-field'>
                <label>Place of Birth</label>
                <input type="text" name="placeBirth" placeholder="Place of Birth" value={formData.placeBirth} onChange={handleChange} required  />
              </div>
              <div className='input-field'>
                <label>Address</label>
                <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />  
              </div>
              <div className='input-field'>
                <label>Phone Number</label>
                <input type="number" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange}required  />
              </div>
            </div>
              
            <div className='second-form'>
              <div className='input-field'>
                <label>Gender</label>
                <select name='gender' value={formData.gender} onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className='input-field'>
                <label>Voter Status</label>
                <select name='voterStatus' value={formData.voterStatus} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="Registered">Registered</option>
                  <option value="Not Registered">Not Registered</option>
                </select>
              </div>

              <div className='input-field'>
                <label>Civil Status</label>
                <select name='civilStatus' value={formData.civilStatus} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Separated">Separated</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
            </div>
            
            <p className='input-field'>Father</p>
            <div className='third-form'>
              <div className='input-field'>
                <label>Last Name</label>
                <input type="text" name="fatherLname" placeholder="Father Last Name" value={formData.fatherLname} onChange={handleChange} required  />
              </div>
              <div className='input-field'>
                <label>First Name</label>
                <input type="text" name="fatherFname" placeholder="Father First Name" value={formData.fatherFname} onChange={handleChange} required  />
              </div>
            </div>

            <p className='input-field'>Mother</p>
            <div className='third-form'>
              <div className='input-field'>
                <label>Last Name</label>
                <input type="text" name="motherLname" placeholder="Mother Last Name" value={formData.motherLname} onChange={handleChange} required />
              </div>
              <div className='input-field'>
                <label>First Name</label>
                <input type="text" name="motherFname" placeholder="Mother First Name" value={formData.motherFname} onChange={handleChange} required />
              </div>
            </div>

            <div className='add-res-btn-container'>
              <button className='add-res-btn' type="submit">{isEditing ? 'Update Resident' : 'Add Resident'}</button>
            </div>
          </form>
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
        <button className="btn" onClick={handleExport}>Export CSV</button>
        <button className="btn-del-all" title='Delete All' onClick={handleDeleteAll}><mdIcons.MdDeleteOutline /></button>
        <div className='total-res'>Residents: {residents.length}</div>
      </div>
      
      <div className='table-wrapper'>
        <table className='table'>
          <thead>
            <tr>
              <th>Actions</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Middle Name</th>
              <th>Birth Date</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Email</th>
              <th>Civil Status</th>
              <th>Voter Status</th>
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
                <td>{resident.firstName}</td>
                <td>{resident.lastName}</td>
                <td>{resident.middleName}</td>
                <td>{resident.birthDate}</td>
                <td>{resident.age}</td>
                <td>{resident.gender}</td>
                <td>{resident.email}</td>
                <td>{resident.civilStatus}</td>
                <td><div className={borderStatus(resident.voterStatus)}>{resident.voterStatus}</div></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No Residents found</td>
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
            <span className='pagin'> Page {currentPage} of {totalPages} </span>
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