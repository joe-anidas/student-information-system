import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { dataAPI } from '../../lib/api';

function ScoreManagement() {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    department: 'Computer Science Engineering',
    year: '1',
    faculty: '',
    subject: '',
    testType: 'Internal1'
  });
  const [formData, setFormData] = useState({
    studentId: '',
    marks: '',
    examDate: new Date().toISOString().split('T')[0],
    remarks: ''
  });

  const testTypes = [
    { id: 'Internal1', label: 'Internal 1', maxMarks: 20 },
    { id: 'Internal2', label: 'Internal 2', maxMarks: 20 },
    { id: 'SemExam', label: 'Semester Exam', maxMarks: 60 }
  ];

  useEffect(() => {
    fetchSubjects();
    fetchAllStudents();
    fetchFaculty();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, allStudents]);

  useEffect(() => {
    if (filters.subject) {
      fetchScores();
    }
  }, [filters.subject, filters.testType]);

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

  const fetchAllStudents = async () => {
    try {
      const data = await dataAPI.getUsers({ role: 'student' });
      setAllStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
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
    let filtered = allStudents.filter(s => 
      s.department === filters.department && 
      s.year?.toString() === filters.year
    );
    setStudents(filtered);
  };

  const fetchScores = async () => {
    try {
      const data = await dataAPI.getScores({
        subjectId: filters.subject,
        testType: filters.testType
      });
      setScores(data);
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const testType = testTypes.find(t => t.id === filters.testType);
    try {
      await dataAPI.createScore({
        ...formData,
        subjectId: filters.subject,
        testType: filters.testType,
        maxMarks: testType.maxMarks
      });
      fetchScores();
      resetForm();
      alert('Score added successfully!');
    } catch (error) {
      console.error('Error adding score:', error);
      alert('Error adding score. Please try again.');
    }
  };

  const handleDelete = async (scoreId) => {
    if (window.confirm('Are you sure you want to delete this score?')) {
      try {
        await dataAPI.deleteScore(scoreId);
        fetchScores();
      } catch (error) {
        console.error('Error deleting score:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      marks: '',
      examDate: new Date().toISOString().split('T')[0],
      remarks: ''
    });
    setShowForm(false);
  };

  const calculateFinalScore = (studentId) => {
    const internal1 = scores.find(s => s.studentId._id === studentId && s.testType === 'Internal1');
    const internal2 = scores.find(s => s.studentId._id === studentId && s.testType === 'Internal2');
    const semExam = scores.find(s => s.studentId._id === studentId && s.testType === 'SemExam');
    
    const i1 = internal1 ? internal1.marks : 0;
    const i2 = internal2 ? internal2.marks : 0;
    const sem = semExam ? semExam.marks : 0;
    
    return i1 + i2 + sem;
  };

  const getScoreStats = () => {
    if (scores.length === 0) return { average: 0, highest: 0, lowest: 0, total: 0 };
    
    const marks = scores.map(s => s.marks);
    const average = marks.reduce((a, b) => a + b, 0) / marks.length;
    const highest = Math.max(...marks);
    const lowest = Math.min(...marks);
    
    return {
      average: Math.round(average * 100) / 100,
      highest,
      lowest,
      total: scores.length
    };
  };

  const stats = getScoreStats();

  const getGradeColor = (grade) => {
    const colors = {
      'A+': 'text-green-600 bg-green-100',
      'A': 'text-green-600 bg-green-100',
      'B+': 'text-blue-600 bg-blue-100',
      'B': 'text-blue-600 bg-blue-100',
      'C+': 'text-yellow-600 bg-yellow-100',
      'C': 'text-yellow-600 bg-yellow-100',
      'D': 'text-orange-600 bg-orange-100',
      'F': 'text-red-600 bg-red-100'
    };
    return colors[grade] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Score Management</h1>
              <p className="text-gray-600">Internal 1 (20) + Internal 2 (20) + Semester Exam (60) = Final (100)</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              disabled={!filters.subject}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add Score
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                value={filters.faculty}
                onChange={(e) => setFilters({...filters, faculty: e.target.value})}
                className="p-2 border rounded-lg"
              >
                <option value="">All Faculty</option>
                {faculty.filter(f => f.department === filters.department).map((f) => (
                  <option key={f._id} value={f._id}>{f.name}</option>
                ))}
              </select>
              
              <select
                value={filters.subject}
                onChange={(e) => setFilters({...filters, subject: e.target.value})}
                className="p-2 border rounded-lg"
              >
                <option value="">Select Subject</option>
                {subjects.filter(s => 
                  s.department === filters.department && 
                  (!filters.faculty || s.facultyId._id === filters.faculty)
                ).map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </select>
              
              <select
                value={filters.testType}
                onChange={(e) => setFilters({...filters, testType: e.target.value})}
                className="p-2 border rounded-lg"
              >
                {testTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label} ({type.maxMarks})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stats */}
          {filters.subject && scores.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Scores</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl font-bold text-blue-600">{stats.average}</div>
                <div className="text-sm text-gray-600">Average</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl font-bold text-green-600">{stats.highest}</div>
                <div className="text-sm text-gray-600">Highest</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl font-bold text-red-600">{stats.lowest}</div>
                <div className="text-sm text-gray-600">Lowest</div>
              </div>
            </div>
          )}

          {/* Score Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Add Score</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <select
                    value={formData.studentId}
                    onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map((student) => (
                      <option key={student._id} value={student._id}>
                        {student.name} ({student.rollNumber || student.studentId})
                      </option>
                    ))}
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Marks"
                      value={formData.marks}
                      onChange={(e) => setFormData({...formData, marks: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                      min="0"
                      required
                    />
                    <input
                      type="text"
                      value={`Max: ${testTypes.find(t => t.id === filters.testType)?.maxMarks || 0}`}
                      className="w-full p-2 border rounded-lg bg-gray-100"
                      disabled
                    />
                  </div>
                  <input
                    type="date"
                    value={formData.examDate}
                    onChange={(e) => setFormData({...formData, examDate: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                  <textarea
                    placeholder="Remarks (optional)"
                    value={formData.remarks}
                    onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    rows="2"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                      Add Score
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Scores Table */}
          {filters.subject && scores.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {scores.map((score) => (
                    <tr key={score._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {score.studentId?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {score.studentId?.rollNumber || score.studentId?.studentId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {score.marks}/{testTypes.find(t => t.id === filters.testType)?.maxMarks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {score.percentage.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getGradeColor(score.grade)}`}>
                          {score.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(score.examDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDelete(score._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : filters.subject ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No scores found</h3>
              <p className="text-gray-600 mb-4">No scores found for {testTypes.find(t => t.id === filters.testType)?.label}</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Add First Score
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select filters</h3>
              <p className="text-gray-600">Choose department, year, and subject to start managing scores</p>
            </div>
          )}

          {/* Final Scores Summary */}
          {filters.subject && students.length > 0 && (
            <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
              <div className="px-6 py-4 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">Final Scores Summary</h3>
              </div>
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Internal 1 (20)</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Internal 2 (20)</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Sem Exam (60)</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Final (100)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => {
                    const finalScore = calculateFinalScore(student._id);
                    return (
                      <tr key={student._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.rollNumber || student.studentId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                          {scores.find(s => s.studentId._id === student._id && s.testType === 'Internal1')?.marks || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                          {scores.find(s => s.studentId._id === student._id && s.testType === 'Internal2')?.marks || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                          {scores.find(s => s.studentId._id === student._id && s.testType === 'SemExam')?.marks || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`text-sm font-bold ${
                            finalScore >= 90 ? 'text-green-600' :
                            finalScore >= 75 ? 'text-blue-600' :
                            finalScore >= 60 ? 'text-yellow-600' :
                            finalScore >= 40 ? 'text-orange-600' :
                            'text-red-600'
                          }`}>
                            {finalScore}
                          </span>
                        </td>
                      </tr>
                    )}
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ScoreManagement;