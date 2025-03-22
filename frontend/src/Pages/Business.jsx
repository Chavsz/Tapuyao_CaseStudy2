import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as mdIcons from "react-icons/md";

function Business() {
  const [businesses, setBusinesses] = useState([]);
  const [form, setForm] = useState({
    id: '',
    businessName: '',
    ownerName: '',
    businessAddress: '',
    dateRegistered: '',
    expiracyDate: '',
    businessStatus: '',
    contactNumber: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const res = await axios.get('http://localhost:5001/businesses');
      setBusinesses(res.data);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5001/businesses/${form.id}`, form);
      } else {
        await axios.post('http://localhost:5001/businesses', form);
      }
      fetchBusinesses();
      setForm({
        id: '',
        businessName: '',
        ownerName: '',
        businessAddress: '',
        dateRegistered: '',
        expiracyDate: '',
        businessStatus: '',
        contactNumber: '',
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving business:', error);
    }
  };

  const handleEdit = (business) => {
    setForm(business);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/businesses/${id}`);
      fetchBusinesses();
    } catch (error) {
      console.error('Error deleting business:', error);
    }
  };

  return (
    <div className='business-container'>

      <div className='business-header'>
        <p>Business information</p>
      </div>

      <div className='bsns-form'>
        <form onSubmit={handleSubmit}>
          <div className='bsns-form-1'>
            <div className='input-bsns'>
              <label>ID</label>
              <input type="text" name="id" value={form.id} onChange={handleChange} required />
            </div>

            <div className='input-bsns'>
              <label>Business Name</label>
              <input type="text" name="businessName" value={form.businessName} onChange={handleChange} required />
            </div>
          </div>

          <div className='bsns-form-1'>
            <div className='input-bsns'>
              <label>Owner Name</label>
              <input type="text" name="ownerName"  value={form.ownerName} onChange={handleChange} required />
            </div>

            <div className='input-bsns'>
              <label>Address</label>
              <input type="text" name="businessAddress"  value={form.businessAddress} onChange={handleChange} required />
            </div>
          </div>

          <div className='bsns-form-1'>
            <div className='input-bsns'>
              <label>Date Registered</label>
              <input type="date" name="dateRegistered" value={form.dateRegistered} onChange={handleChange} required />
            </div>

            <div className='input-bsns'>
              <label>Expiry</label>
              <input type="date" name="expiracyDate" value={form.expiracyDate} onChange={handleChange} required />
            </div>
          </div>

          <div className='bsns-form-1'>
            <div className='input-bsns'>
              <label>Status</label>
              <input type="text" name="businessStatus" value={form.businessStatus} onChange={handleChange} required />
            </div>

            <div className='input-bsns'>
              <label>Contacts</label>
              <input type="text" name="contactNumber" value={form.contactNumber} onChange={handleChange} required />
            </div>
          </div>
          <button className="bsns-form-btn" type="submit">{isEditing ? 'Update Business' : 'Add Business'}</button>
        </form>
      </div>

      <table className='business-table'>
        <thead>
          <tr>
            <th>Action</th>
            <th>ID</th>
            <th>Business Name</th>
            <th>Owner Name</th>
            <th>Address</th>
            <th>Date Registered</th>
            <th>Expiry Date</th>
            <th>Status</th>
            <th>Contact</th>
          </tr>
        </thead>
        <tbody>
          {businesses.map((business) => (
            <tr key={business.id}>
              <td>
                <button className='business-edit' onClick={() => handleEdit(business)}><mdIcons.MdEdit /></button>
                <button className='business-del' onClick={() => handleDelete(business.id)}><mdIcons.MdDeleteOutline /></button>
              </td>
              <td>{business.id}</td>
              <td>{business.businessName}</td>
              <td>{business.ownerName}</td>
              <td>{business.businessAddress}</td>
              <td>{business.dateRegistered}</td>
              <td>{business.expiracyDate}</td>
              <td>{business.businessStatus}</td>
              <td>{business.contactNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default Business;
