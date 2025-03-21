import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/FacultyInfo.css';
import Navbar from './Navbar';

function FacultyInfo() {
  const [faculty, setFaculty] = useState([]);
  const [staffId, setStaffId] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [course, setCourse] = useState('');

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const response = await axios.get('http://localhost:5000/faculty');
      setFaculty(response.data);
    } catch (error) {
      console.error('Error fetching faculty:', error);
    }
  };

  const addFaculty = async () => {
    const newFaculty = { staffId, name, department, course };
    try {
      const response = await axios.post('http://localhost:5000/faculty', newFaculty);
      console.log('Faculty added:', response.data);
      fetchFaculty();
      setStaffId('');
      setName('');
      setDepartment('');
      setCourse('');
    } catch (error) {
      console.error('Error adding faculty:', error);
    }
  };

  const deleteFaculty = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/faculty/${id}`);
      fetchFaculty();
    } catch (error) {
      console.error('Error deleting faculty:', error);
    }
  };

  const groupByDepartment = (faculty) => {
    return faculty.reduce((groups, member) => {
      const dept = member.department;
      if (!groups[dept]) {
        groups[dept] = {};
      }
      if (!groups[dept][member.name]) {
        groups[dept][member.name] = { ...member, courses: [member.course] };
      } else {
        groups[dept][member.name].courses.push(member.course);
      }
      return groups;
    }, {});
  };

  const groupedFaculty = groupByDepartment(faculty);

  return (
    <div className="faculty-container">
      <Navbar />
      <h2>Faculty Information</h2>
      <div className="faculty-form">
        <input
          type="text"
          placeholder="Staff ID"
          value={staffId}
          onChange={(e) => setStaffId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
        <input
          type="text"
          placeholder="Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />
        <button onClick={addFaculty}>Add Faculty</button>
      </div>
      <div className="faculty-list">
        {Object.keys(groupedFaculty).map((dept) => (
          <div key={dept} className="department-group">
            <h3>{dept}</h3>
            <table>
              <thead>
                <tr>
                  <th>Staff ID</th>
                  <th>Name</th>
                  <th>Courses</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(groupedFaculty[dept])
                  .sort((a, b) => a.localeCompare(b))
                  .map((name) => (
                    <tr key={groupedFaculty[dept][name]._id}>
                      <td>{groupedFaculty[dept][name].staffId}</td>
                      <td>{name}</td>
                      <td>{groupedFaculty[dept][name].courses.join(', ')}</td>
                      <td>
                        <button onClick={() => deleteFaculty(groupedFaculty[dept][name]._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FacultyInfo;