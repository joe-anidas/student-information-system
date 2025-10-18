import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { dataAPI } from '../../lib/api';

function AttendanceManagement() {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState({});

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchStudents();
      fetchAttendance();
    }
  }, [selectedSubject, selectedDate]);

  const fetchSubjects = async () => {
    try {
      const data = await dataAPI.getSubjects();
      setSubjects(data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await dataAPI.getUsers({ role: 'student' });
      // Filter students by department of selected subject
      const subject = subjects.find(s => s._id === selectedSubject);
      if (subject) {
        const filteredStudents = data.filter(s => s.department === subject.department);
        setStudents(filteredStudents);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const data = await dataAPI.getAttendance({
        subjectId: selectedSubject,
        date: selectedDate
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
    try {
      const promises = students.map(async (student) => {
        const status = attendanceData[student._id] || 'Absent';
        const existingRecord = attendance.find(a => a.studentId._id === student._id);
        
        if (existingRecord) {
          // Update existing record
          if (existingRecord.status !== status) {
            await dataAPI.updateAttendance(existingRecord._id, { status });
          }
        } else {
          // Create new record
          await dataAPI.createAttendance({
            studentId: student._id,
            subjectId: selectedSubject,
            date: selectedDate,
            status
          });
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
    const present = Object.values(attendanceData).filter(status => status === 'Present').length;
    const absent = Object.values(attendanceData).filter(status => status === 'Absent').length;
    const late = Object.values(attendanceData).filter(status => status === 'Late').length;
    
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
            <p className="text-gray-600">Mark and manage student attendance</p>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name} ({subject.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={saveAttendance}
                  disabled={!selectedSubject || students.length === 0}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Save Attendance
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          {selectedSubject && students.length > 0 && (
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
          {selectedSubject && students.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendance</th>
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
                        {student.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          {['Present', 'Absent', 'Late'].map((status) => (
                            <label key={status} className="flex items-center">
                              <input
                                type="radio"
                                name={`attendance-${student._id}`}
                                value={status}
                                checked={attendanceData[student._id] === status}
                                onChange={(e) => handleAttendanceChange(student._id, e.target.value)}
                                className="mr-1"
                              />
                              <span className={`text-sm ${
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
          ) : selectedSubject ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">👥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-600">No students found for the selected subject's department</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a subject</h3>
              <p className="text-gray-600">Choose a subject to start marking attendance</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttendanceManagement;