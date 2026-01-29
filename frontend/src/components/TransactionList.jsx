import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LoadingSkeleton from "./LoadingSkeleton";
import {
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  Download,
  FileText,
} from "lucide-react";
import {
  generatePDFReceipt,
  exportFilteredToCSV,
} from "../utils/exportHelpers";

function TransactionList({ refresh }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("ALL");

  const fetchTransactions = async (showToast = false) => {
    try {
      const response = await fetch("http://localhost:5000/api/payments");
      const data = await response.json();

      if (data.success) {
        // Check for status changes
        if (transactions.length > 0 && showToast) {
          checkStatusChanges(transactions, data.data);
        }
        setTransactions(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      if (showToast) {
        toast.error("Failed to refresh transactions");
      }
    } finally {
      setLoading(false);
    }
  };

  const checkStatusChanges = (oldTransactions, newTransactions) => {
    newTransactions.forEach((newTxn) => {
      const oldTxn = oldTransactions.find((t) => t.id === newTxn.id);
      if (oldTxn && oldTxn.status !== newTxn.status) {
        // Status changed!
        if (newTxn.status === "SUCCESS") {
          toast.success(`Payment received from ${newTxn.payer_name}! 💰`);
        } else if (newTxn.status === "FAILED") {
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
    switch (status) {
      case "SUCCESS":
        return "bg-green-100 text-green-700 border-green-300";
      case "FAILED":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-purple-100 text-purple-700 border-purple-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "SUCCESS":
        return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
      case "FAILED":
        return <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
      default:
        return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60); // minutes

    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff} min${diff > 1 ? "s" : ""} ago`;
    if (diff < 1440)
      return `${Math.floor(diff / 60)} hour${Math.floor(diff / 60) > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  // Filter transactions based on selected filter, search, and date
  const filteredTransactions = transactions.filter((txn) => {
    // Status filter
    const matchesStatus = filter === "ALL" || txn.status === filter;

    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      txn.payer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchQuery.toLowerCase());

    // Date filter
    let matchesDate = true;
    if (dateFilter !== "ALL") {
      const txnDate = new Date(txn.created_at);
      const now = new Date();

      if (dateFilter === "TODAY") {
        matchesDate = txnDate.toDateString() === now.toDateString();
      } else if (dateFilter === "WEEK") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = txnDate >= weekAgo;
      } else if (dateFilter === "MONTH") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        matchesDate = txnDate >= monthAgo;
      }
    }

    return matchesStatus && matchesSearch && matchesDate;
  });

  const handleExportCSV = () => {
    const filters = {
      status: filter !== "ALL" ? filter : null,
      date: dateFilter !== "ALL" ? dateFilter : null,
    };
    exportFilteredToCSV(filteredTransactions, filters);
    toast.success("CSV exported successfully! 📊");
  };

  const handleSimulatePayment = async (txnId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/payments/${txnId}/simulate-payment`,
        {
          method: "POST",
        }
      );
      const data = await response.json();

      if (data.success) {
        toast.success(`Payment ${data.data.status}!`);
        fetchTransactions(true);
      } else {
        toast.error("Simulation failed");
      }
    } catch (error) {
      toast.error("Failed to simulate payment");
    }
  };

  const handleCopyID = (id) => {
    navigator.clipboard.writeText(id);
    toast.success("Transaction ID copied! 📋");
  };

  if (loading) {
    return (
      <div className="bg-white border-2 border-black rounded-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-black mb-4">
          Transactions
        </h2>
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-black rounded-lg p-4 sm:p-6">
      {/* Header with controls */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-black">
              Transactions
            </h2>
            {transactions.length > 0 && (
              <span className="px-2 py-1 bg-yellow-400 text-black text-xs font-bold rounded-full">
                {transactions.length}
              </span>
            )}
          </div>
          <div className="flex gap-2 items-center">
            {/* Auto-refresh toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                autoRefresh
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {autoRefresh ? "🔄 Live" : "Paused"}
            </button>

            {/* Export CSV button */}
            <button
              onClick={handleExportCSV}
              className="text-xs sm:text-sm px-3 py-1 bg-purple-400 hover:bg-purple-500 text-white font-medium rounded transition-colors flex items-center gap-1"
              title="Export to CSV"
            >
              <Download className="w-3 h-3" />
              CSV
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
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
          {["ALL", "PENDING", "SUCCESS", "FAILED"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 text-xs sm:text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                filter === status
                  ? "bg-yellow-400 text-black border-2 border-black"
                  : "bg-white text-gray-600 border-2 border-gray-300 hover:border-yellow-400"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="mb-3 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, note, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-yellow-400"
          />
        </div>

        {/* Date filter */}
        <div className="mb-3">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-yellow-400 bg-white"
          >
            <option value="ALL">All Time</option>
            <option value="TODAY">Today</option>
            <option value="WEEK">Last 7 Days</option>
            <option value="MONTH">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Transaction list */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">📭</span>
            </div>
            <p className="text-gray-600 font-medium mb-1">
              {searchQuery || dateFilter !== "ALL" || filter !== "ALL"
                ? "No transactions match your filters"
                : "No transactions yet"}
            </p>
            <p className="text-gray-400 text-sm">
              {searchQuery || dateFilter !== "ALL" || filter !== "ALL"
                ? "Try adjusting your filters"
                : "Create your first payment request to get started"}
            </p>
          </div>
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
                    {txn.note || "No note"}
                  </p>
                </div>
                <div className="text-right ml-2">
                  <div className="font-bold text-black text-sm sm:text-base">
                    ₹{txn.amount}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border mt-1 ${getStatusColor(txn.status)}`}
                  >
                    {getStatusIcon(txn.status)}
                    {txn.status}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs mt-2 pt-2 border-t border-gray-200">
                <button
                  onClick={() => handleCopyID(txn.id)}
                  className="text-gray-400 hover:text-yellow-600 transition-colors truncate text-left"
                  title="Click to copy full ID"
                >
                  {txn.id.slice(0, 8)}...
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">
                    {formatTime(txn.created_at)}
                  </span>

                  {/* Simulate button - only for PENDING */}
                  {txn.status === "PENDING" && (
                    <button
                      onClick={() => handleSimulatePayment(txn.id)}
                      className="px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-black text-xs rounded transition-colors"
                      title="Simulate Payment"
                    >
                      Test
                    </button>
                  )}

                  {/* Download PDF Receipt */}
                  <button
                    onClick={() => {
                      generatePDFReceipt(txn);
                      toast.success("Receipt downloaded! 📄");
                    }}
                    className="text-yellow-600 hover:text-yellow-700 transition-colors"
                    title="Download Receipt"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Results count and Live indicator */}
      <div className="mt-3 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Showing {filteredTransactions.length} of {transactions.length}{" "}
          transactions
        </span>
        {autoRefresh && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Auto-updating every 5s
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionList;