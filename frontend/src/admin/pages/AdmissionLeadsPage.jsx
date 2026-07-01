import React, { useState, useEffect } from 'react';
import { Users, Phone, Mail, GraduationCap, CheckCircle, Clock, Search, Filter, ArrowDownToLine, Check, Trash2, Calendar } from 'lucide-react';
import { chatbotLeadsService } from '../../services/chatbotLeadsService';
import EditorPage, { EditorCard } from '../components/ui/EditorPage';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdmissionLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    setLeads(chatbotLeadsService.getLeads());
  }, []);

  const handleStatusChange = (id, newStatus) => {
    chatbotLeadsService.updateLeadStatus(id, newStatus);
    setLeads(chatbotLeadsService.getLeads());
  };

  const filtered = leads.filter(l => 
    (l.name.toLowerCase().includes(search.toLowerCase()) || 
     l.email.toLowerCase().includes(search.toLowerCase()) || 
     l.phone.includes(search)) &&
    (statusFilter === 'All' || l.status === statusFilter)
  );

  return (
    <EditorPage
      title="Admission CRM"
      description="Enterprise lead pipeline for managing prospective student inquiries."
      breadcrumb={['Admin', 'Admissions', 'Lead CRM']}
    >
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.3}} className="space-y-6">
        
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <span className="text-slate-500 font-semibold text-xs uppercase tracking-wider mb-2">Total Leads</span>
            <span className="text-3xl font-bold text-slate-800">{leads.length}</span>
          </div>
          <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 shadow-sm flex flex-col">
            <span className="text-amber-700 font-semibold text-xs uppercase tracking-wider mb-2">New</span>
            <span className="text-3xl font-bold text-amber-600">{leads.filter(l=>l.status==='New').length}</span>
          </div>
          <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 shadow-sm flex flex-col">
            <span className="text-blue-700 font-semibold text-xs uppercase tracking-wider mb-2">Contacted</span>
            <span className="text-3xl font-bold text-blue-600">{leads.filter(l=>l.status==='Contacted').length}</span>
          </div>
          <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 shadow-sm flex flex-col">
            <span className="text-emerald-700 font-semibold text-xs uppercase tracking-wider mb-2">Converted</span>
            <span className="text-3xl font-bold text-emerald-600">{leads.filter(l=>l.status==='Converted').length}</span>
          </div>
        </div>

        <EditorCard title="Lead Directory" className="!mb-0">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex-1 relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search leads by name, email, or phone..." 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Converted">Converted</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                <ArrowDownToLine className="w-4 h-4" /> Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <div className="w-full overflow-x-auto">
<table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Student / Contact</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Timeline</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Interest / Details</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Pipeline Status</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <Users className="w-10 h-10 text-slate-300 mb-3" />
                        <p className="font-semibold">No leads found.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {filtered.map((lead) => (
                      <motion.tr layout initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800">{lead.name}</p>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {lead.phone}</span>
                            <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {lead.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-slate-500 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400"/> {new Date(lead.timestamp).toLocaleDateString()}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 ml-5">{new Date(lead.timestamp).toLocaleTimeString()}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg font-semibold text-xs border border-slate-200">
                            <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                            {lead.department || 'Undecided'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border-0 cursor-pointer focus:ring-2 transition-colors outline-none
                              ${lead.status === 'New' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 
                                lead.status === 'Contacted' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 
                                'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                          >
                            <option value="New">New Lead</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Converted">Converted</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Check className="w-4 h-4"/></button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
</div>
          </div>
        </EditorCard>

      </motion.div>
    </EditorPage>
  );
}
