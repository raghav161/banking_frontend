import { BsFillShieldLockFill } from 'react-icons/bs';
import { CgSpinner } from 'react-icons/cg';
import OtpInput from 'otp-input-react';
import { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { auth } from '../../../firebase.config.js'; // Adjust path accordingly
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { toast, Toaster } from 'react-hot-toast';
import { Button } from '@/components/ui/button.jsx';

const PhoneOTPPage = () => {
  const [otp, setOtp] = useState('');
  const [ph, setPh] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
  const [phoneNumberValid, setPhoneNumberValid] = useState(false);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // Resolve any pending promise waiting for the reCAPTCHA response.
        }
      });

      setRecaptchaVerifier(verifier);
    }
  }, []);

  const handlePhoneInputChange = (value) => {
    if (value.length === 12) {
      setPhoneNumberValid(true);
    } else {
      setPhoneNumberValid(false);
    }
    setPh(value);
  };

  const onSignup = async () => {
    try {
      setLoading(true);

      if (!recaptchaVerifier) {
        toast.error('Recaptcha not initialized. Please refresh and try again.');
        setLoading(false);
        return;
      }

      const formatPh = '+' + ph;
      const confirmationResult = await signInWithPhoneNumber(auth, formatPh, recaptchaVerifier);
      window.confirmationResult = confirmationResult; // This line needs window object
      setLoading(false);
      setShowOTP(true);
      toast.success('OTP sent successfully!');
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error('Failed to send OTP. Please try again.');
    }
  };

  const onOTPVerify = async () => {
    setLoading(true);
    try {
      const result = await window.confirmationResult.confirm(otp); // This line needs window object
      setUser(result.user);
      setLoading(false);
      toast.success('Signup successful!');
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error('Wrong OTP. Please try again.');
      setOtp('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300">
      <div className="bg-black p-12 rounded-lg shadow-lg w-full max-w-md">
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>
        {user ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-80 flex flex-col gap-4 rounded-lg p-4">
              <h2 className="text-center font-medium text-2xl text-white">Mobile Number</h2>
              <input
                type="text"
                value={`+${ph}`}
                readOnly
                className="text-center border-none bg-transparent text-white"
              />
            </div>
            <div className="w-80 flex flex-col gap-4 rounded-lg p-4 text-white">
              <h2 className="text-center font-medium text-10l">✅ Verified</h2>
              <a
                href="http://localhost:3000/userid-pass"
                rel="noopener noreferrer"
                className="bg-white w-full flex gap-1 items-center justify-center py-2.5 text-black rounded mt-4"
              >
                Proceed to Next Step
              </a>
            </div>
          </div>
        ) : (
          <div className="w-80 flex flex-col gap-4 rounded-lg p-4">
            {showOTP ? (
              <>
                <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                  <BsFillShieldLockFill size={30} />
                </div>
                <label
                  htmlFor="otp"
                  className="font-bold text-xl text-white text-center"
                >
                  Enter your OTP
                </label>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  OTPLength={6}
                  otpType="number"
                  disabled={false}
                  autoFocus
                  className="opt-container"
                ></OtpInput>
                <Button
                  onClick={onOTPVerify}
                  variant='secondary'
                  size='lg'
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Verify OTP</span>
                </Button>
              </>
            ) : (
              <>
                <h1 className="text-center leading-normal text-white font-medium text-3xl mb-6 pl-1">
                  Enter Phone number
                </h1>
                <PhoneInput
                  country={'in'}
                  value={ph}
                  onChange={handlePhoneInputChange}
                  disableDropdown={true}
                />
                <Button
                  onClick={onSignup}
                  disabled={!phoneNumberValid}
                  variant='secondary'
                  size='lg'
                  style={{ width: '300px' }}
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Send OTP</span>
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneOTPPage;
