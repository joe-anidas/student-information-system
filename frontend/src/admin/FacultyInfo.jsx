import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/FacultyInfo.css";
import Navbar from "./Navbar";

function FacultyInfo() {
  const [faculty, setFaculty] = useState([]);
  const [staffId, setStaffId] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [course, setCourse] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/faculty`);
      setFaculty(response.data);
    } catch (error) {
      console.error("Error fetching faculty:", error);
    }
  };

  const addFaculty = async () => {
    const newFaculty = { staffId, name, department, course };
    try {
      await axios.post(`${API_BASE_URL}/faculty`, newFaculty);
      fetchFaculty();
      setStaffId("");
      setName("");
      setDepartment("");
      setCourse("");
    } catch (error) {
      console.error("Error adding faculty:", error);
    }
  };

  const deleteFaculty = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/faculty/${id}`);
      fetchFaculty();
    } catch (error) {
      console.error("Error deleting faculty:", error);
    }
  };

  const groupByDepartment = (faculty) => {
    return faculty.reduce((groups, member) => {
      const key = `${member.department}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(member);
      return groups;
    }, {});
  };

  const groupedFaculty = groupByDepartment(faculty);

  return (
    <div className="faculty-container">
      <Navbar />
      <br /><br /><br />
      <h2>Faculty Information</h2>
      <div className="faculty-form">
        <input type="text" placeholder="Staff ID" value={staffId} onChange={(e) => setStaffId(e.target.value)} />
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
        <input type="text" placeholder="Course" value={course} onChange={(e) => setCourse(e.target.value)} />
        <button onClick={addFaculty}>Add Faculty</button>
      </div>
      <div className="faculty-list">
        {Object.keys(groupedFaculty).map((key) => (
          <div key={key} className="department-group">
            <h3>{key}</h3>
            <table>
              <thead>
                <tr>
                  <th>Staff ID</th>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupedFaculty[key].sort((a, b) => a.staffId.localeCompare(b.staffId)).map((member) => (
                  <tr key={member._id}>
                    <td>{member.staffId}</td>
                    <td>{member.name}</td>
                    <td>{member.course}</td>
                    <td>
                      <button onClick={() => deleteFaculty(member._id)}>Delete</button>
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
