interface ConfidenceBadgeProps {
  level?: 'High' | 'Medium' | 'Low';
}

export function ConfidenceBadge({ level = 'High' }: ConfidenceBadgeProps) {
  const config = {
    High: {
      dotColor: 'bg-green-500',
      textColor: 'text-green-800',
    },
    Medium: {
      dotColor: 'bg-amber-500',
      textColor: 'text-amber-800',
    },
    Low: {
      dotColor: 'bg-gray-400',
      textColor: 'text-gray-700',
    },
  }[level];

  return (
    <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-gray-200 bg-white shadow-2xs">
      <span className={`w-2 h-2 rounded-full ${config.dotColor}`}></span>
      <span className="text-gray-500 font-normal">Confidence:</span>
      <span className={`font-semibold ${config.textColor}`}>{level}</span>
    </div>
  );
}

export default ConfidenceBadge;
