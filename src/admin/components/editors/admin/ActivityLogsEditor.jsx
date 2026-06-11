import React, { useState, useEffect } from 'react';
import { Search, Download, Clock, User, FileText, CheckCircle, Trash2, ArrowRight, Ban, Key, ShieldAlert, FileType2 } from 'lucide-react';
import { auditService } from '../../../services/auditService';

const ActivityLogsEditor = () => {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    setLogs(auditService.getLogs({ limit: 500 }));
  }, []);

  const filteredLogs = logs.filter(log => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (log.action || '').toLowerCase().includes(term) ||
      (log.section || '').toLowerCase().includes(term) ||
      (log.performedBy || '').toLowerCase().includes(term);
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'security') return ['Failed Login', 'Permission Denied', 'Password Reset', 'Role Changed'].includes(log.action) && matchesSearch;
    if (filterType === 'published') return log.action === 'Published' && matchesSearch;
    return matchesSearch;
  });

  const handleExportCSV = () => {
    const csv = [
      ['Date', 'Time', 'User', 'Action', 'Module', 'Dept'].join(','),
      ...filteredLogs.map(l => {
        const d = new Date(l.timestamp);
        return [
          d.toLocaleDateString(),
          d.toLocaleTimeString(),
          `"${l.performedBy || 'System'}"`,
          `"${l.action}"`,
          `"${l.section || ''}"`,
          `"${l.deptKey || 'Global'}"`
        ].join(',');
      })
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cahcet-audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleExportPDF = () => {
    // Uses the browser print dialogue for a lightweight PDF export without libraries
    window.print();
  };

  const getIcon = (action) => {
    if (action.includes('Published')) return <CheckCircle className="w-4 h-4 text-amber-500" />;
    if (action.includes('Delete')) return <Trash2 className="w-4 h-4 text-amber-500" />;
    if (action.includes('Upload')) return <FileText className="w-4 h-4 text-blue-500" />;
    if (action.includes('Login')) return <User className="w-4 h-4 text-primary-500" />;
    if (action.includes('Denied') || action.includes('Failed')) return <Ban className="w-4 h-4 text-amber-600" />;
    if (action.includes('Password')) return <Key className="w-4 h-4 text-amber-500" />;
    if (action.includes('Role')) return <ShieldAlert className="w-4 h-4 text-primary-500" />;
    return <Clock className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 print:m-0 print:p-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Enterprise Audit Logs</h1>
          <p className="text-slate-500 text-sm mt-1">Track all system events, access attempts, and configuration changes.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-semibold shadow-sm w-max">
            <Download className="w-4 h-4" /> CSV
          </button>
          <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors text-sm font-semibold shadow-sm w-max">
            <FileType2 className="w-4 h-4" /> PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden print:border-none print:shadow-none">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 bg-slate-50/50 print:hidden">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search user, action or module..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setFilterType('all')} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${filterType === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              All Events
            </button>
            <button onClick={() => setFilterType('security')} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${filterType === 'security' ? 'bg-amber-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-primary-50 hover:text-amber-600'}`}>
              Security Alerts
            </button>
          </div>
        </div>

        {/* Print Header */}
        <div className="hidden print:block p-4 border-b border-slate-200">
          <h2 className="text-xl font-bold">CAHCET System Audit Log Report</h2>
          <p className="text-sm text-slate-500">Generated: {new Date().toLocaleString()}</p>
        </div>

        {/* Timeline / Table view */}
        <div className="p-0">
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center print:hidden">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4"><Clock className="w-8 h-8 text-slate-400" /></div>
              <h3 className="text-lg font-bold text-slate-700">No Activity Found</h3>
              <p className="text-slate-500 text-sm mt-1">There are no logs matching your current filters.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredLogs.map(log => {
                const date = new Date(log.timestamp);
                return (
                  <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4 print:py-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 print:hidden">
                      {getIcon(log.action)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                        <h4 className="text-sm font-bold text-slate-800 truncate">{log.action}</h4>
                        <span className="hidden md:block text-slate-300"><ArrowRight className="w-3 h-3" /></span>
                        <p className="text-sm text-slate-600 truncate font-medium flex items-center gap-2">
                          <span className="font-semibold">@{log.performedBy || 'System'}</span>
                          {log.section && <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">{log.section}</span>}
                          {log.deptKey && <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded text-xs uppercase">{log.deptKey}</span>}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-slate-700">{date.toLocaleDateString()}</p>
                      <p className="text-[10px] text-slate-500 uppercase">{date.toLocaleTimeString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogsEditor;
