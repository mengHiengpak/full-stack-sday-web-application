'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace('/');
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('All fields are required'); return; }
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const demoUser = {
      id: 'demo_user',
      username: 'DemoUser',
      email: 'demo@sbay.com',
      profilePicture: '',
      bio: 'Hello! I am a demo user. Let us connect!',
    };
    localStorage.setItem('sbay_token', 'demo_token');
    localStorage.setItem('sbay_demo_user', JSON.stringify(demoUser));
    updateUser(demoUser);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 shadow-sm">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 rounded bg-[var(--accent)] flex items-center justify-center text-white font-[Sora] font-bold text-base">S</div>
            <span className="font-[Sora] font-bold text-xl text-[var(--text)]">Sbay</span>
          </div>
          <p className="text-sm text-[var(--text3)]">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-[#ffebe8] border border-[#dd3c10] text-[#dd3c10] text-sm rounded px-3 py-2 mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--bg2)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
              placeholder="Email address"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[var(--bg2)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--accent)] hover:bg-[var(--accent2)] text-white font-bold text-sm rounded px-3 py-2 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--text3)] mt-4">
          <Link href="/register" className="text-[var(--accent)] hover:underline">Create new account</Link>
        </p>
      </div>
    </div>
  );
}
