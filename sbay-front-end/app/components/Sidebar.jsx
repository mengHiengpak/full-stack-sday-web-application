'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

const menuItems = [
  { icon: 'fa-house', label: 'Home Feed', view: 'feed' },
  { icon: 'fa-compass', label: 'Explore', view: 'explore' },
  { icon: 'fa-comment', label: 'Messages', view: 'chat' },
  { icon: 'fa-user', label: 'Profile', view: 'profile' },
  { icon: 'fa-circle-plus', label: 'Upload', view: 'upload' },
  { icon: 'fa-satellite-dish', label: 'Sbay Live', view: 'live', count: 'LIVE', countStyle: '#ef4444', iconColor: '#ef4444' },
  { icon: 'fa-video', label: 'Reels & Videos', view: 'reels', iconColor: '#fb923c' },
  { icon: 'fa-fire-flame-curved', label: 'Trending Now', view: 'trending', iconColor: '#f59e0b' },
  { icon: 'fa-users-line', label: 'Groups', view: 'groups', iconColor: '#60a5fa' },
  { icon: 'fa-store', label: 'Marketplace', view: 'marketplace', iconColor: '#34d399' },
  { icon: 'fa-calendar-days', label: 'Events', view: 'events', iconColor: '#a78bfa' },
  { icon: 'fa-bookmark', label: 'Saved', view: 'saved', iconColor: '#f472b6' },
];

const discoverItems = [
  { icon: 'fa-clapperboard', label: 'Reels', view: 'reels' },
  { icon: 'fa-music', label: 'Music', view: 'music', color: '#c084fc' },
  { icon: 'fa-gamepad', label: 'Gaming', view: 'gaming', color: '#4ade80' },
  { icon: 'fa-newspaper', label: 'News', view: 'news', color: '#94a3b8' },
  { icon: 'fa-photo-film', label: 'Memories', view: 'memories', color: '#fbbf24' },
  { icon: 'fa-gift', label: 'Birthdays', view: 'birthdays', color: '#f87171' },
  { icon: 'fa-handshake-angle', label: 'Fundraisers', view: 'fundraisers', color: '#2dd4bf' },
];

export default function Sidebar({ toast, onOpenDM, activeView, onViewChange }) {
  const router = useRouter();
  const { user } = useAuth();

  const routeViews = ['profile', 'chat', 'reels', 'upload', 'trending', 'groups', 'marketplace', 'events', 'saved'];

  const handleClick = (item) => {
    if (routeViews.includes(item.view)) {
      const routes = { profile: `/profile/${user?.id}`, chat: '/chat', reels: '/reels', upload: '/upload', trending: '/trending', groups: '/groups', marketplace: '/marketplace', events: '/events', saved: '/saved' };
      router.push(routes[item.view]);
      return;
    }
    onViewChange?.(item.view || 'feed');
  };

  const renderItem = (item, idx) => (
    <div
      key={idx}
      onClick={() => handleClick(item)}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors ${
        (item.view && activeView === item.view) ? 'bg-[var(--bg3)] text-[var(--accent)]' : 'text-[var(--text2)] hover:bg-[var(--bg3)] hover:text-[var(--text)]'
      }`}
    >
      <i className={`fa-solid ${item.icon} w-5 text-center text-base`} style={item.iconColor ? { color: item.iconColor } : {}} />
      <span>{item.label}</span>
      {item.count && (
        <span className="ml-auto text-white rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ background: item.countStyle || 'var(--accent)' }}>
          {item.count}
        </span>
      )}
    </div>
  );

  return (
    <aside className="w-[260px] fixed top-[56px] left-0 bottom-0 bg-[var(--bg2)] border-r border-[var(--border)] overflow-y-auto p-4 flex flex-col gap-0.5 max-[780px]:hidden">
      <div className="mb-4">
        <div className="text-[11px] font-semibold uppercase text-[var(--text3)] px-3 pb-2">Menu</div>
        {menuItems.map(renderItem)}
      </div>
      <div className="h-px bg-[var(--border)] mx-3 my-2" />
      <div className="mt-4">
        <div className="text-[11px] font-semibold uppercase text-[var(--text3)] px-3 pb-2">Discover</div>
        {discoverItems.map(renderItem)}
      </div>
    </aside>
  );
}
