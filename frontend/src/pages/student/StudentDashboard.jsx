import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { dataAPI, getUser } from '../../lib/api';

function Student() {
  const navigate = useNavigate();
  const user = getUser();
  const [subjects, setSubjects] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    year: user?.year || 1,
    semester: 1
  });

  useEffect(() => {
    fetchSubjects();
  }, [filters]);

  useEffect(() => {
    if (subjects.length > 0) {
      fetchScores();
    }
  }, [subjects]);

  const fetchSubjects = async () => {
    try {
      const data = await dataAPI.getSubjects();
      const semesterNumber = (filters.year - 1) * 2 + filters.semester;
      const filteredSubjects = data.filter(s => 
        s.department === user?.department && 
        s.semester === semesterNumber
      );
      setSubjects(filteredSubjects);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchScores = async () => {
    try {
      const data = await dataAPI.getScores({
        studentId: user?._id
      });
      setScores(data);
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  };

  const getSubjectScores = (subjectId) => {
    const subjectScores = scores.filter(s => s.subjectId._id === subjectId);
    const internal1 = subjectScores.find(s => s.testType === 'Test1');
    const internal2 = subjectScores.find(s => s.testType === 'Test2');
    const finalExam = subjectScores.find(s => s.testType === 'Final');
    
    const i1Marks = internal1 ? internal1.marks : 0;
    const i2Marks = internal2 ? internal2.marks : 0;
    const finalMarks = finalExam ? finalExam.marks : 0;
    const total = i1Marks + i2Marks + finalMarks;
    
    return {
      internal1: i1Marks,
      internal2: i2Marks,
      final: finalMarks,
      total,
      hasScores: subjectScores.length > 0
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome, {user?.name}</h1>
              <p className="text-gray-600 text-lg">{user?.department} - Year {user?.year}</p>
              <p className="text-gray-500 text-sm">Roll Number: {user?.rollNumber}</p>
            </div>
            <button
              onClick={() => window.location.href = '/student/attendance'}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105"
            >
              <span className="text-xl">📋</span>
              View Attendance
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <select
                  value={filters.year}
                  onChange={(e) => setFilters({...filters, year: parseInt(e.target.value)})}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                <select
                  value={filters.semester}
                  onChange={(e) => setFilters({...filters, semester: parseInt(e.target.value)})}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                </select>
              </div>

              <div className="flex items-end">
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Viewing:</p>
                  <p>Year {filters.year}, Semester {filters.semester}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Course Cards */}
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">⏳</div>
              <p className="text-gray-600">Loading courses...</p>
            </div>
          ) : subjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => {
                const subjectScores = getSubjectScores(subject._id);
                return (
                  <div 
                    key={subject._id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer group hover:-translate-y-1 border border-gray-100"
                    onClick={() => navigate(`/student/course/${subject._id}`)}
                  >
                    <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-lg mb-4 group-hover:bg-purple-200 transition-colors">
                      <span className="text-3xl">📚</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{subject.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">Code: {subject.code}</p>
                    <p className="text-gray-600 text-sm mb-3">Faculty: {subject.facultyId?.name}</p>
                    <p className="text-gray-600 text-sm mb-3">Credits: {subject.credits}</p>
                    
                    {subjectScores.hasScores ? (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Total Score:</span>
                          <span className={`text-2xl font-bold ${getGradeColor(subjectScores.total)}`}>
                            {subjectScores.total}/100
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-gray-600">Grade:</span>
                          <span className={`text-lg font-bold ${getGradeColor(subjectScores.total)}`}>
                            {getGrade(subjectScores.total)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-500 italic">No scores available yet</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📚</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600">No courses available for Year {filters.year}, Semester {filters.semester}</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default Student;