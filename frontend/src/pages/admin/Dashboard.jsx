import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, UserCircle, Shield, Building, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 px-6 py-8 text-white flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="mt-2 text-indigo-100">Welcome back, {user?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <UserCircle className="w-6 h-6 text-indigo-600" />
              Your Profile
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Role Card */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Role</p>
                  <p className="text-lg font-semibold text-gray-900">{user?.role}</p>
                </div>
              </div>

              {/* Department Card */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-lg text-green-600">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Department</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {user?.departmentId ? user.departmentId : 'Global/None'}
                  </p>
                </div>
              </div>

              {/* ID Card */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">User ID</p>
                  <p className="text-sm font-mono text-gray-900 truncate mt-1" title={user?.id}>
                    {user?.id}
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};
