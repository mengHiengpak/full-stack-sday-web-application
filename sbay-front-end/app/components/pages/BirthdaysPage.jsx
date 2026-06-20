'use client';

const birthdays = [
  { name: 'Sophia Nature', date: 'Today', icon: 'fa-camera', color: '#4ade80' },
  { name: 'Ethan Rivers', date: 'Tomorrow', icon: 'fa-water', color: '#0ea5e9' },
  { name: 'Luna Meadow', date: 'Jun 12', icon: 'fa-spa', color: '#a78bfa' },
  { name: 'Oliver Stone', date: 'Jun 15', icon: 'fa-mountain', color: '#f97316' },
  { name: 'Aria Sky', date: 'Jun 18', icon: 'fa-cloud', color: '#06b6d4' },
  { name: 'Noah Forest', date: 'Jun 22', icon: 'fa-tree', color: '#22c55e' },
];

export default function BirthdaysPage({ toast }) {
  return (
    <div className="animate-[fadeIn_.3s_ease]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-[#f87171] to-[#ef4444] flex items-center justify-center text-white text-xl"><i className="fa-solid fa-gift" /></div>
        <div>
          <div className="font-[Sora] text-xl font-extrabold">Birthdays</div>
          <div className="text-sm text-[var(--text3)]">Celebrate with friends</div>
        </div>
      </div>
      <div className="space-y-2">
        {birthdays.map((b, i) => (
          <div key={i} onClick={() => toast?.(`🎂 Wish ${b.name} a happy birthday!`)} className="flex items-center gap-3.5 bg-[var(--card)] border border-[var(--border)] rounded-[14px] p-3.5 cursor-pointer transition-all duration-200 hover:bg-[var(--card2)] hover:-translate-y-[1px]">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: b.color }}>
              <i className="fa-solid fa-cake-candles" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold">{b.name}</div>
              <div className="text-xs text-[var(--text3)]"><span className={b.date === 'Today' ? 'text-[var(--accent3)] font-semibold' : ''}>{b.date}</span></div>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-[var(--accent3)] to-[#06b6d4] text-white text-xs font-bold rounded-[10px] hover:scale-105 active:scale-95 transition-all">🎉 Wish</button>
          </div>
        ))}
      </div>
    </div>
  );
}
