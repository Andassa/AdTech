const StatusBadge = ({ status }) => {
    const config = {
      active: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500', label: 'Active' },
      paused: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500', label: 'En pause' },
      finished: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-500', label: 'Terminée' },
    }[status] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-500', label: 'Terminée' };
  
    return (
      <span className={`${config.bg} ${config.text} ${config.border} border rounded-full px-3 py-1.5 text-xs font-semibold inline-flex items-center gap-1.5`}>
        <span className={`${config.dot} w-1.5 h-1.5 rounded-full`}></span>
        {config.label}
      </span>
    );
  };
  
  export default StatusBadge;
  