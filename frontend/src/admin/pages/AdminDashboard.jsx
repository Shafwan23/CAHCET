import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from '../components/layout/AdminSidebar';
import AdminTopbar from '../components/layout/AdminTopbar';

const AdminDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    /*
     * Layout strategy for independent scrolling:
     * - Root: h-screen, overflow-hidden, flex row
     * - Sidebar: sticky top-0, h-screen, its OWN overflow-y-auto (inside the nav)
     * - Content area: flex col, flex-1, overflow-hidden
     *   - Topbar: shrink-0, sticky
     *   - main: flex-1, overflow-auto  ← only the content scrolls
     */
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar (manages its own scroll internally) */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Right column — topbar + scrollable content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AdminTopbar onMenuClick={() => setMobileOpen(true)} />

        {/* Only this <main> scrolls on page navigation */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="min-h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
