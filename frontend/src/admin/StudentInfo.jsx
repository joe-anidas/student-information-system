import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/StudentInfo.css";
import Navbar from "./Navbar";

function StudentInfo() {
  const [students, setStudents] = useState([]);
  const [registerNumber, setRegisterNumber] = useState("");
  const [name, setName] = useState("");
  const [currentSemester, setCurrentSemester] = useState("");
  const [dept, setDept] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const [quota, setQuota] = useState("");

  // Use import.meta.env for environment variables in Vite
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/students`);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const addStudent = async () => {
    const newStudent = { registerNumber, name, currentSemester, dept, batchYear, quota };
    try {
      await axios.post(`${API_BASE_URL}/students`, newStudent);
      fetchStudents();
      setRegisterNumber("");
      setName("");
      setCurrentSemester("");
      setDept("");
      setBatchYear("");
      setQuota("");
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/students/${id}`);
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const groupByDeptAndBatchYear = (students) => {
    return students.reduce((groups, student) => {
      const key = `${student.dept}-${student.batchYear}`;
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
      <div className="student-form">
        <input type="text" placeholder="Register Number" value={registerNumber} onChange={(e) => setRegisterNumber(e.target.value)} />
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Current Semester" value={currentSemester} onChange={(e) => setCurrentSemester(e.target.value)} />
        <input type="text" placeholder="Department" value={dept} onChange={(e) => setDept(e.target.value)} />
        <input type="text" placeholder="Batch Year" value={batchYear} onChange={(e) => setBatchYear(e.target.value)} />
        <input type="text" placeholder="Quota" value={quota} onChange={(e) => setQuota(e.target.value)} />
        <button onClick={addStudent}>Add Student</button>
      </div>
      <div className="student-list">
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupedStudents[key].sort((a, b) => a.registerNumber.localeCompare(b.registerNumber)).map((student) => (
                  <tr key={student._id}>
                    <td>{student.registerNumber}</td>
                    <td>{student.name}</td>
                    <td>{student.currentSemester}</td>
                    <td>{student.dept}</td>
                    <td>{student.batchYear}</td>
                    <td>{student.quota}</td>
                    <td>
                      <button onClick={() => deleteStudent(student._id)}>Delete</button>
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

export default StudentInfo;
