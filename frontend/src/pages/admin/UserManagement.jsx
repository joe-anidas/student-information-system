import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { dataAPI } from '../../lib/api';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [filters, setFilters] = useState({
    role: '',
    department: '',
    year: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: '',
    year: '',
    rollNumber: '',
    studentId: '',
    facultyId: '',
    isHOD: false,
    classAdvisorFor: {
      department: '',
      year: ''
    }
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await dataAPI.getUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = users;
    
    if (filters.role) {
      filtered = filtered.filter(user => user.role === filters.role);
    }
    
    if (filters.department) {
      filtered = filtered.filter(user => user.department === filters.department);
    }
    
    if (filters.year && filters.role === 'student') {
      filtered = filtered.filter(user => user.year?.toString() === filters.year);
    }
    
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, users]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await dataAPI.updateUser(editingUser._id, formData);
      } else {
        await dataAPI.createUser(formData);
      }
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await dataAPI.deleteUser(userId);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'student',
      department: '',
      year: '',
      rollNumber: '',
      studentId: '',
      facultyId: '',
      isHOD: false,
      classAdvisorFor: {
        department: '',
        year: ''
      }
    });
    setEditingUser(null);
    setShowForm(false);
  };

  const startEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      department: user.department,
      year: user.year || '',
      rollNumber: user.rollNumber || '',
      studentId: user.studentId || '',
      facultyId: user.facultyId || '',
      isHOD: user.isHOD || false,
      classAdvisorFor: {
        department: user.classAdvisorFor?.department || '',
        year: user.classAdvisorFor?.year || ''
      }
    });
    setEditingUser(user);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600">Manage students, faculty, and admin accounts</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add New User
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={filters.role}
                onChange={(e) => setFilters({...filters, role: e.target.value})}
                className="p-2 border rounded-lg"
              >
                <option value="">All Roles</option>
                <option value="student">Students</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
              
              <select
                value={filters.department}
                onChange={(e) => setFilters({...filters, department: e.target.value})}
                className="p-2 border rounded-lg"
                disabled={filters.role === 'admin'}
              >
                <option value="">All Departments</option>
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
                disabled={filters.role === 'faculty' || filters.role === 'admin'}
              >
                <option value="">All Years</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
              
              <button
                onClick={() => setFilters({ role: '', department: '', year: '' })}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* User Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                  {!editingUser && (
                    <input
                      type="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  )}
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Department"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                  {(formData.role === 'student' || formData.role === 'faculty') && (
                    <input
                      type="number"
                      placeholder="Year"
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                      min="1"
                      max="4"
                    />
                  )}
                  {formData.role === 'student' && (
                    <>
                      <input
                        type="text"
                        placeholder="Roll Number"
                        value={formData.rollNumber}
                        onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
                        className="w-full p-2 border rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Student ID"
                        value={formData.studentId}
                        onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                        className="w-full p-2 border rounded-lg"
                      />
                    </>
                  )}
                  {formData.role === 'faculty' && (
                    <>
                      <input
                        type="text"
                        placeholder="Faculty ID"
                        value={formData.facultyId}
                        onChange={(e) => setFormData({...formData, facultyId: e.target.value})}
                        className="w-full p-2 border rounded-lg"
                      />
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.isHOD}
                            onChange={(e) => setFormData({...formData, isHOD: e.target.checked})}
                            className="mr-2"
                          />
                          HOD
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={formData.classAdvisorFor.department}
                          onChange={(e) => setFormData({...formData, classAdvisorFor: {...formData.classAdvisorFor, department: e.target.value}})}
                          className="w-full p-2 border rounded-lg"
                        >
                          <option value="">Class Advisor Dept</option>
                          <option value="Computer Science Engineering">CSE</option>
                          <option value="Information Technology">IT</option>
                          <option value="Electronics and Communication Engineering">ECE</option>
                          <option value="Electrical and Electronics Engineering">EEE</option>
                          <option value="Mechanical Engineering">MECH</option>
                          <option value="Artificial Intelligence and Data Science">AIDS</option>
                        </select>
                        <select
                          value={formData.classAdvisorFor.year}
                          onChange={(e) => setFormData({...formData, classAdvisorFor: {...formData.classAdvisorFor, year: e.target.value}})}
                          className="w-full p-2 border rounded-lg"
                        >
                          <option value="">Class Advisor Year</option>
                          <option value="1">1st Year</option>
                          <option value="2">2nd Year</option>
                          <option value="3">3rd Year</option>
                          <option value="4">4th Year</option>
                        </select>
                      </div>
                    </>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                      {editingUser ? 'Update' : 'Create'}
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

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'faculty' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.role === 'faculty' ? '-' : (user.year || '-')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => startEdit(user)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
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
        </div>
      </div>
    </div>
  );
}

export default UserManagement;