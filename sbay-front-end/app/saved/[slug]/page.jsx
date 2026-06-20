'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useToast } from '@/app/components/Toast';
import { getCollection } from '@/app/lib/savedData';
import TopNav from '@/app/components/TopNav';
import Sidebar from '@/app/components/Sidebar';
import RightPanel from '@/app/components/RightPanel';
import BottomNav from '@/app/components/BottomNav';

export default function SavedDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const [collection, setCollection] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace('/login'); return; }
    const col = getCollection(params.slug);
    if (col) setCollection(col);
  }, [params.slug, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!collection) {
    return (
      <>
        <TopNav onOpenChat={() => router.push('/chat')} />
        <div className="flex pt-[56px] min-h-[calc(100vh-56px)]">
          <Sidebar toast={toast} onOpenDM={() => router.push('/chat')} activeView="" onViewChange={(v) => v === 'feed' ? router.push('/') : null} />
          <main className="flex-1 ml-[260px] mr-[300px] p-4 max-w-[680px] min-w-0 max-[1100px]:mr-0 max-[780px]:ml-0 max-[780px]:mb-[56px]">
            <div className="text-center py-16">
              <div className="text-5xl mb-4 text-[var(--text3)]"><i className="fa-regular fa-bookmark" /></div>
              <div className="text-lg font-bold text-[var(--text2)]">Collection not found</div>
              <button onClick={() => router.push('/saved')} className="mt-4 px-5 py-2 bg-[var(--accent)] text-white text-sm font-semibold rounded-[10px] hover:bg-[var(--accent2)] transition-colors">Back to Saved</button>
            </div>
          </main>
          <RightPanel toast={toast} />
        </div>
        <BottomNav onOpenChat={() => router.push('/chat')} toast={toast} onViewChange={(v) => v === 'feed' ? router.push('/') : null} />
      </>
    );
  }

  return (
    <>
      <TopNav onOpenChat={() => router.push('/chat')} />
      <div className="flex pt-[56px] min-h-[calc(100vh-56px)]">
        <Sidebar toast={toast} onOpenDM={() => router.push('/chat')} activeView="" onViewChange={(v) => v === 'feed' ? router.push('/') : null} />
        <main className="flex-1 ml-[260px] mr-[300px] p-4 max-w-[680px] min-w-0 max-[1100px]:mr-0 max-[780px]:ml-0 max-[780px]:mb-[56px]">
          <div className="animate-[fadeIn_.3s_ease]">
            <button onClick={() => router.push('/saved')} className="flex items-center gap-2 text-sm text-[var(--text3)] hover:text-[var(--text)] mb-4 transition-colors">
              <i className="fa-solid fa-arrow-left" /> Back to Saved
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-[16px] flex items-center justify-center text-white text-xl" style={{ background: collection.color }}>
                <i className={`fa-solid ${collection.icon}`} />
              </div>
              <div>
                <div className="font-[Sora] text-xl font-extrabold">{collection.name}</div>
                <div className="text-sm text-[var(--text3)]">{collection.count} items · {collection.description}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {collection.items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className="group bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_30px_rgba(0,0,0,.2)]"
                >
                  <div className="h-40 overflow-hidden bg-[var(--bg3)]">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <div className="p-3">
                    <div className="font-bold text-sm">{item.title}</div>
                    {item.desc && (
                      <div className="text-xs text-[var(--text2)] mt-0.5 line-clamp-1">{item.desc}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selected && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
              <div className="absolute inset-0 bg-black/80" />
              <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setSelected(null)} className="absolute -top-10 right-0 text-white/70 hover:text-white text-lg z-10">
                  <i className="fa-solid fa-xmark" />
                </button>
                <div className="bg-[var(--bg2)] rounded-2xl overflow-hidden shadow-2xl">
                  <div className="max-h-[60vh] overflow-hidden bg-black">
                    <img src={selected.image} alt={selected.title} className="w-full h-full object-contain" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-[Sora] font-bold text-lg">{selected.title}</h3>
                    <p className="text-sm text-[var(--text2)] mt-1">{selected.desc}</p>
                    <button
                      onClick={() => { toast?.('💾 Saved to collection'); setSelected(null); }}
                      className="mt-4 px-5 py-2 bg-[var(--accent)] text-white text-sm font-semibold rounded-[10px] hover:bg-[var(--accent2)] transition-all"
                    >
                      <i className="fa-regular fa-bookmark mr-1.5" />Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
        <RightPanel toast={toast} />
      </div>
      <BottomNav onOpenChat={() => router.push('/chat')} toast={toast} onViewChange={(v) => v === 'feed' ? router.push('/') : null} />
    </>
  );
}