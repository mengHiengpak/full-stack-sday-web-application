'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useToast } from '@/app/components/Toast';
import { marketplaceAPI } from '@/app/lib/api';
import TopNav from '@/app/components/TopNav';
import Sidebar from '@/app/components/Sidebar';
import RightPanel from '@/app/components/RightPanel';
import BottomNav from '@/app/components/BottomNav';

const STORAGE_KEY = 'sbay_marketplace_items';

function loadLocal() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

const defaultItems = [
  { id: 'd1', title: 'Vintage Film Camera', price: '120', location: 'Phnom Penh', description: 'Classic film camera in great condition. Perfect for photography enthusiasts who appreciate the analog feel. Comes with a 50mm lens and leather case.', category: 'Electronics', image: '', createdAt: Date.now() - 86400000 * 3, seller: { id: 'u1', username: 'sophia.forest' } },
  { id: 'd2', title: 'Camping Tent 4P', price: '85', location: 'Siem Reap', description: 'Spacious 4-person tent, barely used. Waterproof and wind-resistant. Great for family camping trips. Includes poles, stakes, and carrying bag.', category: 'Outdoor', image: '', createdAt: Date.now() - 86400000 * 5, seller: { id: 'u2', username: 'ethan.rivers' } },
  { id: 'd3', title: 'Mountain Bike', price: '350', location: 'Battambang', description: 'Great condition mountain bike with 21-speed gears and disc brakes. Perfect for trails and city riding. Recently serviced.', category: 'Sports', image: '', createdAt: Date.now() - 86400000 * 2, seller: { id: 'u3', username: 'luna.meadow' } },
  { id: 'd4', title: 'Hiking Backpack 60L', price: '95', location: 'Kampot', description: 'Large 60-liter hiking backpack with multiple compartments. Comfortable straps and rain cover included. Used for one trip only.', category: 'Outdoor', image: '', createdAt: Date.now() - 86400000 * 4, seller: { id: 'u4', username: 'oliver.stone' } },
];

export default function MarketplaceDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace('/login'); return; }
    loadItem();
  }, [params.id, authLoading]);

  const loadItem = async () => {
    setLoading(true);
    try {
      const res = await marketplaceAPI.get(params.id);
      setItem(res.data.data);
    } catch {
      const local = loadLocal();
      const found = local.find((i) => i.id === params.id) || defaultItems.find((i) => i.id === params.id);
      if (found) setItem(found);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSeller = () => {
    setShowContact(true);
    toast?.('📬 Message sent to seller!');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!item) {
    return (
      <>
        <TopNav onOpenChat={() => router.push('/chat')} />
        <div className="flex pt-[56px] min-h-[calc(100vh-56px)]">
          <Sidebar toast={toast} onOpenDM={() => router.push('/chat')} activeView="" onViewChange={(v) => v === 'feed' ? router.push('/') : null} />
          <main className="flex-1 ml-[260px] mr-[300px] p-4 max-w-[680px] min-w-0 max-[1100px]:mr-0 max-[780px]:ml-0 max-[780px]:mb-[56px]">
            <div className="text-center py-16">
              <div className="text-5xl mb-4 text-[var(--text3)]"><i className="fa-solid fa-store-slash" /></div>
              <div className="text-lg font-bold text-[var(--text2)]">Item not found</div>
              <button onClick={() => router.push('/marketplace')} className="mt-4 px-5 py-2 bg-[var(--accent)] text-white text-sm font-semibold rounded-[10px] hover:bg-[var(--accent2)] transition-colors">Back to Marketplace</button>
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
            <button onClick={() => router.push('/marketplace')} className="flex items-center gap-2 text-sm text-[var(--text3)] hover:text-[var(--text)] mb-4 transition-colors">
              <i className="fa-solid fa-arrow-left" /> Back to Marketplace
            </button>

            <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] overflow-hidden">
              <div className="h-64 sm:h-80 flex items-center justify-center bg-[var(--bg3)] relative">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-[var(--text3)]">
                    <i className="fa-solid fa-image text-6xl opacity-30" />
                    <span className="text-sm">No image available</span>
                  </div>
                )}
                {item.category && (
                  <div className="absolute top-4 left-4 bg-black/60 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
                    {item.category}
                  </div>
                )}
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div className="flex-1">
                    <h1 className="font-[Sora] text-2xl font-extrabold text-[var(--text)]">{item.title}</h1>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-2xl font-extrabold text-[var(--accent3)]">${item.price}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleContactSeller}
                    className="px-6 py-3 bg-[var(--accent)] text-white text-sm font-bold rounded-[12px] hover:bg-[var(--accent2)] active:scale-[0.97] transition-all flex items-center gap-2 whitespace-nowrap"
                  >
                    <i className="fa-solid fa-message" /> Contact Seller
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text3)] mb-5 pb-4 border-b border-[var(--border)]">
                  <span><i className="fa-solid fa-location-dot mr-1.5" />{item.location}</span>
                  {item.seller && (
                    <span><i className="fa-regular fa-user mr-1.5" />{item.seller.username || 'Unknown Seller'}</span>
                  )}
                  <span><i className="fa-regular fa-clock mr-1.5" />Listed {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'recently'}</span>
                </div>

                {item.description && (
                  <div>
                    <h2 className="font-bold text-base text-[var(--text)] mb-2">Description</h2>
                    <p className="text-sm text-[var(--text2)] leading-relaxed whitespace-pre-line">{item.description}</p>
                  </div>
                )}
              </div>
            </div>

            {showContact && (
              <div className="mt-4 bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-4 animate-[fadeIn_.3s_ease]">
                <h3 className="font-bold text-sm mb-2">Contact Seller</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-bold text-sm">
                    {item.seller?.username?.slice(0, 2).toUpperCase() || '?'}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{item.seller?.username || 'Unknown'}</div>
                    <div className="text-xs text-[var(--text3)]">Usually responds within 1 hour</div>
                  </div>
                </div>
                <button onClick={() => { router.push('/chat'); toast?.('Chat opened with seller'); }} className="w-full py-2.5 bg-[var(--accent)] text-white text-xs font-bold rounded-[10px] hover:bg-[var(--accent2)] transition-all">Send Message</button>
              </div>
            )}
          </div>
        </main>
        <RightPanel toast={toast} />
      </div>
      <BottomNav onOpenChat={() => router.push('/chat')} toast={toast} onViewChange={(v) => v === 'feed' ? router.push('/') : null} />
    </>
  );
}