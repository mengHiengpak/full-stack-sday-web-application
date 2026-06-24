'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import MemoriesPage from '@/app/components/pages/MemoriesPage';
import TopNav from '@/app/components/TopNav';
import Sidebar from '@/app/components/Sidebar';
import RightPanel from '@/app/components/RightPanel';
import BottomNav from '@/app/components/BottomNav';

export default function MemoriesRoutePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  if (loading) return <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center"><div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return null;

  return (
    <>
      <TopNav />
      <div className="flex pt-[56px] min-h-[calc(100vh-56px)]">
        <Sidebar />
        <main className="flex-1 ml-[260px] mr-[300px] p-4 max-w-[680px] min-w-0 max-[1100px]:mr-0 max-[780px]:ml-0 max-[780px]:mb-[56px]">
          <MemoriesPage />
        </main>
        <RightPanel />
      </div>
      <BottomNav />
    </>
  );
}
