import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientAppointmentService from '../services/PatientAppointmentservice';

const PatientAppointmentPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    status: '',
    patientID: '',
    doctorID: '',
  });
  const [editingId, setEditingId] = useState(null);

  const navigate = useNavigate();

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await PatientAppointmentService.getAll();
      setAppointments(res.data);
      setFilteredAppointments(res.data);
      setError('');
    } catch {
      setError('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (filterStatus === 'All') {
      setFilteredAppointments(appointments);
    } else {
      const filtered = appointments.filter(
        (a) => a.status?.toLowerCase() === filterStatus.toLowerCase()
      );
      setFilteredAppointments(filtered);
    }
  }, [filterStatus, appointments]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientID || !form.doctorID || !form.appointmentDate || !form.appointmentTime) {
      setError('Patient, Doctor, Date and Time are required.');
      return;
    }
    setLoading(true);
    try {
      if (editingId) {
        await PatientAppointmentService.update(editingId, form);
        setEditingId(null);
      } else {
        await PatientAppointmentService.create(form);
      }
      setForm({
        appointmentDate: '',
        appointmentTime: '',
        reason: '',
        status: '',
        patientID: '',
        doctorID: '',
      });
      setError('');
      fetchAppointments();
    } catch {
      setError('Failed to save appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <button className="back-button-fixed" onClick={() => navigate('/dashboard')}>
        ← Back to Home
      </button>

      <h2>Patient Appointments</h2>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="filterStatus" style={{ fontWeight: 'bold', marginRight: '10px' }}>
          Filter by Status:
        </label>
        <select
          id="filterStatus"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="date"
          name="appointmentDate"
          value={form.appointmentDate}
          onChange={handleChange}
          required
          style={{ marginRight: '8px' }}
        />
        <input
          type="time"
          name="appointmentTime"
          value={form.appointmentTime}
          onChange={handleChange}
          required
          style={{ marginRight: '8px' }}
        />
        <input
          type="text"
          name="reason"
          placeholder="Reason"
          value={form.reason}
          onChange={handleChange}
          style={{ marginRight: '8px' }}
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          style={{ marginRight: '8px' }}
        >
          <option value="">Select Status</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <input
          type="number"
          name="patientID"
          placeholder="Patient ID"
          value={form.patientID}
          onChange={handleChange}
          required
          style={{ marginRight: '8px', width: '90px' }}
        />
        <input
          type="number"
          name="doctorID"
          placeholder="Doctor ID"
          value={form.doctorID}
          onChange={handleChange}
          required
          style={{ marginRight: '8px', width: '90px' }}
        />
        <button type="submit" disabled={loading}>
          {editingId ? 'Update' : 'Add'} Appointment
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({
                appointmentDate: '',
                appointmentTime: '',
                reason: '',
                status: '',
                patientID: '',
                doctorID: '',
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
        <p>Loading appointments...</p>
      ) : filteredAppointments.length === 0 ? (
        <p>No appointments found.</p>
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
              {['ID', 'Date', 'Time', 'Reason', 'Status', 'Patient Name', 'Doctor Name', 'Actions'].map((header) => (
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
            {filteredAppointments.map((a) => (
              <tr key={a.appointmentID}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{a.appointmentID}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{a.appointmentDate}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{a.appointmentTime}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{a.reason}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{a.status}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {a.patient?.fullName || `${a.patient?.firstName || ''} ${a.patient?.lastName || ''}`}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {a.doctor?.fullName || `${a.doctor?.firstName || ''} ${a.doctor?.lastName || ''}`}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  <button
                    onClick={() => {
                      setEditingId(a.appointmentID);
                      setForm({
                        appointmentDate: a.appointmentDate,
                        appointmentTime: a.appointmentTime,
                        reason: a.reason || '',
                        status: a.status || '',
                        patientID: a.patient?.patientID || '',
                        doctorID: a.doctor?.doctorID || '',
                      });
                      setError('');
                    }}
                    style={{ marginRight: '8px' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (window.confirm('Are you sure to delete this appointment?')) {
                        try {
                          await PatientAppointmentService.remove(a.appointmentID);
                          fetchAppointments();
                        } catch {
                          setError('Failed to delete appointment');
                        }
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientAppointmentPage;
