import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <button className="logout-button-fixed" onClick={() => navigate("/login")}>
        🔒 Logout
      </button>
      <header className="header">
        TJD Hospital
      </header>
      <nav className="nav-buttons-container">
        <button onClick={() => navigate("/patient-register")}>
          🧑🏻‍💼 Patient Register
        </button>
        <button onClick={() => navigate("/patient-appointment")}>
          💻 Patient Appointment
        </button>
        <button onClick={() => navigate("/doctor")}>
          🧑🏻‍⚕️ Doctor
        </button>
      </nav>
    </div>
  );
};

export default HomePage;
