'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import TopNav from '@/app/components/TopNav';
import Sidebar from '@/app/components/Sidebar';
import RightPanel from '@/app/components/RightPanel';
import BottomNav from '@/app/components/BottomNav';

export default function ReelsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return null;

  return (
    <>
      <TopNav />
      <div className="flex pt-[56px] min-h-[calc(100vh-56px)]">
        <Sidebar />
        <main className="flex-1 ml-[260px] mr-[300px] p-4 max-w-[680px] min-w-0 max-[1100px]:mr-0 max-[780px]:ml-0 max-[780px]:mb-[56px]">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-[var(--bg3)] flex items-center justify-center mb-4">
              <i className="fa-solid fa-video text-3xl text-[var(--text3)]" />
            </div>
            <div className="font-[Sora] text-xl font-bold text-[var(--text)] mb-2">No Reels Yet</div>
            <div className="text-sm text-[var(--text3)] max-w-xs">Reels are not available right now. Check back later!</div>
          </div>
        </main>
        <RightPanel />
      </div>
      <BottomNav />
    </>
  );
}
