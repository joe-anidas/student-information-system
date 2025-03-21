import React from 'react';
import { Link } from 'react-router-dom';
import './css/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/admin">Home</Link></li>
        <li><Link to="/student-info">Student Info</Link></li>
        <li><Link to="/faculty-info">Faculty Info</Link></li>
        <li><Link to="/course-info">Course Info</Link></li>
        <li><Link to="/report-view">Reports</Link></li>
        <li><Link to="/">Logout</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;