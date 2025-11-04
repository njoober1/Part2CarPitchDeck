import React, { useState } from 'react';

interface PasswordOverlayProps {
  onSuccess: () => void;
}

const PasswordOverlay: React.FC<PasswordOverlayProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const lowerCasePassword = password.toLowerCase();
    const validPasswords = [
      'wicsif2025',
      'aaa',
      'itamarunderstandthepotentialandwantstoinvest',
      'itamar'
    ];

    if (validPasswords.includes(lowerCasePassword)) {
      setError('');
      onSuccess();
    } else {
      setError('Invalid access code. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[100]">
      <div className="glassmorphism rounded-xl p-8 max-w-sm w-full m-4 text-center">
        <h2 className="text-2xl font-bold mb-2 text-white">Access Restricted</h2>
        <p className="text-slate-400 mb-6">Please enter the access code to view this presentation.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter access code"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-center text-white focus:outline-none focus:ring-2 focus:ring-[#517AE5]"
              autoFocus
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#517AE5] hover:bg-[#4367c6] text-white font-semibold py-3 px-8 rounded-lg transition-transform duration-200 hover:scale-105"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordOverlay;