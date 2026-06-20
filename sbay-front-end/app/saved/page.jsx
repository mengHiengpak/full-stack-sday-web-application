'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useToast } from '@/app/components/Toast';
import TopNav from '@/app/components/TopNav';
import Sidebar from '@/app/components/Sidebar';
import RightPanel from '@/app/components/RightPanel';
import BottomNav from '@/app/components/BottomNav';
import SavedPage from '@/app/components/pages/SavedPage';

export default function SavedRoute() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const toast = useToast();

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) { router.replace('/login'); return null; }

  return (
    <>
      <TopNav onOpenChat={() => router.push('/chat')} />
      <div className="flex pt-[56px] min-h-[calc(100vh-56px)]">
        <Sidebar toast={toast} onOpenDM={() => router.push('/chat')} activeView="" onViewChange={(v) => v === 'feed' ? router.push('/') : null} />
        <main className="flex-1 ml-[260px] mr-[300px] p-4 max-w-[680px] min-w-0 max-[1100px]:mr-0 max-[780px]:ml-0 max-[780px]:mb-[56px]">
          <SavedPage toast={toast} />
        </main>
        <RightPanel toast={toast} />
      </div>
      <BottomNav onOpenChat={() => router.push('/chat')} toast={toast} onViewChange={(v) => v === 'feed' ? router.push('/') : null} />
    </>
  );
}
