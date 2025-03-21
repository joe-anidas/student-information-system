import React from 'react';
import { Link } from 'react-router-dom';
import './css/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/student">Home</Link></li>
        <li><Link to="/student-view">Student Info</Link></li>
        <li><Link to="/course-view">Course Info</Link></li>
        <li><Link to="/report">Report</Link></li>
        <li><Link to="/">Logout</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;