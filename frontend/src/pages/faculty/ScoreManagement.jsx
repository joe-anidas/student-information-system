import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { dataAPI } from '../../lib/api';

function ScoreManagement() {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [scores, setScores] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTestType, setSelectedTestType] = useState('Test1');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    marks: '',
    maxMarks: '100',
    examDate: new Date().toISOString().split('T')[0],
    remarks: ''
  });

  const testTypes = ['Test1', 'Test2', 'Assignment', 'Quiz', 'Project', 'Final'];

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchStudents();
      fetchScores();
    }
  }, [selectedSubject, selectedTestType]);

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
      const subject = subjects.find(s => s._id === selectedSubject);
      if (subject) {
        const filteredStudents = data.filter(s => s.department === subject.department);
        setStudents(filteredStudents);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchScores = async () => {
    try {
      const data = await dataAPI.getScores({
        subjectId: selectedSubject,
        testType: selectedTestType
      });
      setScores(data);
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dataAPI.createScore({
        ...formData,
        subjectId: selectedSubject,
        testType: selectedTestType
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
      maxMarks: '100',
      examDate: new Date().toISOString().split('T')[0],
      remarks: ''
    });
    setShowForm(false);
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
              <p className="text-gray-600">Manage test scores and academic performance</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              disabled={!selectedSubject}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add Score
            </button>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Test Type</label>
                <select
                  value={selectedTestType}
                  onChange={(e) => setSelectedTestType(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  {testTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Stats */}
          {selectedSubject && scores.length > 0 && (
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
                      type="number"
                      placeholder="Max Marks"
                      value={formData.maxMarks}
                      onChange={(e) => setFormData({...formData, maxMarks: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                      min="1"
                      required
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
          {selectedSubject && scores.length > 0 ? (
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
                        {score.marks}/{score.maxMarks}
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
          ) : selectedSubject ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No scores found</h3>
              <p className="text-gray-600 mb-4">No scores found for {selectedTestType}</p>
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a subject</h3>
              <p className="text-gray-600">Choose a subject to start managing scores</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ScoreManagement;