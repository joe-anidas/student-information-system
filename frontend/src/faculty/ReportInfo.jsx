import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/ReportInfo.css';
import Navbar from './Navbar';

function ReportInfo() {
  const [marks, setMarks] = useState([]);
  const [registerNumber, setRegisterNumber] = useState('');
  const [course, setCourse] = useState('');
  const [internalMarks, setInternalMarks] = useState('');
  const [semesterMarks, setSemesterMarks] = useState('');
  const [dept, setDept] = useState('');

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/marks`);
      setMarks(response.data);
    } catch (error) {
      console.error('Error fetching marks:', error);
    }
  };

  const addMarks = async () => {
    try {
      const totalMarks = Number(internalMarks) + Number(semesterMarks);
      let grade = 'U';
      if (totalMarks >= 90) grade = 'O';
      else if (totalMarks >= 80) grade = 'A+';
      else if (totalMarks >= 70) grade = 'A';
      else if (totalMarks >= 60) grade = 'B+';
      else if (totalMarks >= 50) grade = 'B';

      const newMarks = { registerNumber, course, dept, internalMarks: Number(internalMarks), semesterMarks: Number(semesterMarks), totalMarks, grade };
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/marks`, newMarks);
      fetchMarks();
      setRegisterNumber('');
      setCourse('');
      setDept('');
      setInternalMarks('');
      setSemesterMarks('');
    } catch (error) {
      console.error('Error adding marks:', error);
    }
  };

  const deleteMarks = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/marks/${id}`);
      fetchMarks();
    } catch (error) {
      console.error('Error deleting marks:', error);
    }
  };

  const groupedMarks = marks.reduce((groups, mark) => {
    if (!groups[mark.dept]) groups[mark.dept] = [];
    groups[mark.dept].push(mark);
    return groups;
  }, {});

  return (
    <div className="report-container">
      <Navbar />
      <h2>Report</h2>
      <div className="marks-form">
        <input type="text" placeholder="Register Number" value={registerNumber} onChange={(e) => setRegisterNumber(e.target.value)} />
        <input type="text" placeholder="Course" value={course} onChange={(e) => setCourse(e.target.value)} />
        <input type="text" placeholder="Department" value={dept} onChange={(e) => setDept(e.target.value)} />
        <input type="number" placeholder="Internal Marks" value={internalMarks} onChange={(e) => setInternalMarks(e.target.value)} />
        <input type="number" placeholder="Semester Marks" value={semesterMarks} onChange={(e) => setSemesterMarks(e.target.value)} />
        <button onClick={addMarks}>Add Marks</button>
      </div>
      <div className="marks-list">
        {Object.keys(groupedMarks).map((key) => (
          <div key={key} className="dept-group">
            <h3>{key}</h3>
            <table>
              <thead>
                <tr>
                  <th>Register Number</th>
                  <th>Course</th>
                  <th>Department</th>
                  <th>Internal Marks</th>
                  <th>Semester Marks</th>
                  <th>Total Marks</th>
                  <th>Grade</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupedMarks[key].map((mark) => (
                  <tr key={mark._id}>
                    <td>{mark.registerNumber}</td>
                    <td>{mark.course}</td>
                    <td>{mark.dept}</td>
                    <td>{mark.internalMarks}</td>
                    <td>{mark.semesterMarks}</td>
                    <td>{mark.totalMarks}</td>
                    <td>{mark.grade}</td>
                    <td>
                      <button onClick={() => deleteMarks(mark._id)}>Delete</button>
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

export default ReportInfo;