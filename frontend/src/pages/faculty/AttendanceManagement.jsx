import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { dataAPI } from '../../lib/api';

function AttendanceManagement() {
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState({});
  const [filters, setFilters] = useState({
    userType: 'student',
    department: 'Computer Science Engineering',
    year: '1',
    date: new Date().toISOString().split('T')[0]
  });
  const timeSlots = [
    { id: 'morning_8', label: 'Morning 8:00 AM', time: '08:00' },
    { id: 'morning_10', label: 'Morning 10:00 AM', time: '10:00' },
    { id: 'afternoon_1', label: 'Afternoon 1:30 PM', time: '13:30' }
  ];

  useEffect(() => {
    fetchAllStudents();
    fetchFaculty();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, allStudents]);

  useEffect(() => {
    if (students.length > 0) {
      fetchAttendance();
    }
  }, [students, filters.date]);

  const fetchAllStudents = async () => {
    try {
      const data = await dataAPI.getUsers({ role: 'student' });
      setAllStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFaculty = async () => {
    try {
      const data = await dataAPI.getUsers({ role: 'faculty' });
      setFaculty(data);
    } catch (error) {
      console.error('Error fetching faculty:', error);
    }
  };

  const applyFilters = () => {
    if (filters.userType === 'student') {
      let filtered = allStudents.filter(s => 
        s.department === filters.department && 
        s.year?.toString() === filters.year
      );
      setStudents(filtered);
    } else {
      let filtered = faculty.filter(f => f.department === filters.department);
      setStudents(filtered);
    }
  };

  const fetchAttendance = async () => {
    try {
      const data = await dataAPI.getAttendance({
        date: filters.date
      });
      
      // Convert attendance array to nested object for easier lookup
      const attendanceMap = {};
      data.forEach(record => {
        if (!attendanceMap[record.studentId._id]) {
          attendanceMap[record.studentId._id] = {};
        }
        attendanceMap[record.studentId._id][record.timeSlot] = record.status;
      });
      setAttendanceData(attendanceMap);
      setAttendance(data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const handleAttendanceChange = (studentId, timeSlot, status) => {
    setAttendanceData({
      ...attendanceData,
      [studentId]: {
        ...attendanceData[studentId],
        [timeSlot]: status
      }
    });
  };

  const saveAttendance = async () => {
    try {
      const promises = [];
      
      students.forEach(student => {
        timeSlots.forEach(timeSlot => {
          const status = attendanceData[student._id]?.[timeSlot.id] || 'Absent';
          const existingRecord = attendance.find(a => 
            a.studentId._id === student._id && a.timeSlot === timeSlot.id
          );
          
          if (existingRecord) {
            if (existingRecord.status !== status) {
              promises.push(dataAPI.updateAttendance(existingRecord._id, { status }));
            }
          } else {
            promises.push(dataAPI.createAttendance({
              studentId: student._id,
              date: filters.date,
              timeSlot: timeSlot.id,
              status
            }));
          }
        });
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
    const total = students.length * timeSlots.length;
    let present = 0, absent = 0, late = 0;
    
    students.forEach(student => {
      timeSlots.forEach(timeSlot => {
        const status = attendanceData[student._id]?.[timeSlot.id] || 'Absent';
        if (status === 'Present') present++;
        else if (status === 'Late') late++;
        else absent++;
      });
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
            <h1 className="text-3xl font-bold text-gray-900">Daily Attendance Management</h1>
            <p className="text-gray-600">Mark attendance for three daily time slots: 8:00 AM, 10:00 AM, and 1:30 PM</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={filters.userType}
                onChange={(e) => setFilters({...filters, userType: e.target.value})}
                className="p-2 border rounded-lg"
              >
                <option value="student">Students</option>
                <option value="faculty">Faculty</option>
              </select>
              
              <select
                value={filters.department}
                onChange={(e) => setFilters({...filters, department: e.target.value})}
                className="p-2 border rounded-lg"
              >
                <option value="Computer Science Engineering">CSE</option>
                <option value="Information Technology">IT</option>
                <option value="Electronics and Communication Engineering">ECE</option>
                <option value="Electrical and Electronics Engineering">EEE</option>
                <option value="Mechanical Engineering">MECH</option>
                <option value="Artificial Intelligence and Data Science">AIDS</option>
              </select>
              
              {filters.userType === 'student' && (
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
              )}
              
              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({...filters, date: e.target.value})}
                className="p-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <button
              onClick={saveAttendance}
              disabled={students.length === 0}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
            >
              Save Attendance for {filters.date}
            </button>
          </div>

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
          {students.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    {timeSlots.map(slot => (
                      <th key={slot.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        {slot.label}
                      </th>
                    ))}
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
                        {filters.userType === 'student' ? (student.rollNumber || student.studentId) : (student.facultyId || '-')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.department}
                      </td>
                      {timeSlots.map(slot => (
                        <td key={slot.id} className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-1 justify-center">
                            {['Present', 'Absent', 'Late'].map((status) => (
                              <label key={status} className="flex items-center">
                                <input
                                  type="radio"
                                  name={`attendance-${student._id}-${slot.id}`}
                                  value={status}
                                  checked={attendanceData[student._id]?.[slot.id] === status}
                                  onChange={(e) => handleAttendanceChange(student._id, slot.id, e.target.value)}
                                  className="mr-1"
                                />
                                <span className={`text-xs ${
                                  status === 'Present' ? 'text-green-600' :
                                  status === 'Absent' ? 'text-red-600' :
                                  'text-yellow-600'
                                }`}>
                                  {status[0]}
                                </span>
                              </label>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">👥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-600">No students found for the selected filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttendanceManagement;