import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/StudentInfo.css';
import Navbar from './Navbar';

function StudentView() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/students`);
      setStudents(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to load student data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const groupByDeptAndBatchYear = (students) => {
    return students.reduce((groups, student) => {
      const key = `${student.dept} - ${student.batchYear}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(student);
      return groups;
    }, {});
  };

  const groupedStudents = groupByDeptAndBatchYear(students);

  return (
    <div className="student-container">
      <Navbar />
      <h2>Student Details</h2>

      {loading && <p>Loading students...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="student-list">
        {Object.keys(groupedStudents).length === 0 && !loading && <p>No student records available.</p>}

        {Object.keys(groupedStudents).map((key) => (
          <div key={key} className="dept-batch-group">
            <h3>{key}</h3>
            <table>
              <thead>
                <tr>
                  <th>Register Number</th>
                  <th>Name</th>
                  <th>Current Semester</th>
                  <th>Department</th>
                  <th>Batch Year</th>
                  <th>Quota</th>
                </tr>
              </thead>
              <tbody>
                {groupedStudents[key]
                  .sort((a, b) => a.registerNumber.localeCompare(b.registerNumber))
                  .map((student) => (
                    <tr key={student._id}>
                      <td>{student.registerNumber}</td>
                      <td>{student.name}</td>
                      <td>{student.currentSemester}</td>
                      <td>{student.dept}</td>
                      <td>{student.batchYear}</td>
                      <td>{student.quota}</td>
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

export default StudentView;
