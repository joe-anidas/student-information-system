import React from 'react';
import { Link } from 'react-router-dom';
import './css/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/faculty">Home</Link></li>
        <li><Link to="/student-info-view">Student Info</Link></li>
        <li><Link to="/course-details">Course Info</Link></li>
        <li><Link to="/report-info">Reports</Link></li>
        <li><Link to="/">Logout</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;