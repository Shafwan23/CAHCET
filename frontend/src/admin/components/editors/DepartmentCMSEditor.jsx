/**
 * DepartmentCMSEditor.jsx — Main shell for Department CMS editing
 * Reads :deptKey and :section from URL params and renders the correct sub-editor.
 * Handles RBAC permission checks before rendering.
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, UserCircle, Layers, Trophy, Images,
  BookOpenCheck, MapPin, ChevronRight, AlertTriangle,
  Eye, Clock, Save, CheckCircle,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { DEPARTMENTS } from '../../services/departmentService';
import { useDepartmentCMS } from '../../utils/useDepartmentCMS';

// Lazy-load sub-editors
import DeptOverviewEditor   from './departments/DeptOverviewEditor';
import DeptFacilitiesEditor from './departments/DeptFacilitiesEditor';
import DeptFacultyEditor    from './departments/DeptFacultyEditor';
import DeptAchievementsEditor from './departments/DeptAchievementsEditor';
import DeptGalleryEditor    from './departments/DeptGalleryEditor';
import DeptCurriculumEditor from './departments/DeptCurriculumEditor';
import DeptContactEditor    from './departments/DeptContactEditor';

const SECTIONS = [
  { key: 'overview',     label: 'Overview',      icon: Building2,    component: DeptOverviewEditor },
  { key: 'facilities',   label: 'Facilities',    icon: Layers,       component: DeptFacilitiesEditor },
  { key: 'faculties',    label: 'Faculties',     icon: UserCircle,   component: DeptFacultyEditor },
  { key: 'achievements', label: 'Achievements',  icon: Trophy,       component: DeptAchievementsEditor },
  { key: 'gallery',      label: 'Gallery',       icon: Images,       component: DeptGalleryEditor },
  { key: 'curriculum',   label: 'Curriculum',    icon: BookOpenCheck,component: DeptCurriculumEditor },
  { key: 'contact',      label: 'Contact',       icon: MapPin,       component: DeptContactEditor },
];

const DepartmentCMSEditor = () => {
  const { deptKey, section = 'overview' } = useParams();
  const navigate = useNavigate();
  const { session, canAccessDept, canEditRoute } = useAdminAuth();
  const cms = useDepartmentCMS(deptKey);

  const canAccessSection = (secKey) => {
    return canEditRoute(`/admin/dashboard/departments/${deptKey}/${secKey}`);
  };

  const dept = DEPARTMENTS.find(d => d.key === deptKey);
  const currentSection = SECTIONS.find(s => s.key === section);

  // Permission guard for Department
  if (!canAccessDept(deptKey)) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 text-center p-8">
        <AlertTriangle className="w-12 h-12 text-amber-500" />
        <h2 className="text-xl font-bold text-slate-800">Access Denied</h2>
        <p className="text-slate-500 max-w-sm">You don't have permission to access the {dept?.fullName || deptKey.toUpperCase()} department.</p>
        <button onClick={() => navigate('/admin/dashboard')} className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition-colors">
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Permission guard for specific Section (vital for Faculty Editors)
  if (!canAccessSection(section)) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 text-center p-8">
        <AlertTriangle className="w-12 h-12 text-amber-500" />
        <h2 className="text-xl font-bold text-slate-800">Section Access Denied</h2>
        <p className="text-slate-500 max-w-sm">You don't have permission to view or edit the {currentSection?.label || section} section.</p>
      </div>
    );
  }

  if (!dept) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 text-center p-8">
        <AlertTriangle className="w-12 h-12 text-amber-500" />
        <h2 className="text-xl font-bold text-slate-800">Department Not Found</h2>
        <p className="text-slate-500">The department "{deptKey}" does not exist.</p>
      </div>
    );
  }

  const EditorComponent = currentSection?.component;

  return (
    <div className="flex flex-col h-full min-h-screen bg-slate-50">
      {/* Dept Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <span>Departments</span>
          <ChevronRight className="w-3 h-3" />
          <span style={{ color: dept.color }} className="font-semibold">{dept.label}</span>
          {currentSection && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-600 font-medium">{currentSection.label}</span>
            </>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm"
              style={{ backgroundColor: dept.color }}
            >
              {dept.label.slice(0, 2)}
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">{dept.fullName}</h1>
              <p className="text-xs text-slate-400">{dept.label} Department CMS</p>
            </div>
          </div>

          {/* Status indicators */}
          <div className="flex items-center gap-3">
            {cms.lastSaved && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <CheckCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>Saved {new Date(cms.lastSaved).toLocaleTimeString()}</span>
              </div>
            )}
            {cms.isDirty && (
              <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                <Clock className="w-3.5 h-3.5" />
                <span>Unsaved changes</span>
              </div>
            )}
            <a
              href={`/departments/${deptKey}/department`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </a>
          </div>
        </div>

        {/* Section tabs */}
        <div className="flex gap-1 mt-4 overflow-x-auto pb-1">
          {SECTIONS.filter(s => canAccessSection(s.key)).map(sec => {
            const Icon = sec.icon;
            const isActive = sec.key === section;
            return (
              <NavLink
                key={sec.key}
                to={`/admin/dashboard/departments/${deptKey}/${sec.key}`}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all
                  ${isActive
                    ? 'bg-amber-500/10 text-amber-600 border border-amber-200'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {sec.label}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Editor content */}
      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${deptKey}-${section}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {EditorComponent && cms.data ? (
              <EditorComponent
                deptKey={deptKey}
                dept={dept}
                cms={cms}
                session={session}
              />
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DepartmentCMSEditor;
