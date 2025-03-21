import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/CourseDetails.css';
import Navbar from './Navbar';

function CourseView() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
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
                </tr>
              </thead>
              <tbody>
                {groupedCourses[dept].map((course) => (
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
    </div>
  );
}

export default CourseView;