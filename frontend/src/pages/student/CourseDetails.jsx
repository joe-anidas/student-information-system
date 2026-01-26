import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { dataAPI, getUser } from '../../lib/api';

function CourseDetails() {
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const user = getUser();
  
  const [subject, setSubject] = useState(null);
  const [scores, setScores] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!subjectId) {
      console.log('No subjectId found in location.state');
      navigate('/student');
      return;
    }
    console.log('Fetching details for subjectId:', subjectId);
    fetchCourseDetails();
  }, [subjectId]);

  const fetchCourseDetails = async () => {
    try {
      const [subjectsData, scoresData, attendanceData] = await Promise.all([
        dataAPI.getSubjects(),
        dataAPI.getScores({ studentId: user?._id }),
        dataAPI.getAttendance({ studentId: user?._id })
      ]);

      console.log('All subjects:', subjectsData);
      console.log('Looking for subjectId:', subjectId);
      
      const foundSubject = subjectsData.find(s => s._id === subjectId);
      console.log('Found subject:', foundSubject);
      
      setSubject(foundSubject);
      
      const subjectScores = scoresData.filter(s => s.subjectId._id === subjectId);
      setScores(subjectScores);
      
      const subjectAttendance = attendanceData.filter(a => a.subjectId._id === subjectId);
      setAttendance(subjectAttendance);
    } catch (error) {
      console.error('Error fetching course details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreBreakdown = () => {
    const internal1 = scores.find(s => s.testType === 'Test1');
    const internal2 = scores.find(s => s.testType === 'Test2');
    const finalExam = scores.find(s => s.testType === 'Final');
    
    const i1Marks = internal1 ? internal1.marks : 0;
    const i2Marks = internal2 ? internal2.marks : 0;
    const finalMarks = finalExam ? finalExam.marks : 0;
    const total = i1Marks + i2Marks + finalMarks;
    
    return {
      internal1: { marks: i1Marks, max: 20, data: internal1 },
      internal2: { marks: i2Marks, max: 20, data: internal2 },
      final: { marks: finalMarks, max: 60, data: finalExam },
      total,
      hasScores: scores.length > 0
    };
  };

  const getAttendanceStats = () => {
    const totalClasses = attendance.length;
    const presentClasses = attendance.filter(a => a.status === 'Present').length;
    const absentClasses = attendance.filter(a => a.status === 'Absent').length;
    const lateClasses = attendance.filter(a => a.status === 'Late').length;
    const percentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;
    
    return {
      total: totalClasses,
      present: presentClasses,
      absent: absentClasses,
      late: lateClasses,
      percentage
    };
  };

  const getGradeColor = (total) => {
    if (total >= 90) return 'text-green-600';
    if (total >= 75) return 'text-blue-600';
    if (total >= 60) return 'text-yellow-600';
    if (total >= 40) return 'text-orange-600';
    return 'text-red-600';
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
    if (percentage >= 75) return 'text-green-600 bg-green-100 border-green-300';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100 border-yellow-300';
    return 'text-red-600 bg-red-100 border-red-300';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 p-8">
          <div className="max-w-7xl mx-auto text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">⏳</div>
            <p className="text-gray-600">Loading course details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 p-8">
          <div className="max-w-7xl mx-auto text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">❌</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Course not found</h3>
            <button
              onClick={() => navigate('/student')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const scoreBreakdown = getScoreBreakdown();
  const attendanceStats = getAttendanceStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/student')}
              className="mb-4 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              ← Back to Dashboard
            </button>
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-6">
                  <div className="flex items-center justify-center w-20 h-20 bg-purple-100 rounded-lg">
                    <span className="text-4xl">📚</span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{subject.name}</h1>
                    <div className="space-y-1">
                      <p className="text-gray-600">
                        <span className="font-semibold">Course Code:</span> {subject.code}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Credits:</span> {subject.credits}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Semester:</span> {subject.semester}
                      </p>
                      {subject.description && (
                        <p className="text-gray-600 mt-2">
                          <span className="font-semibold">Description:</span> {subject.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Faculty Information */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl shadow-lg p-6 border border-blue-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">👨‍🏫</span>
                Faculty Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600">Faculty Name</p>
                  <p className="text-lg font-semibold text-gray-900">{subject.facultyId?.name || 'Not Assigned'}</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600">Faculty Email</p>
                  <p className="text-lg font-semibold text-gray-900">{subject.facultyId?.email || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Attendance Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                Attendance Summary
              </h2>
              
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border-2 ${getAttendanceColor(attendanceStats.percentage)}`}>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Attendance Percentage</span>
                    <span className="text-3xl font-bold">{attendanceStats.percentage}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Total Classes</p>
                    <p className="text-2xl font-bold text-gray-900">{attendanceStats.total}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Present</p>
                    <p className="text-2xl font-bold text-green-600">{attendanceStats.present}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Absent</p>
                    <p className="text-2xl font-bold text-red-600">{attendanceStats.absent}</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Late</p>
                    <p className="text-2xl font-bold text-yellow-600">{attendanceStats.late}</p>
                  </div>
                </div>

                {attendanceStats.percentage < 75 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
                    <p className="text-sm text-yellow-800 font-medium">
                      ⚠️ Warning: Attendance below 75% may affect your exam eligibility
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Scores Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Score Breakdown
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <p className="font-medium text-gray-900">Internal 1</p>
                    <p className="text-sm text-gray-500">Max: 20 marks</p>
                    {scoreBreakdown.internal1.data && (
                      <p className="text-xs text-gray-500 mt-1">
                        Date: {new Date(scoreBreakdown.internal1.data.examDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className={`text-3xl font-bold ${scoreBreakdown.internal1.marks > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                      {scoreBreakdown.internal1.marks}/{scoreBreakdown.internal1.max}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <p className="font-medium text-gray-900">Internal 2</p>
                    <p className="text-sm text-gray-500">Max: 20 marks</p>
                    {scoreBreakdown.internal2.data && (
                      <p className="text-xs text-gray-500 mt-1">
                        Date: {new Date(scoreBreakdown.internal2.data.examDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className={`text-3xl font-bold ${scoreBreakdown.internal2.marks > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                      {scoreBreakdown.internal2.marks}/{scoreBreakdown.internal2.max}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <p className="font-medium text-gray-900">Final Exam</p>
                    <p className="text-sm text-gray-500">Max: 60 marks</p>
                    {scoreBreakdown.final.data && (
                      <p className="text-xs text-gray-500 mt-1">
                        Date: {new Date(scoreBreakdown.final.data.examDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className={`text-3xl font-bold ${scoreBreakdown.final.marks > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                      {scoreBreakdown.final.marks}/{scoreBreakdown.final.max}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-300">
                  <div>
                    <p className="font-bold text-gray-900 text-lg">Total Score</p>
                    <p className="text-sm text-gray-600">Out of 100 marks</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-4xl font-bold ${getGradeColor(scoreBreakdown.total)}`}>
                      {scoreBreakdown.total}/100
                    </p>
                    <p className={`text-2xl font-bold ${getGradeColor(scoreBreakdown.total)} mt-1`}>
                      Grade: {getGrade(scoreBreakdown.total)}
                    </p>
                  </div>
                </div>

                {!scoreBreakdown.hasScores && (
                  <div className="text-center py-6 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800 font-medium">No scores have been uploaded yet</p>
                    <p className="text-yellow-600 text-sm mt-1">Please check back later</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
