import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/CourseDetails.css';
import Navbar from './Navbar';

function CourseView() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/courses`);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const groupedCourses = courses.reduce((groups, course) => {
    if (!groups[course.department]) {
      groups[course.department] = [];
    }
    groups[course.department].push(course);
    return groups;
  }, {});

  return (
    <div className="course-container">
      <Navbar />
      <h2>Course Details</h2>
      {loading ? (
        <p>Loading courses...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="course-list">
          {Object.entries(groupedCourses).map(([dept, courses]) => (
            <div key={dept} className="department-group">
              <h3>{dept}</h3>
              <table>
                <thead>
                  <tr>
                    <th>Course ID</th>
                    <th>Course</th>
                    <th>Credits</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course._id}>
                      <td>{course.courseId}</td>
                      <td>{course.course}</td>
                      <td>{course.credits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CourseView;