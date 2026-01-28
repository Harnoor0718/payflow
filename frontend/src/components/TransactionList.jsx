import { useEffect, useState } from 'react';
import { Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSkeleton from './LoadingSkeleton';

function TransactionList({ refresh }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const fetchTransactions = async (showToast = false) => {
    try {
      const response = await fetch('http://localhost:5000/api/payments');
      const data = await response.json();
      
      if (data.success) {
        // Check for status changes
        if (transactions.length > 0 && showToast) {
          checkStatusChanges(transactions, data.data);
        }
        setTransactions(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      if (showToast) {
        toast.error('Failed to refresh transactions');
      }
    } finally {
      setLoading(false);
    }
  };

  const checkStatusChanges = (oldTransactions, newTransactions) => {
    newTransactions.forEach(newTxn => {
      const oldTxn = oldTransactions.find(t => t.id === newTxn.id);
      if (oldTxn && oldTxn.status !== newTxn.status) {
        // Status changed!
        if (newTxn.status === 'SUCCESS') {
          toast.success(`Payment received from ${newTxn.payer_name}! 💰`);
        } else if (newTxn.status === 'FAILED') {
          toast.error(`Payment failed for ${newTxn.payer_name}`);
        }
      }
    });
  };

  useEffect(() => {
    fetchTransactions();
  }, [refresh]);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchTransactions(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh, transactions]);

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

  // Filter transactions based on selected filter
  const filteredTransactions = transactions.filter(txn => {
    if (filter === 'ALL') return true;
    return txn.status === filter;
  });

  if (loading) {
    return (
      <div className="bg-white border-2 border-black rounded-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-black mb-4">Transactions</h2>
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-black rounded-lg p-4 sm:p-6">
      {/* Header with controls */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg sm:text-xl font-bold text-black">Transactions</h2>
          <div className="flex gap-2 items-center">
            {/* Auto-refresh toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                autoRefresh 
                  ? 'bg-yellow-400 text-black' 
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {autoRefresh ? '🔄 Live' : 'Paused'}
            </button>
            
            {/* Manual refresh */}
            <button 
              onClick={() => fetchTransactions(true)}
              className="text-xs sm:text-sm px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
        
        {/* Filter buttons */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['ALL', 'PENDING', 'SUCCESS', 'FAILED'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 text-xs sm:text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                filter === status
                  ? 'bg-yellow-400 text-black border-2 border-black'
                  : 'bg-white text-gray-600 border-2 border-gray-300 hover:border-yellow-400'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      
      {/* Transaction list */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredTransactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8 text-sm">
            {filter === 'ALL' ? 'No transactions yet' : `No ${filter} transactions`}
          </p>
        ) : (
          filteredTransactions.map((txn) => (
            <div 
              key={txn.id} 
              className="border-2 border-gray-200 rounded-lg p-3 sm:p-4 hover:border-yellow-400 transition-all duration-200 hover:shadow-md hover:scale-[1.02] animate-slideIn"
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
      
      {/* Live indicator */}
      {autoRefresh && (
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Auto-updating every 5s
        </div>
      )}
    </div>
  );
}

export default TransactionList;