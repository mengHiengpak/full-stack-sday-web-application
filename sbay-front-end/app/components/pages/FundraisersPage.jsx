'use client';

const fundraisers = [
  { title: 'Protect the Rainforest', raised: '$12,450', goal: '$25,000', by: 'Earth Guardians', icon: 'fa-tree', color: '#22c55e', pct: 50 },
  { title: 'Ocean Plastic Clean-Up', raised: '$8,230', goal: '$15,000', by: 'Blue Allies', icon: 'fa-water', color: '#0ea5e9', pct: 55 },
  { title: 'Wildlife Rescue Center', raised: '$6,780', goal: '$20,000', by: 'Paw Foundation', icon: 'fa-paw', color: '#f59e0b', pct: 34 },
  { title: 'Community Garden Project', raised: '$3,210', goal: '$8,000', by: 'Green Neighbors', icon: 'fa-seedling', color: '#4ade80', pct: 40 },
  { title: 'Mountain Trail Restoration', raised: '$5,500', goal: '$12,000', by: 'Trail Keepers', icon: 'fa-mountain', color: '#a78bfa', pct: 46 },
];

export default function FundraisersPage({ toast }) {
  return (
    <div className="animate-[fadeIn_.3s_ease]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-[#2dd4bf] to-[#14b8a6] flex items-center justify-center text-white text-xl"><i className="fa-solid fa-hand-holding-heart" /></div>
        <div>
          <div className="font-[Sora] text-xl font-extrabold">Fundraisers</div>
          <div className="text-sm text-[var(--text3)]">Support causes you care about</div>
        </div>
      </div>
      <div className="space-y-3">
        {fundraisers.map((f, i) => (
          <div key={i} onClick={() => toast?.(`💚 Donated to ${f.title}`)} className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-4 cursor-pointer transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_4px_20px_rgba(0,0,0,.15)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-[12px] flex items-center justify-center text-white" style={{ background: f.color }}>
                <i className={`fa-solid ${f.icon}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold truncate">{f.title}</div>
                <div className="text-xs text-[var(--text3)]">by {f.by}</div>
              </div>
            </div>
            <div className="h-2.5 bg-[var(--bg3)] rounded-full overflow-hidden mb-2">
              <div className="h-full rounded-full transition-all" style={{ width: `${f.pct}%`, background: `linear-gradient(90deg, ${f.color}, ${f.color}88)` }} />
            </div>
            <div className="flex justify-between text-xs">
              <span className="font-bold text-[var(--text2)]">Raised: {f.raised}</span>
              <span className="text-[var(--text3)]">Goal: {f.goal}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
