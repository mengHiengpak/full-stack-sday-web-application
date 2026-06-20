'use client';

const events = [
  { title: 'Sunrise Yoga at Angkor', date: 'Jun 15 · 5:30 AM', loc: 'Angkor Wat', color: '#f97316', icon: 'fa-sun' },
  { title: 'Forest Clean-Up Drive', date: 'Jun 18 · 7:00 AM', loc: 'Phnom Kulen', color: '#22c55e', icon: 'fa-leaf' },
  { title: 'Wildlife Photography Walk', date: 'Jun 22 · 6:00 AM', loc: 'Boeung Prek', color: '#a78bfa', icon: 'fa-camera' },
  { title: 'Beach Side Meditation', date: 'Jul 1 · 5:00 AM', loc: 'Sihanoukville', color: '#0ea5e9', icon: 'fa-spa' },
  { title: 'Stargazing Night', date: 'Jul 5 · 8:00 PM', loc: 'Bokor Hill', color: '#6366f1', icon: 'fa-star' },
  { title: 'Zero Waste Workshop', date: 'Jul 10 · 9:00 AM', loc: 'Phnom Penh', color: '#34d399', icon: 'fa-recycle' },
];

export default function EventsPage({ toast }) {
  return (
    <div className="animate-[fadeIn_.3s_ease]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-[#a78bfa] to-[#6366f1] flex items-center justify-center text-white text-xl"><i className="fa-solid fa-calendar-days" /></div>
        <div>
          <div className="font-[Sora] text-xl font-extrabold">Events</div>
          <div className="text-sm text-[var(--text3)]">Upcoming events near you</div>
        </div>
      </div>
      <div className="space-y-3">
        {events.map((e, i) => (
          <div key={i} onClick={() => toast?.(`📅 Interested in ${e.title}`)} className="flex items-center gap-4 bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-4 cursor-pointer transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_4px_20px_rgba(0,0,0,.15)]">
            <div className="w-14 h-14 rounded-[16px] flex items-center justify-center text-2xl flex-shrink-0" style={{ background: `${e.color}22`, color: e.color }}>
              <i className={`fa-solid ${e.icon}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-[var(--text)] truncate">{e.title}</div>
              <div className="text-xs text-[var(--text2)] mt-0.5"><i className="fa-regular fa-clock mr-1" />{e.date}</div>
              <div className="text-xs text-[var(--text3)]"><i className="fa-solid fa-location-dot mr-1" />{e.loc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
