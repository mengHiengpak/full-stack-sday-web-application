'use client';

import { useRouter } from 'next/navigation';
import { getAllCollections } from '@/app/lib/savedData';

export default function SavedPage({ toast }) {
  const router = useRouter();
  const collections = getAllCollections();

  return (
    <div className="animate-[fadeIn_.3s_ease]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-[#f472b6] to-[#ec4899] flex items-center justify-center text-white text-xl"><i className="fa-solid fa-bookmark" /></div>
        <div>
          <div className="font-[Sora] text-xl font-extrabold">Saved</div>
          <div className="text-sm text-[var(--text3)]">Your collections</div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {collections.map((c, i) => (
          <div
            key={c.slug}
            onClick={() => router.push(`/saved/${c.slug}`)}
            className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-4 cursor-pointer transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_30px_rgba(0,0,0,.2)]"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-[14px] flex items-center justify-center text-white text-lg" style={{ background: c.color }}>
                <i className={`fa-solid ${c.icon}`} />
              </div>
              <div>
                <div className="font-bold text-sm">{c.name}</div>
                <div className="text-xs text-[var(--text3)]">{c.count} saved</div>
              </div>
            </div>
            {c.description && (
              <div className="text-xs text-[var(--text2)] mt-2 line-clamp-1">{c.description}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}