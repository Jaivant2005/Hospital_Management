import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import PatientReg from './components/PatientRegPage';
import PatientAppointmentPage from './components/PatientAppointmentPage'; 
import DoctorPage from './components/DoctorPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="/patient-register" element={<PatientReg />} />
        <Route path="/patient-appointment" element={<PatientAppointmentPage />} />
        <Route path="/doctor" element={<DoctorPage />} /> 
      </Routes>
    </Router>
  );
};

export default App;
