import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import '../App.css'; 

const PatientRegPage = () => {
  const navigate = useNavigate(); 
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    bloodGroup: '',
    contactNumber: '',
    email: '',
    address: '',
  });
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [error, setError] = useState('');

  const API_BASE = 'http://localhost:8080/api/patients';

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE);
      setPatients(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch patients');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPatientId) {
        await axios.put(`${API_BASE}/${editingPatientId}`, form);
        setEditingPatientId(null);
      } else {
        await axios.post(API_BASE, form);
      }
      setForm({
        firstName: '',
        lastName: '',
        gender: '',
        dateOfBirth: '',
        bloodGroup: '',
        contactNumber: '',
        email: '',
        address: '',
      });
      fetchPatients();
      setError('');
    } catch (err) {
      setError('Failed to save patient data');
    }
  };

  const handleEdit = (patient) => {
    setEditingPatientId(patient.patientID);
    setForm({
      firstName: patient.firstName || '',
      lastName: patient.lastName || '',
      gender: patient.gender || '',
      dateOfBirth: patient.dateOfBirth || '',
      bloodGroup: patient.bloodGroup || '',
      contactNumber: patient.contactNumber || '',
      email: patient.email || '',
      address: patient.address || '',
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await axios.delete(`${API_BASE}/${id}`);
        fetchPatients();
      } catch {
        setError('Failed to delete patient');
      }
    }
  };

  const handleCancel = () => {
    setEditingPatientId(null);
    setForm({
      firstName: '',
      lastName: '',
      gender: '',
      dateOfBirth: '',
      bloodGroup: '',
      contactNumber: '',
      email: '',
      address: '',
    });
    setError('');
  };

  return (
    <div className="patient-reg-container">
      <button className="back-button-fixed" onClick={() => navigate('/dashboard')}>
        ⬅ Back to Home
      </button>

      <h2>Patient Registration</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input type="text" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
        <input type="text" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} />
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} />
        <input type="text" name="bloodGroup" placeholder="Blood Group" value={form.bloodGroup} onChange={handleChange} />
        <input type="text" name="contactNumber" placeholder="Contact Number" value={form.contactNumber} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleChange} />
        <div>
          <button type="submit">{editingPatientId ? 'Update' : 'Add'} Patient</button>
          {editingPatientId && <button type="button" onClick={handleCancel}>Cancel</button>}
        </div>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>Loading patients...</p>
      ) : patients.length === 0 ? (
        <p>No patients registered yet.</p>
      ) : (
        <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Gender</th>
              <th>DOB</th>
              <th>Blood Group</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.patientID}>
                <td>{p.patientID}</td>
                <td>{p.firstName}</td>
                <td>{p.lastName}</td>
                <td>{p.gender}</td>
                <td>{p.dateOfBirth}</td>
                <td>{p.bloodGroup}</td>
                <td>{p.contactNumber}</td>
                <td>{p.email}</td>
                <td>{p.address}</td>
                <td>
                  <button onClick={() => handleEdit(p)}>Edit</button>{' '}
                  <button onClick={() => handleDelete(p.patientID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientRegPage;
