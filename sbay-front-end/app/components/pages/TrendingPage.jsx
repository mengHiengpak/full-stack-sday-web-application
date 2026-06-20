'use client';

const trends = [
  { tag: '#ForestFriday', posts: '2.4K', icon: 'fa-tree', color: '#22c55e' },
  { tag: '#OceanWeek', posts: '1.8K', icon: 'fa-water', color: '#0ea5e9' },
  { tag: '#WildlifeWonder', posts: '3.2K', icon: 'fa-paw', color: '#f59e0b' },
  { tag: '#SunriseChasers', posts: '1.5K', icon: 'fa-sun', color: '#f97316' },
  { tag: '#CleanEarth', posts: '4.1K', icon: 'fa-hand-sparkles', color: '#4ade80' },
  { tag: '#MountainVibes', posts: '2.9K', icon: 'fa-mountain', color: '#a78bfa' },
  { tag: '#CampfireStories', posts: '1.1K', icon: 'fa-fire', color: '#ef4444' },
  { tag: '#Stargazers', posts: '2.7K', icon: 'fa-star', color: '#6366f1' },
];

export default function TrendingPage({ toast }) {
  return (
    <div className="animate-[fadeIn_.3s_ease]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-[#f59e0b] to-[#f97316] flex items-center justify-center text-white text-xl"><i className="fa-solid fa-fire-flame-curved" /></div>
        <div>
          <div className="font-[Sora] text-xl font-extrabold">Trending Now</div>
          <div className="text-sm text-[var(--text3)]">What&apos;s popular on Sbay</div>
        </div>
      </div>
      <div className="space-y-2">
        {trends.map((t, i) => (
          <div key={i} onClick={() => toast?.(`🔥 Exploring ${t.tag}`)} className="flex items-center gap-3.5 bg-[var(--card)] border border-[var(--border)] rounded-[14px] p-3.5 cursor-pointer transition-all duration-200 hover:bg-[var(--card2)] hover:-translate-y-[1px]">
            <div className="w-10 h-10 rounded-[12px] flex items-center justify-center text-white flex-shrink-0" style={{ background: t.color }}>
              <i className={`fa-solid ${t.icon}`} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-[var(--accent)]">{t.tag}</div>
              <div className="text-xs text-[var(--text3)]">{t.posts} posts today</div>
            </div>
            <i className="fa-solid fa-chevron-right text-[var(--text3)] text-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
