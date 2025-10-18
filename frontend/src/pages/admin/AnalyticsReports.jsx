import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { dataAPI } from '../../lib/api';

function AnalyticsReports() {
  const [stats, setStats] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [scoreStats, setScoreStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    userType: 'students',
    department: '',
    year: '',
    period: 'all'
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchAllStats();
  }, [filters]);

  const fetchInitialData = async () => {
    try {
      const [studentsData, facultyData] = await Promise.all([
        dataAPI.getUsers({ role: 'student' }),
        dataAPI.getUsers({ role: 'faculty' })
      ]);
      setStudents(studentsData);
      setFaculty(facultyData);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const fetchAllStats = async () => {
    try {
      const queryParams = {};
      if (filters.department) queryParams.department = filters.department;
      if (filters.year) queryParams.year = filters.year;
      if (filters.student) queryParams.studentId = filters.student;
      if (filters.faculty) queryParams.facultyId = filters.faculty;
      if (filters.period !== 'all') queryParams.period = filters.period;

      const [dashboardData, attendanceData, scoreData] = await Promise.all([
        dataAPI.getDashboardStats(queryParams),
        dataAPI.getAttendanceStats(queryParams),
        dataAPI.getScoreStats(queryParams)
      ]);
      
      setStats(dashboardData);
      setAttendanceStats(attendanceData);
      setScoreStats(scoreData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAttendancePercentageColor = (percentage) => {
    if (percentage >= 85) return 'text-green-600 bg-green-100';
    if (percentage >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getGradeDistributionColor = (grade) => {
    const colors = {
      'A+': 'bg-green-500',
      'A': 'bg-green-400',
      'B+': 'bg-blue-500',
      'B': 'bg-blue-400',
      'C+': 'bg-yellow-500',
      'C': 'bg-yellow-400',
      'D': 'bg-orange-500',
      'F': 'bg-red-500'
    };
    return colors[grade] || 'bg-gray-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 p-8 flex justify-center">
          <div className="text-lg">Loading analytics...</div>
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
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
                <p className="text-gray-600">Comprehensive system analytics and performance reports</p>
              </div>
              <button
                onClick={() => setFilters({ userType: 'students', department: '', year: '', period: 'all' })}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear Filters
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  value={filters.userType}
                  onChange={(e) => setFilters({...filters, userType: e.target.value, year: ''})}
                  className="p-2 border rounded-lg"
                >
                  <option value="students">Students Analytics</option>
                  <option value="faculty">Faculty Analytics</option>
                </select>
                
                <select
                  value={filters.department}
                  onChange={(e) => setFilters({...filters, department: e.target.value})}
                  className="p-2 border rounded-lg"
                >
                  <option value="">All Departments</option>
                  <option value="Computer Science Engineering">CSE</option>
                  <option value="Information Technology">IT</option>
                  <option value="Electronics and Communication Engineering">ECE</option>
                  <option value="Electrical and Electronics Engineering">EEE</option>
                  <option value="Mechanical Engineering">MECH</option>
                  <option value="Artificial Intelligence and Data Science">AIDS</option>
                </select>
                
                {filters.userType === 'students' && (
                  <select
                    value={filters.year}
                    onChange={(e) => setFilters({...filters, year: e.target.value})}
                    className="p-2 border rounded-lg"
                  >
                    <option value="">All Years</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                )}
                
                <select
                  value={filters.period}
                  onChange={(e) => setFilters({...filters, period: e.target.value})}
                  className="p-2 border rounded-lg"
                >
                  <option value="all">All Time</option>
                  <option value="current">Current Semester</option>
                  <option value="month">This Month</option>
                  <option value="week">This Week</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filter-Based Analytics */}
          {(filters.department || filters.year) && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {filters.userType === 'students' ? 'Student' : 'Faculty'} Analytics
                {filters.department && ` - ${filters.department.split(' ')[0]}`}
                {filters.year && ` - Year ${filters.year}`}
              </h2>
              
              {/* Filtered Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <span className="text-2xl">👨🎓</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        {filters.userType === 'students' ? 'Filtered Students' : 'Students in Dept'}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {students.filter(s => 
                          (!filters.department || s.department === filters.department) &&
                          (!filters.year || s.year?.toString() === filters.year)
                        ).length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <span className="text-2xl">👨🏫</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Faculty in Dept</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {faculty.filter(f => 
                          !filters.department || f.department === filters.department
                        ).length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${getAttendancePercentageColor(attendanceStats?.attendancePercentage || 0)}`}>
                      <span className="text-2xl">📊</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Filtered Attendance</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {attendanceStats?.attendancePercentage?.toFixed(1) || 0}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <span className="text-2xl">📈</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {scoreStats?.averagePercentage?.toFixed(1) || 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filtered Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Attendance Overview */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {filters.userType === 'students' ? 'Student' : 'Faculty'} Attendance Analytics
                  </h3>
                  {attendanceStats ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{attendanceStats.presentCount || 0}</div>
                          <div className="text-sm text-gray-600">Present</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">{attendanceStats.absentCount || 0}</div>
                          <div className="text-sm text-gray-600">Absent</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">{attendanceStats.lateCount || 0}</div>
                          <div className="text-sm text-gray-600">Late</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No filtered attendance data</p>
                  )}
                </div>

                {/* Academic Performance */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {filters.userType === 'students' ? 'Student' : 'Faculty'} Performance Analytics
                  </h3>
                  {scoreStats ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">Average Score</div>
                          <div className="text-2xl font-bold text-blue-600">{scoreStats.averageMarks?.toFixed(1) || 0}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Average %</div>
                          <div className="text-2xl font-bold text-blue-600">{scoreStats.averagePercentage?.toFixed(1) || 0}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Highest</div>
                          <div className="text-2xl font-bold text-green-600">{scoreStats.highestMarks || 0}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Lowest</div>
                          <div className="text-2xl font-bold text-red-600">{scoreStats.lowestMarks || 0}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No filtered performance data</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Common System Analytics */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">System Overview</h2>
            
            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <span className="text-2xl">👨🎓</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">{students?.length || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <span className="text-2xl">👨🏫</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Faculty</p>
                    <p className="text-2xl font-bold text-gray-900">{faculty?.length || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <span className="text-2xl">🏢</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Departments</p>
                    <p className="text-2xl font-bold text-gray-900">6</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">System Health</p>
                    <p className="text-2xl font-bold text-green-600">Active</p>
                  </div>
                </div>
              </div>
            </div>

            {/* System Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Department Distribution */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h3>
                <div className="space-y-3">
                  {['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'AIDS'].map((dept, index) => {
                    const deptName = {
                      'CSE': 'Computer Science Engineering',
                      'IT': 'Information Technology', 
                      'ECE': 'Electronics and Communication Engineering',
                      'EEE': 'Electrical and Electronics Engineering',
                      'MECH': 'Mechanical Engineering',
                      'AIDS': 'Artificial Intelligence and Data Science'
                    }[dept];
                    
                    const count = students?.filter(s => s.department === deptName)?.length || 0;
                    const maxCount = Math.max(...['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'AIDS'].map(d => {
                      const fullName = {
                        'CSE': 'Computer Science Engineering',
                        'IT': 'Information Technology', 
                        'ECE': 'Electronics and Communication Engineering',
                        'EEE': 'Electrical and Electronics Engineering',
                        'MECH': 'Mechanical Engineering',
                        'AIDS': 'Artificial Intelligence and Data Science'
                      }[d];
                      return students?.filter(s => s.department === fullName)?.length || 0;
                    }));
                    const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{dept}</span>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Year-wise Distribution */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Year-wise Distribution</h3>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((year, index) => {
                    const count = students?.filter(s => s.year === year)?.length || 0;
                    const maxCount = Math.max(...[1, 2, 3, 4].map(y => 
                      students?.filter(s => s.year === y)?.length || 0
                    ));
                    const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Year {year}</span>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                            <div 
                              className="bg-purple-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-sm font-medium text-gray-700">Database Status</div>
                <div className="text-sm text-green-600">Connected</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-sm font-medium text-gray-700">Total Records</div>
                <div className="text-sm text-blue-600">
                  {(attendanceStats?.totalRecords || 0) + (scoreStats?.totalRecords || 0)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🔄</div>
                <div className="text-sm font-medium text-gray-700">Last Updated</div>
                <div className="text-sm text-gray-600">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsReports;