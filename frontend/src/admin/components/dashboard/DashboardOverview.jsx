import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { cmsService } from '../../../services/cmsService';
import SuperAdminDashboard from './dashboards/SuperAdminDashboard';
import DepartmentAdminDashboard from './dashboards/DepartmentAdminDashboard';
import PlacementCellDashboard from './dashboards/PlacementCellDashboard';
import FacultyEditorDashboard from './dashboards/FacultyEditorDashboard';

const DashboardOverview = () => {
  const { session, role: authRole } = useAdminAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await cmsService.getAdminDashboardStats();
        setData(res);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
        setError(err?.response?.data?.message || err.message || "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-[1600px] mx-auto min-h-screen bg-slate-50 flex flex-col gap-8 animate-pulse">
        <div className="h-48 bg-white border border-slate-100 shadow-sm rounded-[2.5rem]" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-40 bg-white border border-slate-100 shadow-sm rounded-3xl" />)}
        </div>
        <div className="h-96 bg-white border border-slate-100 shadow-sm rounded-3xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-600">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4 text-red-500 border border-red-100">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <h2 className="text-xl font-bold mb-2 text-slate-800">Backend Error</h2>
        <p className="text-slate-500 max-w-md mx-auto">{error}</p>
        <p className="text-xs mt-4 text-slate-400">Please check the backend logs.</p>
      </div>
    );
  }

  // Router Logic Based on Backend Dashboard Type OR Local User Role
  const role = data?.dashboardType || authRole;
  const childData = data?.data;

  if (role === 'SUPER_ADMIN') {
    return <SuperAdminDashboard data={childData} />;
  }
  if (role === 'DEPARTMENT_ADMIN') {
    return <DepartmentAdminDashboard data={childData} />;
  }
  if (role === 'PLACEMENT_CELL') {
    return <PlacementCellDashboard data={childData} />;
  }
  if (role === 'FACULTY_EDITOR') {
    return <FacultyEditorDashboard data={childData} />;
  }

  // Fallback
  return (
    <div className="p-8 text-center text-slate-500">
      <p>Dashboard configuration not found for your role.</p>
    </div>
  );
};

export default DashboardOverview;
