import { useState } from 'react';
import Dashboard from './components/Dashboard';
import PaymentForm from './components/PaymentForm';
import TransactionList from './components/TransactionList';
import ErrorBoundary from './components/ErrorBoundary';
import NetworkStatus from './components/NetworkStatus';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePaymentCreated = () => {
    // Trigger refresh of transaction list when new payment is created
    setRefreshKey(prev => prev + 1);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white">
        {/* Header - Responsive padding */}
        <header className="bg-black text-white p-4 sm:p-6 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">PayFlow</h1>
            <p className="text-gray-300 text-xs sm:text-sm mt-1">
              Automated Payment Tracking System
            </p>
          </div>
        </header>

        {/* Main Content - Responsive container */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          
          {/* Dashboard Stats - Auto-updates */}
          <Dashboard />

          {/* Two Column Layout - Stack on mobile, side-by-side on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Left Column - Payment Form */}
            <PaymentForm onPaymentCreated={handlePaymentCreated} />

            {/* Right Column - Transaction List */}
            <TransactionList refresh={refreshKey} />
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-black text-white text-center py-4 mt-8">
          <p className="text-xs sm:text-sm text-gray-400">
            PayFlow - Built for seamless payment tracking
          </p>
        </footer>

        {/* Network Status Indicator */}
        <NetworkStatus />
      </div>
    </ErrorBoundary>
  );
}

export default App;