import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/CourseDetails.css";
import Navbar from "./Navbar";

function CourseDetails() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [course, setCourse] = useState("");
  const [credits, setCredits] = useState("");
  const [department, setDepartment] = useState("");

  // Use import.meta.env for environment variables in Vite
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/courses`);
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const addCourse = async () => {
    const newCourse = { courseId, course, credits: Number(credits), department };
    try {
      await axios.post(`${API_BASE_URL}/courses`, newCourse);
      fetchCourses();
      setCourseId("");
      setCourse("");
      setCredits("");
      setDepartment("");
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  const deleteCourse = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/courses/${id}`);
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const groupByDepartment = (courses) => {
    return courses.reduce((groups, course) => {
      const dept = course.department;
      if (!groups[dept]) {
        groups[dept] = [];
      }
      groups[dept].push(course);
      return groups;
    }, {});
  };

  const groupedCourses = groupByDepartment(courses);

  return (
    <div className="course-container">
      <Navbar />
      <h2>Course Details</h2>
      <div className="course-form">
        <input type="text" placeholder="Course ID" value={courseId} onChange={(e) => setCourseId(e.target.value)} />
        <input type="text" placeholder="Course" value={course} onChange={(e) => setCourse(e.target.value)} />
        <input type="number" placeholder="Credits" value={credits} onChange={(e) => setCredits(e.target.value)} />
        <input type="text" placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
        <button onClick={addCourse}>Add Course</button>
      </div>
      <div className="course-list">
        {Object.keys(groupedCourses).map((dept) => (
          <div key={dept} className="department-group">
            <h3>{dept}</h3>
            <table>
              <thead>
                <tr>
                  <th>Course ID</th>
                  <th>Course</th>
                  <th>Credits</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupedCourses[dept]
                  .sort((a, b) => a.courseId.localeCompare(b.courseId))
                  .map((course) => (
                    <tr key={course._id}>
                      <td>{course.courseId}</td>
                      <td>{course.course}</td>
                      <td>{course.credits}</td>
                      <td>
                        <button onClick={() => deleteCourse(course._id)}>Delete</button>
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

export default CourseDetails;