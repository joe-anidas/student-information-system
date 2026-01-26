import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { dataAPI } from '../../lib/api';

function StudentProfile() {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [scores, setScores] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      fetchStudentData();
    }
  }, [studentId]);

  const fetchStudentData = async () => {
    try {
      const [usersData, subjectsData, scoresData, attendanceData] = await Promise.all([
        dataAPI.getUsers({ role: 'student' }),
        dataAPI.getSubjects(),
        dataAPI.getScores({ studentId }),
        dataAPI.getAttendance({ studentId })
      ]);

      const foundStudent = usersData.find(u => u._id === studentId);
      setStudent(foundStudent);

      // Get subjects for student's department and year
      if (foundStudent) {
        const semesterNumber = (foundStudent.year - 1) * 2 + 1; // Current semester
        const studentSubjects = subjectsData.filter(s => 
          s.department === foundStudent.department &&
          (s.semester === semesterNumber || s.semester === semesterNumber + 1)
        );
        setSubjects(studentSubjects);
      }

      setScores(scoresData);
      setAttendance(attendanceData);
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSubjectScores = (subjectId) => {
    const subjectScores = scores.filter(s => s.subjectId._id === subjectId);
    const internal1 = subjectScores.find(s => s.testType === 'Test1');
    const internal2 = subjectScores.find(s => s.testType === 'Test2');
    const finalExam = subjectScores.find(s => s.testType === 'Final');
    
    const i1 = internal1 ? internal1.marks : 0;
    const i2 = internal2 ? internal2.marks : 0;
    const f = finalExam ? finalExam.marks : 0;
    
    return { internal1: i1, internal2: i2, final: f, total: i1 + i2 + f };
  };

  const getSubjectAttendance = (subjectId) => {
    const subjectAttendance = attendance.filter(a => a.subjectId._id === subjectId);
    const total = subjectAttendance.length;
    const present = subjectAttendance.filter(a => a.status === 'Present').length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return { total, present, percentage };
  };

  const getOverallAttendance = () => {
    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'Present').length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return { total, present, percentage };
  };

  const getGradeColor = (total) => {
    if (total >= 90) return 'text-green-600 bg-green-100';
    if (total >= 75) return 'text-blue-600 bg-blue-100';
    if (total >= 60) return 'text-yellow-600 bg-yellow-100';
    if (total >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getGrade = (total) => {
    if (total >= 90) return 'A+';
    if (total >= 80) return 'A';
    if (total >= 70) return 'B+';
    if (total >= 60) return 'B';
    if (total >= 50) return 'C+';
    if (total >= 40) return 'C';
    if (total >= 30) return 'D';
    return 'F';
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 75) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 p-8">
          <div className="max-w-7xl mx-auto text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">⏳</div>
            <p className="text-gray-600">Loading student profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 p-8">
          <div className="max-w-7xl mx-auto text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">❌</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Student not found</h3>
            <button
              onClick={() => navigate('/admin/student-management')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Back to Student Management
            </button>
          </div>
        </div>
      </div>
    );
  }

  const overallAttendance = getOverallAttendance();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => navigate('/admin/student-management')}
              className="mb-4 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              ← Back to Student Management
            </button>
          </div>

          {/* Student Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-2xl p-8 mb-8 text-white">
            <div className="flex items-start gap-6">
              <div className="flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur rounded-full flex-shrink-0">
                <span className="text-5xl">👨‍🎓</span>
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{student.name}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm opacity-90">
                  <p>Roll Number: {student.rollNumber || student.studentId}</p>
                  <p>Email: {student.email}</p>
                  <p>Department: {student.department}</p>
                  <p>Year: {student.year}</p>
                  <p>Student ID: {student.studentId}</p>
                  <p>Status: {student.isActive ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Attendance</h3>
              <div className={`text-4xl font-bold mb-2 ${getAttendanceColor(overallAttendance.percentage)}`}>
                {overallAttendance.percentage}%
              </div>
              <p className="text-sm text-gray-600">
                {overallAttendance.present} / {overallAttendance.total} classes
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrolled Subjects</h3>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {subjects.length}
              </div>
              <p className="text-sm text-gray-600">Active courses</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Scores</h3>
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {scores.length}
              </div>
              <p className="text-sm text-gray-600">Recorded assessments</p>
            </div>
          </div>

          {/* Subject-wise Performance */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Subject-wise Performance</h2>
            
            {subjects.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Internal 1<br/>(20)</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Internal 2<br/>(20)</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Final<br/>(60)</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total<br/>(100)</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Grade</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Attendance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {subjects.map((subject) => {
                      const subjectScores = getSubjectScores(subject._id);
                      const subjectAttendance = getSubjectAttendance(subject._id);
                      return (
                        <tr key={subject._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{subject.name}</div>
                            <div className="text-sm text-gray-500">{subject.code}</div>
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-900">
                            {subjectScores.internal1 || '-'}
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-900">
                            {subjectScores.internal2 || '-'}
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-900">
                            {subjectScores.final || '-'}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-lg font-bold text-gray-900">
                              {subjectScores.total}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getGradeColor(subjectScores.total)}`}>
                              {getGrade(subjectScores.total)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getAttendanceColor(subjectAttendance.percentage)}`}>
                              {subjectAttendance.percentage}%
                            </span>
                            <div className="text-xs text-gray-500 mt-1">
                              {subjectAttendance.present}/{subjectAttendance.total}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No subjects enrolled</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
