'use client';

const games = [
  { title: 'Forest Quest', players: '2.1k', icon: 'fa-tree', color: '#22c55e' },
  { title: 'Ocean Explorer', players: '1.8k', icon: 'fa-ship', color: '#0ea5e9' },
  { title: 'Wild Safari Run', players: '3.4k', icon: 'fa-paw', color: '#f59e0b' },
  { title: 'Mountain Climber', players: '1.2k', icon: 'fa-mountain', color: '#a78bfa' },
  { title: 'Garden Tycoon', players: '4.7k', icon: 'fa-seedling', color: '#4ade80' },
  { title: 'Arctic Adventure', players: '960', icon: 'fa-snowflake', color: '#06b6d4' },
];

export default function GamingPage({ toast }) {
  return (
    <div className="animate-[fadeIn_.3s_ease]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-[#4ade80] to-[#06b6d4] flex items-center justify-center text-white text-xl"><i className="fa-solid fa-gamepad" /></div>
        <div>
          <div className="font-[Sora] text-xl font-extrabold">Gaming</div>
          <div className="text-sm text-[var(--text3)]">Play with friends</div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {games.map((g, i) => (
          <div key={i} onClick={() => toast?.(`🎮 Playing ${g.title}`)} className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-4 cursor-pointer transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_30px_rgba(0,0,0,.2)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-[14px] flex items-center justify-center text-white text-lg" style={{ background: g.color }}>
                <i className={`fa-solid ${g.icon}`} />
              </div>
              <div>
                <div className="font-bold text-sm">{g.title}</div>
                <div className="text-xs text-[var(--text2)]">{g.players} playing now</div>
              </div>
            </div>
            <button className="w-full py-2.5 bg-[var(--accent)] text-white text-xs font-bold rounded-[12px] hover:bg-[#5855d6] hover:-translate-y-[1px] active:scale-[0.97] transition-all">Play Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}
