import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { dataAPI, getUser } from '../../lib/api';

function AttendanceManagement() {
  const user = getUser();
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState({});
  const [filters, setFilters] = useState({
    department: user?.department || 'Computer Science Engineering',
    year: '1',
    subject: '',
    date: new Date().toISOString().split('T')[0]
  });
  useEffect(() => {
    fetchAllStudents();
    fetchSubjects();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters.department, filters.year, allStudents]);

  useEffect(() => {
    if (students.length > 0 && filters.subject) {
      fetchAttendance();
    }
  }, [students, filters.date, filters.subject]);

  const fetchAllStudents = async () => {
    try {
      const data = await dataAPI.getUsers({ role: 'student' });
      const departmentStudents = data.filter(s => s.department === user?.department);
      setAllStudents(departmentStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const data = await dataAPI.getSubjects();
      // Only show subjects where this faculty is assigned
      const facultySubjects = data.filter(s => 
        s.facultyId?._id === user?._id || s.facultyId === user?._id
      );
      setSubjects(facultySubjects);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const applyFilters = () => {
    let filtered = allStudents.filter(s => 
      s.department === filters.department && 
      s.year?.toString() === filters.year
    );
    setStudents(filtered);
  };

  const fetchAttendance = async () => {
    try {
      const data = await dataAPI.getAttendance({
        subjectId: filters.subject,
        date: filters.date
      });
      
      // Convert attendance array to object for easier lookup
      const attendanceMap = {};
      data.forEach(record => {
        attendanceMap[record.studentId._id] = record.status;
      });
      setAttendanceData(attendanceMap);
      setAttendance(data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData({
      ...attendanceData,
      [studentId]: status
    });
  };

  const saveAttendance = async () => {
    if (!filters.subject) {
      alert('Please select a subject');
      return;
    }

    try {
      const promises = [];
      
      students.forEach(student => {
        const status = attendanceData[student._id] || 'Absent';
        const existingRecord = attendance.find(a => 
          a.studentId._id === student._id
        );
        
        if (existingRecord) {
          if (existingRecord.status !== status) {
            promises.push(dataAPI.updateAttendance(existingRecord._id, { status }));
          }
        } else {
          promises.push(dataAPI.createAttendance({
            studentId: student._id,
            subjectId: filters.subject,
            date: filters.date,
            status
          }));
        }
      });

      await Promise.all(promises);
      alert('Attendance saved successfully!');
      fetchAttendance();
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Error saving attendance. Please try again.');
    }
  };

  const getAttendanceStats = () => {
    const total = students.length;
    let present = 0, absent = 0, late = 0;
    
    students.forEach(student => {
      const status = attendanceData[student._id] || 'Absent';
      if (status === 'Present') present++;
      else if (status === 'Late') late++;
      else absent++;
    });
    
    return { total, present, absent, late };
  };

  const stats = getAttendanceStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
            <p className="text-gray-600">{user?.department} - Mark attendance for your department students</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={filters.year}
                onChange={(e) => setFilters({...filters, year: e.target.value})}
                className="p-2 border rounded-lg"
              >
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
              
              <select
                value={filters.subject}
                onChange={(e) => setFilters({...filters, subject: e.target.value})}
                className="p-2 border rounded-lg"
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name} ({subject.code})
                  </option>
                ))}
              </select>
              
              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({...filters, date: e.target.value})}
                className="p-2 border rounded-lg"
              />
              
              <div className="text-sm text-gray-600 flex items-center px-2">
                Department: {user?.department}
              </div>
            </div>
          </div>

          {/* Save Button */}
          {filters.subject && students.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <button
                onClick={saveAttendance}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-semibold"
              >
                Save Attendance for {filters.date}
              </button>
            </div>
          )}

          {/* Stats */}
          {students.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Students</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl font-bold text-green-600">{stats.present}</div>
                <div className="text-sm text-gray-600">Present</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
                <div className="text-sm text-gray-600">Absent</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
                <div className="text-sm text-gray-600">Late</div>
              </div>
            </div>
          )}

          {/* Attendance Table */}
          {filters.subject && students.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Attendance Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.rollNumber || student.studentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Year {student.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-4 justify-center">
                          {['Present', 'Absent', 'Late'].map((status) => (
                            <label key={status} className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name={`attendance-${student._id}`}
                                value={status}
                                checked={attendanceData[student._id] === status}
                                onChange={(e) => handleAttendanceChange(student._id, e.target.value)}
                                className="mr-2"
                              />
                              <span className={`text-sm font-medium ${
                                status === 'Present' ? 'text-green-600' :
                                status === 'Absent' ? 'text-red-600' :
                                'text-yellow-600'
                              }`}>
                                {status}
                              </span>
                            </label>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : filters.subject ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">👥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-600">No students found for the selected year</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a subject</h3>
              <p className="text-gray-600">Please select a subject to mark attendance</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttendanceManagement;