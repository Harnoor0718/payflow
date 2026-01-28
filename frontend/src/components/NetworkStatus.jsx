import { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOffline, setShowOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showOffline) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-fadeIn">
      <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 border-2 border-red-700">
        <WifiOff className="w-4 h-4" />
        <span className="text-sm font-medium">No internet connection</span>
      </div>
    </div>
  );
}

export default NetworkStatus;