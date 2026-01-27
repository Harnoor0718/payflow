import { useState } from 'react';
import { QrCodeIcon } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

function PaymentForm({ onPaymentCreated }) {
  const [formData, setFormData] = useState({
    upi_id: 'college@upi',
    amount: '',
    payer_name: '',
    note: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [activeQR, setActiveQR] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.payer_name) {
      alert('Please fill in Payer Name and Amount');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setActiveQR(data.data);
        if (onPaymentCreated) onPaymentCreated(data.data);
        
        // Clear form
        setFormData({
          ...formData,
          amount: '',
          payer_name: '',
          note: ''
        });
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Failed to create payment: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border-2 border-black rounded-lg p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-black mb-4 flex items-center gap-2">
        <QrCodeIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        Create Payment Request
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            UPI ID
          </label>
          <input 
            type="text" 
            value={formData.upi_id}
            onChange={(e) => setFormData({...formData, upi_id: e.target.value})}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:border-yellow-400"
            placeholder="merchant@upi"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Payer Name *
          </label>
          <input 
            type="text" 
            value={formData.payer_name}
            onChange={(e) => setFormData({...formData, payer_name: e.target.value})}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:border-yellow-400"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Amount (₹) *
          </label>
          <input 
            type="number" 
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:border-yellow-400"
            placeholder="500"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Note
          </label>
          <input 
            type="text" 
            value={formData.note}
            onChange={(e) => setFormData({...formData, note: e.target.value})}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:border-yellow-400"
            placeholder="Membership Fee"
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-semibold py-3 sm:py-4 px-6 rounded-lg transition-colors text-sm sm:text-base"
        >
          {loading ? 'Creating...' : 'Generate QR Code'}
        </button>
      </form>

      {/* Active QR Display */}
      {activeQR && (
        <div className="mt-6 p-4 bg-purple-50 border-2 border-purple-300 rounded-lg">
          <h3 className="font-semibold text-purple-900 mb-3 text-center text-sm sm:text-base">
            Scan to Pay
          </h3>
          <div className="bg-white p-4 rounded-lg">
            <QRCodeSVG 
              value={activeQR.upi_string}
              size={200}
              level="H"
              className="mx-auto w-40 h-40 sm:w-48 sm:h-48"
            />
          </div>
          <div className="mt-3 text-center">
            <p className="text-sm font-medium text-black">
              {activeQR.payer_name} - ₹{activeQR.amount}
            </p>
            <p className="text-xs text-gray-600 mt-1">{activeQR.note}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium border border-purple-300">
              {activeQR.status}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentForm;