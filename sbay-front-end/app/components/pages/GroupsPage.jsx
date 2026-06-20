'use client';

const groups = [
  { name: 'Nature Photographers', members: '12.4k', icon: 'fa-camera', color: '#4ade80', desc: 'Share your best nature shots' },
  { name: 'Forest Bathing Club', members: '3.2k', icon: 'fa-tree', color: '#22c55e', desc: 'Reconnect with the woods' },
  { name: 'Ocean Conservancy', members: '8.7k', icon: 'fa-water', color: '#0ea5e9', desc: 'Protecting marine life' },
  { name: 'Mountain Hikers', members: '6.1k', icon: 'fa-mountain', color: '#a78bfa', desc: 'Trails and summits' },
  { name: 'Bird Watchers United', members: '4.5k', icon: 'fa-dove', color: '#f59e0b', desc: 'Feathered friends forever' },
  { name: 'Campfire Stories', members: '2.8k', icon: 'fa-fire', color: '#f97316', desc: 'Tales from the wilderness' },
];

export default function GroupsPage({ toast }) {
  return (
    <div className="animate-[fadeIn_.3s_ease]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-[#4ade80] to-[#22c55e] flex items-center justify-center text-white text-xl"><i className="fa-solid fa-users-line" /></div>
        <div>
          <div className="font-[Sora] text-xl font-extrabold">Groups</div>
          <div className="text-sm text-[var(--text3)]">Discover communities you&apos;ll love</div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {groups.map((g, i) => (
          <div key={i} onClick={() => toast?.(`📋 Joined ${g.name}`)} className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-4 cursor-pointer transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_30px_rgba(0,0,0,.2)]">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-11 h-11 rounded-[14px] flex items-center justify-center text-white text-lg" style={{ background: g.color }}>
                <i className={`fa-solid ${g.icon}`} />
              </div>
              <div>
                <div className="font-bold text-sm text-[var(--text)]">{g.name}</div>
                <div className="text-xs text-[var(--text3)]">{g.members} members</div>
              </div>
            </div>
            <div className="text-xs text-[var(--text2)] leading-relaxed">{g.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
