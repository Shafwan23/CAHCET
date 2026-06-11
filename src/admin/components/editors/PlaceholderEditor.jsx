import React from 'react';
import { Settings2 } from 'lucide-react';

export default function PlaceholderEditor({ title, description }) {
  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6 border border-slate-200">
        <Settings2 className="w-10 h-10 text-slate-400" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
      <p className="text-slate-500 max-w-md">
        {description || "This section is under construction. It will be available in a future update."}
      </p>
    </div>
  );
}
