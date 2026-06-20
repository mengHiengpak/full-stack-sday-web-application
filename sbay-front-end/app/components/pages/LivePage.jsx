'use client';

const streams = [
  { title: 'Bird Nest Live Cam', viewer: '1.2K', host: 'Wildlife Trust', icon: 'fa-dove', color: '#22c55e', live: true },
  { title: 'Sunrise Over Mekong', viewer: '854', host: 'Travel Cambodia', icon: 'fa-sun', color: '#f97316', live: true },
  { title: 'Forest Rain Sounds', viewer: '2.1K', host: 'Nature ASMR', icon: 'fa-cloud-rain', color: '#0ea5e9', live: true },
  { title: 'Mountain Summit View', viewer: '567', host: 'Hike Cambodia', icon: 'fa-mountain', color: '#a78bfa', live: true },
  { title: 'Coral Reef Dive', viewer: '3.4K', host: 'Ocean Explorers', icon: 'fa-water', color: '#06b6d4', live: true },
  { title: 'Night Sky Stream', viewer: '423', host: 'Astro Cambodia', icon: 'fa-star', color: '#6366f1', live: true },
];

export default function LivePage({ toast }) {
  return (
    <div className="animate-[fadeIn_.3s_ease]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-[16px] bg-[#ef4444] flex items-center justify-center text-white text-xl"><i className="fa-solid fa-satellite-dish" /></div>
        <div>
          <div className="font-[Sora] text-xl font-extrabold">Sbay Live</div>
          <div className="text-sm text-[var(--text3)]">Live streams from around the world</div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {streams.map((s, i) => (
          <div key={i} onClick={() => toast?.(`📺 Watching: ${s.title}`)} className="relative bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_12px_40px_rgba(0,0,0,.25)] group">
            <div className="h-44 flex items-center justify-center text-5xl" style={{ background: `linear-gradient(135deg, ${s.color}22, transparent)` }}>
              <i className={`fa-solid ${s.icon}`} style={{ color: s.color }} />
            </div>
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#ef4444] text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />LIVE
            </div>
            <div className="absolute top-3 right-3 bg-black/60 text-white text-[11px] px-2 py-1 rounded-full flex items-center gap-1">
              <i className="fa-solid fa-eye" />{s.viewer}
            </div>
            <div className="p-3.5">
              <div className="text-sm font-bold truncate">{s.title}</div>
              <div className="text-xs text-[var(--text3)]">{s.host}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
