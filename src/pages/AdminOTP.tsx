import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';

const AdminOTP: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  useEffect(() => {
    if (!email) {
      navigate('/panel/login');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(digit => digit !== '') && newOtp.length === 6) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) {
      return;
    }

    const newOtp = pastedData.split('');
    while (newOtp.length < 6) {
      newOtp.push('');
    }
    setOtp(newOtp);

    if (pastedData.length === 6) {
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (otpCode: string) => {
    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // For demo: accept any 6-digit OTP
      if (otpCode.length === 6) {
        // Store auth token in localStorage
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('adminEmail', email);
        navigate('/panel');
      } else {
        setError('Invalid OTP. Please try again.');
      }
    }, 1500);
  };

  const handleResend = () => {
    if (!canResend) return;
    
    setCanResend(false);
    setResendTimer(30);
    setOtp(['', '', '', '', '', '']);
    setError('');
    inputRefs.current[0]?.focus();
    
    // Here you would call your API to resend OTP
    console.log('Resending OTP to:', email);
  };

  const handleBack = () => {
    navigate('/panel/login');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* OTP Card */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-[#1b981b] p-8 md:p-12">
          {/* Back button */}
          <button
            onClick={handleBack}
            className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-[#1b981b] transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <img 
                src="https://res.cloudinary.com/dn2sab6qc/image/upload/v1770564631/recycle_my_device_transparent_z6ra8s.png" 
                alt="Recycle My Device" 
                className="h-16 w-auto"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Verify OTP</h1>
            <p className="text-gray-600">
              Enter the code sent to
              <br />
              <span className="font-semibold text-gray-800">{email}</span>
            </p>
          </div>

          {/* OTP Input */}
          <div className="mb-6">
            <div className="flex justify-center space-x-3 mb-4" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={isLoading}
                  className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] transition-all duration-200 disabled:opacity-50"
                />
              ))}
            </div>
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-5 h-5 border-2 border-[#1b981b] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">Verifying...</span>
            </div>
          )}

          {/* Resend OTP */}
          <div className="text-center">
            {canResend ? (
              <button
                onClick={handleResend}
                className="inline-flex items-center space-x-2 text-[#1b981b] hover:text-[#157a15] transition-colors duration-200 font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Resend OTP</span>
              </button>
            ) : (
              <p className="text-sm text-gray-600">
                Resend OTP in <span className="font-semibold text-gray-800">{resendTimer}s</span>
              </p>
            )}
          </div>

          {/* Info */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Didn't receive the code? Check your spam folder
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOTP;
