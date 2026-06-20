'use client';

const memories = [
  { year: '2023', text: 'You went hiking at Kulen Mountain', icon: 'fa-mountain', color: '#22c55e' },
  { year: '2022', text: 'You joined a beach clean-up in Sihanoukville', icon: 'fa-hand-sparkles', color: '#0ea5e9' },
  { year: '2021', text: 'You planted 50 trees with the community', icon: 'fa-seedling', color: '#4ade80' },
  { year: '2020', text: 'You spotted a hornbill for the first time', icon: 'fa-dove', color: '#f59e0b' },
  { year: '2019', text: 'You camped under the stars in Ratanakiri', icon: 'fa-campground', color: '#f97316' },
];

export default function MemoriesPage({ toast }) {
  return (
    <div className="animate-[fadeIn_.3s_ease]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] flex items-center justify-center text-white text-xl"><i className="fa-solid fa-clock-rotate-left" /></div>
        <div>
          <div className="font-[Sora] text-xl font-extrabold">Memories</div>
          <div className="text-sm text-[var(--text3)]">Relive your moments</div>
        </div>
      </div>
      <div className="space-y-3">
        {memories.map((m, i) => (
          <div key={i} onClick={() => toast?.(`📸 Remember: ${m.text}`)} className="flex items-start gap-4 bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-4 cursor-pointer transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_4px_20px_rgba(0,0,0,.15)]">
            <div className="w-10 h-10 rounded-[12px] flex items-center justify-center text-white flex-shrink-0 mt-0.5" style={{ background: m.color }}>
              <i className={`fa-solid ${m.icon}`} />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-[var(--accent)]">{m.year}</div>
              <div className="text-sm text-[var(--text2)] mt-0.5">{m.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
