"use client"
import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function EmailOTPPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [step, setStep] = useState(1);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');

  useEffect(() => {
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJSINIT);
  }, []);

  const validateEmail = (email) => {
    let r = /\S+@\S+\.\S+/;
    return r.test(email);
  };

  const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const sendOTP = () => {
    if (validateEmail(email)) {
      const otp = generateOTP();
      setGeneratedOtp(otp);

      const templateParams = {
        from_name: 'Bank official',
        OTP: otp,
        message: "Please don&apos;t share this otp with anyone",
        reply_to: email,
      };

      emailjs.send(process.env.NEXT_PUBLIC_EMAILJS_SERVICE_KEY, process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_KEY, templateParams)
        .then((response) => {
          console.log('SUCCESS!', response.status, response.text);
          setStep(2);
        }, (err) => {
          console.log('FAILED...', err);
        });
    } else {
      alert('Invalid email address');
    }
  };

  const verifyOTP = () => {
    if (otp === generatedOtp) {
      setEmailVerified(true);
      setVerifiedEmail(email); // Store verified email
      setStep(3);
    } else {
      alert('Wrong OTP');
      setOtp('');
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300">
      {step === 1 && (
        <div className="bg-black p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-white">Enter email address</h1>
          <div className="form-group mb-6">
            <input
              type="email"
              value={email}
              placeholder="Email Address"
              onChange={handleEmailChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white"
            />
            {emailVerified && <span className="text-white mt-2 block">✅ Verified: {verifiedEmail}</span>}
          </div>
          <div className='flex justify-center'>
            <Button
              onClick={sendOTP}
              variant='secondary'
              size='lg'
            >
              Send OTP
            </Button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="bg-black p-8 rounded-lg shadow-lg w-full max-w-md">
          <p className="text-center text-white mb-6">Enter the 4-digit OTP sent to your email</p>
          <div className="otp-group mb-6">
            <input
              type="text"
              value={otp}
              maxLength="4"
              onChange={handleOtpChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-center"
            />
          </div>
          <p className="text-center mb-6 text-white">
            Not your email or didn&apos;t receive the OTP? 
            <a href="#" onClick={() => setStep(1)} className="text-white"> Try again</a>
          </p>
          <div className='flex justify-center'>
            <Button
              onClick={verifyOTP}
              variant='secondary'
              size='lg'
            >
              Verify OTP
            </Button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <p className="text-center text-black mb-6">{verifiedEmail}</p>
          <p className="text-center">✅ Verified</p>
          <Link
            href="/phone-otp"
            rel="noopener noreferrer"
            className="bg-black w-full flex gap-1 items-center justify-center py-2.5 text-white rounded mt-4"
          >
            Continue
          </Link>
        </div>
      )}
    </div>
  );
}
