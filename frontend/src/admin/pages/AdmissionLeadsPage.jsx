import React, { useState, useEffect } from 'react';
import { Users, Phone, Mail, GraduationCap, CheckCircle, Clock } from 'lucide-react';
import { chatbotLeadsService } from '../../services/chatbotLeadsService';

export default function AdmissionLeadsPage() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    // Load leads from our service
    setLeads(chatbotLeadsService.getLeads());
  }, []);

  const handleStatusChange = (id, newStatus) => {
    chatbotLeadsService.updateLeadStatus(id, newStatus);
    setLeads(chatbotLeadsService.getLeads());
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-display font-bold text-slate-800 flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-600" />
          Admission Leads
        </h2>
        <p className="text-slate-500 mt-2">Leads captured by the CAHCET Assistant AI.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Student Name</th>
              <th className="px-6 py-4 font-semibold">Contact Info</th>
              <th className="px-6 py-4 font-semibold">Interest</th>
              <th className="px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                  No leads captured yet.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                    {new Date(lead.timestamp).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {lead.name}
                  </td>
                  <td className="px-6 py-4 space-y-1">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-3.5 h-3.5" /> {lead.phone}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="w-3.5 h-3.5" /> {lead.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium text-xs">
                      <GraduationCap className="w-3.5 h-3.5" />
                      {lead.department || 'Not specified'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border-0 cursor-pointer focus:ring-2
                        ${lead.status === 'New' ? 'bg-amber-100 text-amber-700' : 
                          lead.status === 'Contacted' ? 'bg-blue-100 text-blue-700' : 
                          'bg-primary-100 text-emerald-700'}`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Converted">Converted</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
