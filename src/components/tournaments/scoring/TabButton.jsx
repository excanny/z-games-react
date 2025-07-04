

// Tab Button Component
const TabButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
      active 
        ? 'bg-blue-500 text-white' 
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`}
  >
    {Icon && <Icon className="w-4 h-4 inline mr-2" />}
    {label}
  </button>
);

export default TabButton;