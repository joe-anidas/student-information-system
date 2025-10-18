import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { dataAPI } from '../../lib/api';

function AnalyticsReports() {
  const [stats, setStats] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [scoreStats, setScoreStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  useEffect(() => {
    fetchAllStats();
  }, [selectedPeriod]);

  const fetchAllStats = async () => {
    try {
      const [dashboardData, attendanceData, scoreData] = await Promise.all([
        dataAPI.getDashboardStats(),
        dataAPI.getAttendanceStats(),
        dataAPI.getScoreStats()
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
              <p className="text-gray-600">Comprehensive system analytics and performance reports</p>
            </div>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="current">Current Semester</option>
              <option value="month">This Month</option>
              <option value="week">This Week</option>
            </select>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <span className="text-2xl">👨🎓</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalStudents || 0}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalFaculty || 0}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{stats?.departmentStats?.length || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${getAttendancePercentageColor(attendanceStats?.attendancePercentage || 0)}`}>
                  <span className="text-2xl">📊</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {attendanceStats?.attendancePercentage?.toFixed(1) || 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Department Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h3>
              <div className="space-y-3">
                {stats?.departmentStats?.map((dept, index) => {
                  const maxCount = Math.max(...stats.departmentStats.map(d => d.count));
                  const percentage = (dept.count / maxCount) * 100;
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{dept._id}</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-8">{dept.count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Attendance Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Overview</h3>
              {attendanceStats ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{attendanceStats.presentCount}</div>
                      <div className="text-sm text-gray-600">Present</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{attendanceStats.absentCount}</div>
                      <div className="text-sm text-gray-600">Absent</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{attendanceStats.lateCount}</div>
                      <div className="text-sm text-gray-600">Late</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Overall Attendance Rate</span>
                      <span className={`px-2 py-1 text-sm rounded-full ${getAttendancePercentageColor(attendanceStats.attendancePercentage)}`}>
                        {attendanceStats.attendancePercentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No attendance data available</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Academic Performance */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Performance</h3>
              {scoreStats ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Average Score</div>
                      <div className="text-2xl font-bold text-blue-600">{scoreStats.averageMarks || 0}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Average Percentage</div>
                      <div className="text-2xl font-bold text-blue-600">{scoreStats.averagePercentage || 0}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Highest Score</div>
                      <div className="text-2xl font-bold text-green-600">{scoreStats.highestMarks || 0}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Lowest Score</div>
                      <div className="text-2xl font-bold text-red-600">{scoreStats.lowestMarks || 0}</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium text-gray-700 mb-2">Grade Distribution</div>
                    <div className="flex flex-wrap gap-2">
                      {scoreStats.gradeDistribution && Object.entries(scoreStats.gradeDistribution).map(([grade, count]) => (
                        <div key={grade} className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-1 ${getGradeDistributionColor(grade)}`}></div>
                          <span className="text-xs text-gray-600">{grade}: {count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No performance data available</p>
              )}
            </div>

            {/* Year-wise Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Year-wise Student Distribution</h3>
              <div className="space-y-3">
                {stats?.yearStats?.map((year, index) => {
                  const maxCount = Math.max(...stats.yearStats.map(y => y.count));
                  const percentage = (year.count / maxCount) * 100;
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Year {year._id}</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-8">{year.count}</span>
                      </div>
                    </div>
                  );
                })}
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