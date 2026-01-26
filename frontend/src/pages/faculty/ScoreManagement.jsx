import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { dataAPI, getUser } from '../../lib/api';

function ScoreManagement() {
  const user = getUser();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [students, setStudents] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingScores, setEditingScores] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsAndScores = async (subjectId) => {
    try {
      setLoading(true);
      const subject = subjects.find(s => s._id === subjectId);
      const semesterNumber = subject.semester;
      const year = Math.ceil(semesterNumber / 2);

      const [studentsData, scoresData] = await Promise.all([
        dataAPI.getUsers({ role: 'student' }),
        dataAPI.getScores({ subjectId })
      ]);

      const filteredStudents = studentsData.filter(s => 
        s.department === user?.department && 
        s.year === year
      );

      setStudents(filteredStudents);
      setScores(scoresData);
      
      // Initialize editing scores
      const initialScores = {};
      filteredStudents.forEach(student => {
        const internal1 = scoresData.find(s => s.studentId._id === student._id && s.testType === 'Test1');
        const internal2 = scoresData.find(s => s.studentId._id === student._id && s.testType === 'Test2');
        const finalExam = scoresData.find(s => s.studentId._id === student._id && s.testType === 'Final');
        
        initialScores[student._id] = {
          internal1: internal1 ? internal1.marks : '',
          internal2: internal2 ? internal2.marks : '',
          final: finalExam ? finalExam.marks : '',
          internal1Id: internal1?._id,
          internal2Id: internal2?._id,
          finalId: finalExam?._id
        };
      });
      setEditingScores(initialScores);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (studentId, testType, value) => {
    setEditingScores(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [testType]: value
      }
    }));
  };

  const saveScore = async (studentId, testType, marks, maxMarks, scoreId) => {
    try {
      if (marks === '' || marks === null) {
        if (scoreId) {
          await dataAPI.deleteScore(scoreId);
        }
        return;
      }

      const scoreData = {
        studentId,
        subjectId: selectedSubject._id,
        testType: testType === 'internal1' ? 'Test1' : testType === 'internal2' ? 'Test2' : 'Final',
        marks: parseInt(marks),
        maxMarks,
        examDate: new Date().toISOString()
      };

      if (scoreId) {
        await dataAPI.updateScore(scoreId, scoreData);
      } else {
        await dataAPI.createScore(scoreData);
      }
    } catch (error) {
      console.error('Error saving score:', error);
      throw error;
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const promises = [];
      
      Object.keys(editingScores).forEach(studentId => {
        const studentScores = editingScores[studentId];
        
        promises.push(
          saveScore(studentId, 'internal1', studentScores.internal1, 20, studentScores.internal1Id),
          saveScore(studentId, 'internal2', studentScores.internal2, 20, studentScores.internal2Id),
          saveScore(studentId, 'final', studentScores.final, 60, studentScores.finalId)
        );
      });

      await Promise.all(promises);
      alert('All scores saved successfully!');
      fetchStudentsAndScores(selectedSubject._id);
    } catch (error) {
      console.error('Error saving scores:', error);
      alert('Error saving scores. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const calculateTotal = (studentId) => {
    const scores = editingScores[studentId];
    if (!scores) return 0;
    
    const i1 = parseInt(scores.internal1) || 0;
    const i2 = parseInt(scores.internal2) || 0;
    const f = parseInt(scores.final) || 0;
    
    return i1 + i2 + f;
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

  if (loading && !selectedSubject) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 p-8">
          <div className="max-w-7xl mx-auto text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">⏳</div>
            <p className="text-gray-600">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedSubject) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Score Management</h1>
              <p className="text-gray-600">{user?.department} - Select a course to manage scores</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <div
                  key={subject._id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer group hover:-translate-y-1 border border-gray-100"
                  onClick={() => {
                    setSelectedSubject(subject);
                    fetchStudentsAndScores(subject._id);
                  }}
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-lg mb-4 group-hover:bg-purple-200 transition-colors">
                    <span className="text-3xl">📚</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{subject.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">Code: {subject.code}</p>
                  <p className="text-gray-600 text-sm mb-2">Semester: {subject.semester}</p>
                  <p className="text-gray-600 text-sm">Credits: {subject.credits}</p>
                </div>
              ))}
            </div>

            {subjects.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📚</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses assigned</h3>
                <p className="text-gray-600">You don't have any courses assigned yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => {
                setSelectedSubject(null);
                setStudents([]);
                setScores([]);
                setEditingScores({});
              }}
              className="mb-4 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              ← Back to Courses
            </button>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedSubject.name}</h1>
                  <p className="text-gray-600">Code: {selectedSubject.code} | Semester: {selectedSubject.semester} | Credits: {selectedSubject.credits}</p>
                </div>
                <button
                  onClick={handleSaveAll}
                  disabled={saving}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save All Scores'}
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">⏳</div>
              <p className="text-gray-600">Loading students...</p>
            </div>
          ) : students.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50">Student</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Internal 1<br/>(20)</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Internal 2<br/>(20)</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Final Exam<br/>(60)</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total<br/>(100)</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Grade</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => {
                    const total = calculateTotal(student._id);
                    const grade = getGrade(total);
                    return (
                      <tr key={student._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.rollNumber || student.studentId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            value={editingScores[student._id]?.internal1 || ''}
                            onChange={(e) => handleScoreChange(student._id, 'internal1', e.target.value)}
                            className="w-20 p-2 border rounded text-center focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            value={editingScores[student._id]?.internal2 || ''}
                            onChange={(e) => handleScoreChange(student._id, 'internal2', e.target.value)}
                            className="w-20 p-2 border rounded text-center focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <input
                            type="number"
                            min="0"
                            max="60"
                            value={editingScores[student._id]?.final || ''}
                            onChange={(e) => handleScoreChange(student._id, 'final', e.target.value)}
                            className="w-20 p-2 border rounded text-center focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-lg font-bold text-gray-900">{total}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getGradeColor(total)}`}>
                            {grade}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">👥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-600">No students enrolled for this course</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ScoreManagement;
