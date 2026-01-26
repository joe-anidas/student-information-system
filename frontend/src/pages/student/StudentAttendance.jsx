import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { dataAPI, getUser } from '../../lib/api';

function StudentAttendance() {
  const navigate = useNavigate();
  const user = getUser();
  const [subjects, setSubjects] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState('current');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [subjectsData, attendanceData] = await Promise.all([
        dataAPI.getSubjects(),
        dataAPI.getAttendance({ studentId: user?._id })
      ]);
      
      setSubjects(subjectsData.filter(s => s.department === user?.department));
      setAttendance(attendanceData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSemesterSubjects = (year, semester) => {
    const semesterNumber = (year - 1) * 2 + semester;
    return subjects.filter(s => s.semester === semesterNumber);
  };

  const getSubjectAttendance = (subjectId) => {
    const subjectAttendance = attendance.filter(a => a.subjectId._id === subjectId);
    const totalClasses = subjectAttendance.length;
    const presentClasses = subjectAttendance.filter(a => a.status === 'Present').length;
    const absentClasses = subjectAttendance.filter(a => a.status === 'Absent').length;
    const lateClasses = subjectAttendance.filter(a => a.status === 'Late').length;
    const percentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;
    
    return {
      total: totalClasses,
      present: presentClasses,
      absent: absentClasses,
      late: lateClasses,
      percentage
    };
  };

  const getSemesterAttendance = (year, semester) => {
    const semesterSubjects = getSemesterSubjects(year, semester);
    let totalClasses = 0;
    let presentClasses = 0;
    
    semesterSubjects.forEach(subject => {
      const subjectAtt = getSubjectAttendance(subject._id);
      totalClasses += subjectAtt.total;
      presentClasses += subjectAtt.present;
    });
    
    const percentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;
    
    return {
      total: totalClasses,
      present: presentClasses,
      percentage,
      subjects: semesterSubjects
    };
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 75) return 'text-green-600 bg-green-100 border-green-300';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100 border-yellow-300';
    return 'text-red-600 bg-red-100 border-red-300';
  };

  const getAttendanceStatus = (percentage) => {
    if (percentage >= 75) return { text: 'Good Standing', color: 'text-green-600' };
    if (percentage >= 60) return { text: 'Warning', color: 'text-yellow-600' };
    return { text: 'Critical', color: 'text-red-600' };
  };

  const renderSemesterCard = (year, semester) => {
    const semesterData = getSemesterAttendance(year, semester);
    const status = getAttendanceStatus(semesterData.percentage);
    const isCurrent = year === user?.year && semester === ((new Date().getMonth() < 6) ? 1 : 2);
    
    return (
      <div key={`${year}-${semester}`} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Year {year} - Semester {semester}
              {isCurrent && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Current
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {semesterData.subjects.length} Subjects
            </p>
          </div>
          <div className={`px-4 py-2 rounded-lg font-bold text-2xl border-2 ${getAttendanceColor(semesterData.percentage)}`}>
            {semesterData.percentage}%
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">Total Classes</p>
            <p className="text-2xl font-bold text-gray-900">{semesterData.total}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">Present</p>
            <p className="text-2xl font-bold text-green-600">{semesterData.present}</p>
          </div>
        </div>

        <div className={`p-3 rounded-lg border-2 ${getAttendanceColor(semesterData.percentage)}`}>
          <p className={`font-semibold ${status.color}`}>
            Status: {status.text}
          </p>
        </div>

        {/* Subject-wise breakdown */}
        <div className="mt-4 space-y-2">
          <p className="text-sm font-semibold text-gray-700">Subject-wise Attendance:</p>
          {semesterData.subjects.map(subject => {
            const subjectAtt = getSubjectAttendance(subject._id);
            return (
              <div key={subject._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{subject.name}</p>
                  <p className="text-xs text-gray-600">{subject.code}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    subjectAtt.percentage >= 75 ? 'text-green-600' :
                    subjectAtt.percentage >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {subjectAtt.percentage}%
                  </p>
                  <p className="text-xs text-gray-600">
                    {subjectAtt.present}/{subjectAtt.total}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const currentYear = user?.year || 1;
  const allSemesters = [];
  for (let year = 1; year <= currentYear; year++) {
    const maxSem = year === currentYear ? ((new Date().getMonth() < 6) ? 1 : 2) : 2;
    for (let sem = 1; sem <= maxSem; sem++) {
      allSemesters.push({ year, semester: sem });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Attendance Report</h1>
              <p className="text-gray-600 text-lg">{user?.name} - {user?.rollNumber}</p>
              <p className="text-gray-500 text-sm">{user?.department} - Year {user?.year}</p>
            </div>
            <button
              onClick={() => navigate('/student')}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-semibold transition-all duration-300"
            >
              ← Back to Dashboard
            </button>
          </div>

          {/* Overall Summary */}
          {(() => {
            let totalClasses = 0;
            let totalPresent = 0;
            allSemesters.forEach(({ year, semester }) => {
              const semData = getSemesterAttendance(year, semester);
              totalClasses += semData.total;
              totalPresent += semData.present;
            });
            const overallPercentage = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;
            const status = getAttendanceStatus(overallPercentage);

            return (
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-2xl p-8 mb-8 text-white">
                <h2 className="text-2xl font-bold mb-6">Overall Attendance Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                    <p className="text-sm opacity-90">Total Classes</p>
                    <p className="text-4xl font-bold">{totalClasses}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                    <p className="text-sm opacity-90">Present</p>
                    <p className="text-4xl font-bold">{totalPresent}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                    <p className="text-sm opacity-90">Absent</p>
                    <p className="text-4xl font-bold">{totalClasses - totalPresent}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                    <p className="text-sm opacity-90">Percentage</p>
                    <p className="text-4xl font-bold">{overallPercentage}%</p>
                    <p className={`text-sm font-semibold mt-1 ${
                      overallPercentage >= 75 ? 'text-green-200' :
                      overallPercentage >= 60 ? 'text-yellow-200' :
                      'text-red-200'
                    }`}>
                      {status.text}
                    </p>
                  </div>
                </div>
                {overallPercentage < 75 && (
                  <div className="mt-6 p-4 bg-yellow-500/30 backdrop-blur rounded-lg border border-yellow-300">
                    <p className="font-semibold">⚠️ Attendance Alert</p>
                    <p className="text-sm mt-1">
                      Your overall attendance is below 75%. This may affect your exam eligibility.
                      Please improve your attendance to meet the minimum requirement.
                    </p>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Semester Cards */}
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">⏳</div>
              <p className="text-gray-600">Loading attendance data...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Semester-wise Attendance</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {allSemesters.map(({ year, semester }) => renderSemesterCard(year, semester))}
              </div>
            </div>
          )}

          {allSemesters.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No attendance data</h3>
              <p className="text-gray-600">No attendance records found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentAttendance;
