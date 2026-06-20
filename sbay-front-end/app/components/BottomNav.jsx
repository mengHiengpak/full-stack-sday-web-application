 'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BottomNav({ onOpenChat, toast, onViewChange }) {
  const router = useRouter();
  const [active, setActive] = useState('Home');
  const items = [
    { icon: 'fa-house', label: 'Home', view: 'feed' },
    { icon: 'fa-compass', label: 'Explore', view: 'explore' },
    { icon: 'fa-satellite-dish', label: 'Live', view: 'live', live: true },
    { icon: 'fa-circle-plus', label: 'Upload' },
    { icon: 'fa-message', label: 'Chat' },
  ];

  return (
    <div className="hidden max-[780px]:flex fixed bottom-0 left-0 right-0 z-[100] bg-[var(--bg2)] border-t border-[var(--border)] py-1 pb-2 justify-around shadow-sm">
      {items.map((item, i) => (
        <div
          key={i}
          onClick={() => {
            setActive(item.label);
            if (item.label === 'Upload') { router.push('/upload'); return; }
            if (item.label === 'Chat') { router.push('/chat'); return; }
            if (item.view) onViewChange?.(item.view);
          }}
          className={`flex flex-col items-center gap-0.5 px-4 py-1 cursor-pointer text-[10px] ${active === item.label ? 'text-[var(--accent)]' : 'text-[var(--text3)]'}`}
        >
          <i className={`fa-solid ${item.icon} text-lg`} style={item.live ? { color: '#ef4444' } : {}} />
          {item.label}
        </div>
      ))}
    </div>
  );
}
