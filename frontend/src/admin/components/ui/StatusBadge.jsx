import React from 'react';

const variants = {
  published: 'bg-primary-100 text-emerald-700 border border-emerald-200',
  draft: 'bg-amber-100 text-amber-700 border border-amber-200',
  unpublished: 'bg-slate-100 text-slate-600 border border-slate-200',
  active: 'bg-blue-100 text-blue-700 border border-blue-200',
};

const dots = {
  published: 'bg-amber-500',
  draft: 'bg-amber-500',
  unpublished: 'bg-slate-400',
  active: 'bg-blue-500',
};

const StatusBadge = ({ status = 'published', label }) => {
  const text = label || status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${variants[status] || variants.unpublished}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status] || dots.unpublished}`} />
      {text}
    </span>
  );
};

export default StatusBadge;
