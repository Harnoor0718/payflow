import { useEffect, useState } from 'react';

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    success: 0,
    failed: 0,
    total_amount: 0,
    pending_amount: 0
  });

  useEffect(() => {
    fetchStats();
    
    // Auto-refresh stats every 10 seconds
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/payments/stats/summary');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
      <div className="bg-white border-2 border-black rounded-lg p-3 sm:p-4">
        <div className="text-xl sm:text-2xl font-bold text-black">{stats.total}</div>
        <div className="text-xs sm:text-sm text-gray-600">Total</div>
      </div>
      
      <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-3 sm:p-4">
        <div className="text-xl sm:text-2xl font-bold text-purple-700">{stats.pending}</div>
        <div className="text-xs sm:text-sm text-purple-700">Pending</div>
      </div>
      
      <div className="bg-green-50 border-2 border-green-300 rounded-lg p-3 sm:p-4">
        <div className="text-xl sm:text-2xl font-bold text-green-700">{stats.success}</div>
        <div className="text-xs sm:text-sm text-green-700">Success</div>
      </div>
      
      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3 sm:p-4">
        <div className="text-xl sm:text-2xl font-bold text-red-700">{stats.failed}</div>
        <div className="text-xs sm:text-sm text-red-700">Failed</div>
      </div>
      
      <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-3 sm:p-4">
        <div className="text-xl sm:text-2xl font-bold text-black">₹{stats.total_amount}</div>
        <div className="text-xs sm:text-sm text-gray-700">Collected</div>
      </div>
      
      <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-3 sm:p-4">
        <div className="text-xl sm:text-2xl font-bold text-purple-700">₹{stats.pending_amount}</div>
        <div className="text-xs sm:text-sm text-purple-700">Pending ₹</div>
      </div>
    </div>
  );
}

export default Dashboard;