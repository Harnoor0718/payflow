import { useEffect, useState } from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

function TransactionList({ refresh }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/payments');
      const data = await response.json();
      
      if (data.success) {
        setTransactions(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [refresh]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'SUCCESS': return 'bg-green-100 text-green-700 border-green-300';
      case 'FAILED': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-purple-100 text-purple-700 border-purple-300';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'SUCCESS': return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'FAILED': return <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
      default: return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60); // minutes
    
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} min${diff > 1 ? 's' : ''} ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hour${Math.floor(diff / 60) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-white border-2 border-black rounded-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-black mb-4">Transactions</h2>
        <p className="text-gray-500 text-center py-8">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-black rounded-lg p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-black">Transactions</h2>
        <button 
          onClick={fetchTransactions}
          className="text-xs sm:text-sm px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded transition-colors"
        >
          Refresh
        </button>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8 text-sm">No transactions yet</p>
        ) : (
          transactions.map((txn) => (
            <div 
              key={txn.id} 
              className="border-2 border-gray-200 rounded-lg p-3 sm:p-4 hover:border-yellow-400 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-black text-sm sm:text-base truncate">
                    {txn.payer_name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">
                    {txn.note || 'No note'}
                  </p>
                </div>
                <div className="text-right ml-2">
                  <div className="font-bold text-black text-sm sm:text-base">
                    ₹{txn.amount}
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border mt-1 ${getStatusColor(txn.status)}`}>
                    {getStatusIcon(txn.status)}
                    {txn.status}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span className="truncate">{txn.id.slice(0, 8)}...</span>
                <span>{formatTime(txn.created_at)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TransactionList;