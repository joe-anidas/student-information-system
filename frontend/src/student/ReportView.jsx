import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/ReportInfo.css';
import Navbar from './Navbar';

function ReportView() {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/marks`);
      setMarks(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching marks:', error);
      setError('Failed to load marks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const groupByDept = (marks) => {
    return marks.reduce((groups, mark) => {
      const key = mark.dept;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(mark);
      return groups;
    }, {});
  };

  const groupedMarks = groupByDept(marks);

  return (
    <div className="report-container">
      <Navbar />
      <h2>Report</h2>

      {loading && <p>Loading marks...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="marks-list">
        {Object.keys(groupedMarks).length === 0 && !loading && <p>No marks available.</p>}

        {Object.keys(groupedMarks).map((key) => (
          <div key={key} className="dept-group">
            <h3>{key} Department</h3>
            <table>
              <thead>
                <tr>
                  <th>Register Number</th>
                  <th>Course</th>
                  <th>Internal Marks</th>
                  <th>Semester Marks</th>
                  <th>Total Marks</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {groupedMarks[key].map((mark) => (
                  <tr key={mark._id}>
                    <td>{mark.registerNumber}</td>
                    <td>{mark.course}</td>
                    <td>{mark.internalMarks}</td>
                    <td>{mark.semesterMarks}</td>
                    <td>{mark.totalMarks}</td>
                    <td>{mark.grade}</td>
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

export default ReportView;
