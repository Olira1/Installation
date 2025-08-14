import React, { useState, useEffect } from 'react';

const Control = () => {
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    weeklyUsers: 0,
    uniqueUsers: [],
    weeklyData: [],
    lastReset: null
  });

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    visitTime: null
  });

  const [showAddUser, setShowAddUser] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshKey, setRefreshKey] = useState(0); // For refreshing data

  // Initialize stats from localStorage and set up auto-refresh
  useEffect(() => {
    const loadStats = () => {
      const savedStats = localStorage.getItem('triedPageStats');
      if (savedStats) {
        const parsed = JSON.parse(savedStats);
        setUserStats(parsed);
      } else {
        // Initialize with default values
        const now = new Date();
        const initialStats = {
          totalUsers: 0,
          weeklyUsers: 0,
          uniqueUsers: [],
          weeklyData: [],
          lastReset: now.toISOString()
        };
        setUserStats(initialStats);
        localStorage.setItem('triedPageStats', JSON.stringify(initialStats));
      }
    };

    // Load stats initially
    loadStats();

    // Set up auto-refresh every 5 seconds to catch new visits
    const interval = setInterval(loadStats, 5000);

    return () => clearInterval(interval);
  }, [refreshKey]);

  // Check if it's a new week and reset weekly count
  useEffect(() => {
    const checkWeekReset = () => {
      const now = new Date();
      const lastReset = userStats.lastReset ? new Date(userStats.lastReset) : null;
      
      if (!lastReset || getWeekNumber(now) !== getWeekNumber(lastReset)) {
        const updatedStats = {
          ...userStats,
          weeklyUsers: 0,
          weeklyData: [],
          lastReset: now.toISOString()
        };
        setUserStats(updatedStats);
        localStorage.setItem('triedPageStats', JSON.stringify(updatedStats));
      }
    };

    checkWeekReset();
  }, [userStats.lastReset]);

  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  const addUser = () => {
    if (!newUser.name.trim()) return;

    const now = new Date();
    const userVisit = {
      id: Date.now(),
      visitorId: `manual-${Date.now()}`,
      name: newUser.name.trim(),
      email: newUser.email.trim(),
      visitTime: now.toISOString(),
      weekNumber: getWeekNumber(now),
      userAgent: navigator.userAgent,
      timestamp: now.getTime(),
      isNewVisitor: true,
      isManualEntry: true
    };

    const updatedStats = {
      ...userStats,
      totalUsers: userStats.totalUsers + 1,
      weeklyUsers: userStats.weeklyUsers + 1,
      uniqueUsers: [...userStats.uniqueUsers, userVisit],
      weeklyData: [...userStats.weeklyData, userVisit]
    };

    setUserStats(updatedStats);
    localStorage.setItem('triedPageStats', JSON.stringify(updatedStats));
    
    setNewUser({ name: '', email: '', visitTime: null });
    setShowAddUser(false);
  };

  const resetStats = () => {
    if (window.confirm('Are you sure you want to reset all statistics? This action cannot be undone.')) {
      const now = new Date();
      const resetStats = {
        totalUsers: 0,
        weeklyUsers: 0,
        uniqueUsers: [],
        weeklyData: [],
        lastReset: now.toISOString()
      };
      setUserStats(resetStats);
      localStorage.setItem('triedPageStats', JSON.stringify(resetStats));
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(userStats, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tried-page-stats-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCurrentWeekUsers = () => {
    const currentWeek = getWeekNumber(new Date());
    return userStats.uniqueUsers.filter(user => getWeekNumber(new Date(user.visitTime)) === currentWeek);
  };

  const refreshData = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Tried.jsx Usage Analytics
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track and monitor user engagement with the Tried.jsx development setup page
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button
            onClick={() => setShowAddUser(true)}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            + Add User Visit
          </button>
          <button
            onClick={refreshData}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            🔄 Refresh Data
          </button>
          <button
            onClick={exportData}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            📊 Export Data
          </button>
          <button
            onClick={resetStats}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            🔄 Reset Stats
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.weeklyUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Unique Users</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.uniqueUsers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userStats.totalUsers > 0 ? Math.round((userStats.weeklyUsers / userStats.totalUsers) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'overview'
                  ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'users'
                  ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              👥 User List
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'weekly'
                  ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📅 Weekly Data
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {userStats.uniqueUsers.slice(-5).reverse().map((user) => (
                      <div key={user.id} className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                        <div>
                          <p className="font-medium text-gray-800">{user.name}</p>
                          <p className="text-sm text-gray-500">{formatDate(user.visitTime)}</p>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Week {user.weekNumber}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Current Week Users:</span>
                      <span className="font-bold text-2xl text-green-600">{userStats.weeklyUsers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Unique Users:</span>
                      <span className="font-bold text-xl text-gray-800">{userStats.uniqueUsers.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Last Reset:</span>
                      <span className="text-sm text-gray-500">
                        {userStats.lastReset ? formatDate(userStats.lastReset) : 'Never'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">All User Visits</h3>
                <div className="text-sm text-gray-500">
                  Showing {userStats.uniqueUsers.length} visits
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Week</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device Info</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userStats.uniqueUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            {user.email && (
                              <div className="text-xs text-gray-500">{user.email}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {user.isManualEntry && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  Manual
                                </span>
                              )}
                              {user.isNewVisitor ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  New
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Returning
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{formatDate(user.visitTime)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Week {user.weekNumber}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs text-gray-500 max-w-xs truncate" title={user.userAgent}>
                              {user.userAgent ? user.userAgent.substring(0, 50) + '...' : 'N/A'}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'weekly' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Weekly Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 8 }, (_, i) => {
                  const weekNumber = getWeekNumber(new Date()) - i;
                  const weekUsers = userStats.uniqueUsers.filter(
                    user => getWeekNumber(new Date(user.visitTime)) === weekNumber
                  );
                  
                  return (
                    <div key={weekNumber} className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Week {weekNumber}</span>
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                          {weekUsers.length} users
                        </span>
                      </div>
                      <div className="space-y-2">
                        {weekUsers.slice(0, 3).map((user) => (
                          <div key={user.id} className="text-sm text-gray-700 bg-white rounded px-2 py-1">
                            {user.name}
                          </div>
                        ))}
                        {weekUsers.length > 3 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{weekUsers.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Add User Modal */}
        {showAddUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Add User Visit</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter user name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddUser(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addUser}
                    disabled={!newUser.name.trim()}
                    className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add Visit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Control;
