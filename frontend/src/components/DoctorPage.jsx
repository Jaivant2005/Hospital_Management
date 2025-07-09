  import React, { useEffect, useState } from 'react';
  import axios from 'axios';
  import { useNavigate } from 'react-router-dom';

  const API_URL = 'http://localhost:8080/api/doctors';

  const DoctorPage = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
      firstName: '',
      lastName: '',
      gender: '',
      department: '',
      contactNumber: '',
      email: '',
      availability: '',
    });
    const [editingId, setEditingId] = useState(null);

    const navigate = useNavigate();

    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const res = await axios.get(API_URL);
        setDoctors(res.data);
        setError('');
      } catch {
        setError('Failed to fetch doctors');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchDoctors();
    }, []);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!form.firstName || !form.department || !form.email) {
        setError('First Name, Department, and Email are required.');
        return;
      }
      setLoading(true);
      try {
        if (editingId) {
          await axios.put(`${API_URL}/${editingId}`, form);
          setEditingId(null);
        } else {
          await axios.post(API_URL, form);
        }
        setForm({
          firstName: '',
          lastName: '',
          gender: '',
          department: '',
          contactNumber: '',
          email: '',
          availability: '',
        });
        setError('');
        fetchDoctors();
      } catch {
        setError('Failed to save doctor');
      } finally {
        setLoading(false);
      }
    };

    const handleEdit = (doctor) => {
      setEditingId(doctor.doctorID);
      setForm({
        firstName: doctor.firstName || '',
        lastName: doctor.lastName || '',
        gender: doctor.gender || '',
        department: doctor.department || '',
        contactNumber: doctor.contactNumber || '',
        email: doctor.email || '',
        availability: doctor.availability || '',
      });
      setError('');
    };

    const handleDelete = async (id) => {
      if (window.confirm('Are you sure to delete this doctor?')) {
        try {
          await axios.delete(`${API_URL}/${id}`);
          fetchDoctors();
        } catch {
          setError('Failed to delete doctor');
        }
      }
    };

    return (
      <div className="page-container">
        <button className="back-button-fixed" onClick={() => navigate('/dashboard')}>
          ← Back to Home
        </button>

        <h2>Doctors</h2>

        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <input
            name="firstName"
            placeholder="First Name *"
            value={form.firstName}
            onChange={handleChange}
            required
            style={{ marginRight: '8px' }}
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            style={{ marginRight: '8px' }}
          />
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            style={{ marginRight: '8px' }}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            name="department"
            placeholder="Department *"
            value={form.department}
            onChange={handleChange}
            required
            style={{ marginRight: '8px' }}
          />
          <input
            name="contactNumber"
            placeholder="Contact Number"
            value={form.contactNumber}
            onChange={handleChange}
            style={{ marginRight: '8px' }}
          />
          <input
            name="email"
            type="email"
            placeholder="Email *"
            value={form.email}
            onChange={handleChange}
            required
            style={{ marginRight: '8px' }}
          />
          <input
            name="availability"
            placeholder="Availability (e.g. Mon-Fri)"
            value={form.availability}
            onChange={handleChange}
            style={{ marginRight: '8px' }}
          />
          <button type="submit" disabled={loading}>
            {editingId ? 'Update' : 'Add'} Doctor
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({
                  firstName: '',
                  lastName: '',
                  gender: '',
                  department: '',
                  contactNumber: '',
                  email: '',
                  availability: '',
                });
                setError('');
              }}
              style={{ marginLeft: '8px' }}
            >
              Cancel
            </button>
          )}
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {loading ? (
          <p>Loading doctors...</p>
        ) : doctors.length === 0 ? (
          <p>No doctors found.</p>
        ) : (
          <table
            style={{
              borderCollapse: 'collapse',
              width: '100%',
              border: '1px solid #ccc',
            }}
          >
            <thead>
              <tr>
                {[
                  'ID',
                  'First Name',
                  'Last Name',
                  'Gender',
                  'Department',
                  'Contact Number',
                  'Email',
                  'Availability',
                  'Actions',
                ].map((header) => (
                  <th
                    key={header}
                    style={{
                      border: '1px solid #ccc',
                      padding: '8px',
                      backgroundColor: '#f2f2f2',
                      textAlign: 'left',
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc) => (
                <tr key={doc.doctorID}>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{doc.doctorID}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{doc.firstName}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{doc.lastName}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{doc.gender}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{doc.department}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{doc.contactNumber}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{doc.email}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{doc.availability}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    <button
                      onClick={() => handleEdit(doc)}
                      style={{ marginRight: '8px' }}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDelete(doc.doctorID)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  export default DoctorPage;
