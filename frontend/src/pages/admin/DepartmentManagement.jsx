import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { dataAPI } from '../../lib/api';

function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    semesters: []
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await dataAPI.getDepartments();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDept) {
        await dataAPI.updateDepartment(editingDept._id, formData);
      } else {
        await dataAPI.createDepartment(formData);
      }
      fetchDepartments();
      resetForm();
    } catch (error) {
      console.error('Error saving department:', error);
    }
  };

  const handleDelete = async (deptId) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await dataAPI.deleteDepartment(deptId);
        fetchDepartments();
      } catch (error) {
        console.error('Error deleting department:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      semesters: []
    });
    setEditingDept(null);
    setShowForm(false);
  };

  const startEdit = (dept) => {
    setFormData({
      name: dept.name,
      code: dept.code,
      semesters: dept.semesters || []
    });
    setEditingDept(dept);
    setShowForm(true);
  };

  const addSemester = () => {
    setFormData({
      ...formData,
      semesters: [...formData.semesters, { semNo: formData.semesters.length + 1, subjects: [] }]
    });
  };

  const removeSemester = (index) => {
    const newSemesters = formData.semesters.filter((_, i) => i !== index);
    setFormData({ ...formData, semesters: newSemesters });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Department Management</h1>
              <p className="text-gray-600">Create and manage academic departments</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add New Department
            </button>
          </div>

          {/* Department Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">
                  {editingDept ? 'Edit Department' : 'Add New Department'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Department Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Department Code (e.g., CSE, ECE)"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">Semesters</label>
                      <button
                        type="button"
                        onClick={addSemester}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        + Add Semester
                      </button>
                    </div>
                    {formData.semesters.map((semester, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-600">Semester {semester.semNo}</span>
                        <button
                          type="button"
                          onClick={() => removeSemester(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                      {editingDept ? 'Update' : 'Create'}
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

          {/* Departments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <div key={dept._id} className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{dept.name}</h3>
                    <p className="text-gray-600 text-sm">Code: {dept.code}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(dept)}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(dept._id)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Semesters:</p>
                  <div className="flex flex-wrap gap-1">
                    {dept.semesters && dept.semesters.length > 0 ? (
                      dept.semesters.map((sem, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          Sem {sem.semNo}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">No semesters configured</span>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Created: {new Date(dept.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {departments.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏢</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first department</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Department
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DepartmentManagement;