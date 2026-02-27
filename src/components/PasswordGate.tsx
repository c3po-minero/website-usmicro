'use client';

import { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';

const STORAGE_KEY = 'usmp_authenticated';
const CORRECT_PASSWORD = 'usmicro2026';

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'true') {
      setAuthenticated(true);
    }
    setLoading(false);
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ backgroundColor: '#0a1628' }} />
    );
  }

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4" style={{ backgroundColor: '#0a1628' }}>
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <Image
            src="/images/logos/USMP-horizontal.svg"
            alt="US Micro Products"
            width={180}
            height={43}
            priority
            className="h-10 w-auto"
          />
        </div>
        <p className="text-sm text-gray-500 mb-6">Enter the password to access this site.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            placeholder="Password"
            autoFocus
            className={`w-full px-4 py-3 text-sm border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-blue-mid focus:border-blue-mid ${
              error ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
          />
          {error && (
            <p className="text-xs text-red-500 -mt-2">Incorrect password. Please try again.</p>
          )}
          <button
            type="submit"
            className="w-full px-4 py-3 text-sm font-semibold text-white rounded-lg transition-colors"
            style={{ backgroundColor: '#0a1628' }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1a3a5c')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#0a1628')}
          >
            Enter Site
          </button>
        </form>
      </div>
    </div>
  );
}
