'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const RSS_FEEDS = {
  international: [
    { name: 'BBC World', url: 'https://feeds.bbci.co.uk/news/world/rss.xml', color: '#ef4444', icon: 'fa-broadcast-tower' },
    { name: 'CNN', url: 'https://edition.cnn.com/services/rss/', color: '#cc0000', icon: 'fa-newspaper' },
    { name: 'Reuters', url: 'https://www.reutersagency.com/feed/', color: '#f59e0b', icon: 'fa-globe' },
    { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml', color: '#0ea5e9', icon: 'fa-satellite' },
    { name: 'NPR', url: 'https://feeds.npr.org/1001/rss.xml', color: '#8b5cf6', icon: 'fa-radio' },
    { name: 'The Guardian', url: 'https://www.theguardian.com/world/rss', color: '#052962', icon: 'fa-feather' },
    { name: 'NYT World', url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', color: '#000000', icon: 'fa-times' },
  ],
  khmer: [
    { name: 'VOA Khmer', url: 'https://www.voanews.com/api/zqirqkqkri', color: '#2563eb', icon: 'fa-microphone' },
    { name: 'RFI Khmer', url: 'https://www.rfi.fr/kh/titres-podcast', color: '#dc2626', icon: 'fa-satellite-dish' },
    { name: 'RFA Khmer', url: 'https://www.rfa.org/khmer/', color: '#ca8a04', icon: 'fa-radio' },
    { name: 'Cambodia Daily', url: 'https://cambodiadaily.com/feed/', color: '#16a34a', icon: 'fa-newspaper' },
  ],
};

const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

const fallbackArticles = {
  international: [
    { headline: 'Global Climate Summit Reaches Historic Agreement', source: 'BBC World', time: '2h ago', url: '#', color: '#ef4444', icon: 'fa-broadcast-tower', summary: 'World leaders commit to net-zero emissions by 2050 in landmark deal.' },
    { headline: 'Tech Giants Announce AI Safety Framework', source: 'Reuters', time: '4h ago', url: '#', color: '#f59e0b', icon: 'fa-globe', summary: 'Major technology companies agree on voluntary AI regulation standards.' },
    { headline: 'Markets Reach New Highs Amid Economic Recovery', source: 'CNN', time: '6h ago', url: '#', color: '#cc0000', icon: 'fa-newspaper', summary: 'Global stock markets surge as economic indicators improve.' },
    { headline: 'Breakthrough in Cancer Research Announced', source: 'The Guardian', time: '8h ago', url: '#', color: '#052962', icon: 'fa-feather', summary: 'Scientists develop new treatment showing promising results.' },
    { headline: 'UN Peacekeeping Mission Extended', source: 'Al Jazeera', time: '10h ago', url: '#', color: '#0ea5e9', icon: 'fa-satellite', summary: 'Security Council votes to extend peacekeeping operations.' },
    { headline: 'Space Exploration Milestone Reached', source: 'NPR', time: '12h ago', url: '#', color: '#8b5cf6', icon: 'fa-radio', summary: 'New planetary discovery announced by space agency.' },
  ],
  khmer: [
    { headline: 'កម្ពុជាពង្រឹងទំនាក់ទំនងជាមួយបណ្តាប្រទេសអាស៊ាន', source: 'VOA Khmer', time: '3h ago', url: '#', color: '#2563eb', icon: 'fa-microphone', summary: 'កម្ពុជាបន្តពង្រឹងកិច្ចសហប្រតិបត្តិការជាមួយបណ្តាប្រទេសសមាជិកអាស៊ាន' },
    { headline: 'សេដ្ឋកិច្ចកម្ពុជាកំពុងរីកចម្រើន', source: 'RFI Khmer', time: '5h ago', url: '#', color: '#dc2626', icon: 'fa-satellite-dish', summary: 'សេដ្ឋកិច្ចកម្ពុជាបន្តកើនឡើងក្នុងអត្រា ៦%' },
    { headline: 'គម្រោងហេដ្ឋារចនាសម្ព័ន្ធថ្មីនៅកម្ពុជា', source: 'RFA Khmer', time: '7h ago', url: '#', color: '#ca8a04', icon: 'fa-radio', summary: 'រដ្ឋាភិបាលប្រកាសគម្រោងសាងសង់ផ្លូវថ្មីជាង ១០០គីឡូម៉ែត្រ' },
    { headline: 'ទេសចរណ៍កម្ពុជាកំពុងងើបឡើងវិញ', source: 'Cambodia Daily', time: '9h ago', url: '#', color: '#16a34a', icon: 'fa-newspaper', summary: 'ចំនួនភ្ញៀវទេសចរអន្តរជាតិមកកម្ពុជាកើនឡើងគួរឱ្យកត់សម្គាល់' },
    { headline: 'ការអប់រំឌីជីថលនៅកម្ពុជា', source: 'VOA Khmer', time: '11h ago', url: '#', color: '#2563eb', icon: 'fa-laptop', summary: 'សាលារៀននៅកម្ពុជាកំពុងអនុវត្តការបង្រៀនតាមប្រព័ន្ធឌីជីថល' },
    { headline: 'ពិធីបុណ្យប្រពៃណីខ្មែរ', source: 'RFI Khmer', time: '1d ago', url: '#', color: '#dc2626', icon: 'fa-gift', summary: 'ប្រជាជនកម្ពុជាប្រារព្ធពិធីបុណ្យប្រពៃណីជាតិ' },
  ],
};

async function fetchRSS(url) {
  try {
    const res = await fetch(`${CORS_PROXY}${encodeURIComponent(url)}`, { signal: AbortSignal.timeout(8000) });
    const text = await res.text();
    const items = parseRSS(text);
    return items.slice(0, 8);
  } catch {
    return null;
  }
}

function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const content = match[1];
    const title = content.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || 'Untitled';
    const link = content.match(/<link[^>]*>([^<]*)<\/link>/i)?.[1] || '#';
    const pubDate = content.match(/<pubDate[^>]*>([^<]*)<\/pubDate>/i)?.[1] || content.match(/<dc:date[^>]*>([^<]*)<\/dc:date>/i)?.[1] || '';
    const description = content.match(/<description[^>]*>([^<]*)<\/description>/i)?.[1] || '';
    const cleanDesc = description.replace(/<[^>]*>/g, '').substring(0, 200);
    items.push({ title: title.trim(), link, pubDate, description: cleanDesc.trim() });
  }
  return items;
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  if (diff < 0) return '';
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function NewsPage({ toast }) {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('international');
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10;

  const loadNews = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');

    const feeds = tab === 'khmer' ? RSS_FEEDS.khmer : RSS_FEEDS.international;
    const allItems = [];

    const promises = feeds.map(async (feed) => {
      const items = await fetchRSS(feed.url);
      if (items && items.length > 0) {
        items.forEach((item) => {
          allItems.push({
            headline: item.title,
            source: feed.name,
            time: timeAgo(item.pubDate) || 'recent',
            url: item.link,
            color: feed.color,
            icon: feed.icon,
            summary: item.description || '',
            feedName: feed.name,
          });
        });
      }
    });

    await Promise.all(promises);

    if (allItems.length > 0) {
      allItems.sort((a, b) => {
        const ta = a.time === 'Just now' ? 0 : parseInt(a.time) || 999;
        const tb = b.time === 'Just now' ? 0 : parseInt(b.time) || 999;
        return ta - tb;
      });
      setArticles(allItems);
      if (isRefresh) toast?.('News updated!');
    } else {
      setArticles(fallbackArticles[tab]);
      if (isRefresh) toast?.('Using cached news');
    }

    setLoading(false);
    setRefreshing(false);
  }, [tab, toast]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  useEffect(() => {
    setPage(1);
  }, [search, tab]);

  useEffect(() => {
    const interval = setInterval(() => loadNews(true), 120000);
    return () => clearInterval(interval);
  }, [loadNews]);

  const openArticle = (article) => {
    try {
      sessionStorage.setItem('sbay_news_article', JSON.stringify(article));
      const allRaw = sessionStorage.getItem('sbay_news_articles');
      const all = allRaw ? JSON.parse(allRaw) : [];
      const exists = all.some((a) => a.headline === article.headline);
      if (!exists) all.push(article);
      sessionStorage.setItem('sbay_news_articles', JSON.stringify(all.slice(-50)));
    } catch {}
    const slug = encodeURIComponent(article.headline?.slice(0, 60));
    router.push(`/news/${slug}`);
  };

  const filtered = articles.filter((a) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return a.headline.toLowerCase().includes(q) || a.source.toLowerCase().includes(q) || (a.summary || '').toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const startItem = Math.min((page - 1) * perPage + 1, filtered.length);
  const endItem = Math.min(page * perPage, filtered.length);

  return (
    <div className="animate-[fadeIn_.3s_ease]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-[#c084fc] to-[#a855f7] flex items-center justify-center text-white text-xl"><i className="fa-solid fa-newspaper" /></div>
          <div>
            <div className="font-[Sora] text-xl font-extrabold">Discover News</div>
            <div className="text-sm text-[var(--text3)]">Real-time news from around the world</div>
          </div>
        </div>
        <button
          onClick={() => loadNews(true)}
          disabled={refreshing}
          className="px-3 py-2 bg-[var(--bg2)] border border-[var(--border)] rounded-[10px] text-xs font-semibold text-[var(--text2)] hover:bg-[var(--bg3)] transition-colors flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
        >
          <i className={`fa-solid fa-rotate ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Updating...' : 'Refresh'}
        </button>
      </div>

      <div className="flex gap-1 mb-4 bg-[var(--bg2)] border border-[var(--border)] rounded-full p-1">
        {[
          { key: 'international', label: '🌍 International' },
          { key: 'khmer', label: '🇰🇭 Khmer News' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setSearch(''); }}
            className={`flex-1 py-1.5 text-sm font-semibold rounded-full transition-all cursor-pointer border-none ${
              tab === t.key ? 'bg-[var(--accent)] text-white shadow-sm' : 'text-[var(--text3)] hover:text-[var(--text)] bg-transparent'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative mb-4">
        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text3)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search news..."
          className="w-full bg-[var(--bg2)] border border-[var(--border)] rounded-full pl-9 pr-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="flex items-start gap-3.5 bg-[var(--card)] border border-[var(--border)] rounded-[14px] p-3.5 animate-pulse">
              <div className="w-10 h-10 rounded-[12px] bg-[var(--bg3)] flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-3/4 bg-[var(--bg3)] rounded" />
                <div className="h-2.5 w-1/2 bg-[var(--bg3)] rounded mt-1.5" />
                <div className="h-2 w-1/4 bg-[var(--bg3)] rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-[var(--text3)]">
          <div className="text-4xl mb-3"><i className="fa-solid fa-newspaper" /></div>
          <div className="font-semibold text-[var(--text2)]">No news found</div>
          <div className="text-sm mt-1">Try a different search</div>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {paged.map((a, i) => (
              <div
                key={`${a.url}-${i}`}
                onClick={() => openArticle(a)}
                className="flex items-start gap-3.5 bg-[var(--card)] border border-[var(--border)] rounded-[14px] p-3.5 cursor-pointer transition-all duration-200 hover:bg-[var(--card2)] hover:-translate-y-[1px] group"
              >
                <div className="w-11 h-11 rounded-[12px] flex items-center justify-center text-white flex-shrink-0 mt-0.5" style={{ background: a.color }}>
                  <i className={`fa-solid ${a.icon || 'fa-newspaper'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[var(--text)] leading-snug">{a.headline}</div>
                  {a.summary && (
                    <div className="text-xs text-[var(--text2)] mt-1 line-clamp-2">{a.summary}</div>
                  )}
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-[var(--text3)]">
                    <span className="font-medium" style={{ color: a.color }}>{a.source}</span>
                    <span>·</span>
                    <span>{a.time}</span>
                  </div>
                </div>
                <div className="flex-shrink-0 text-[var(--text3)] text-sm opacity-0 group-hover:opacity-100 transition-opacity self-center">
                  <i className="fa-solid fa-arrow-up-right-from-square" />
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border)]">
              <div className="text-xs text-[var(--text3)]">{startItem}&ndash;{endItem} of {filtered.length}</div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs border-none cursor-pointer disabled:opacity-30 disabled:cursor-default bg-[var(--bg2)] text-[var(--text2)] hover:bg-[var(--accent)] hover:text-white transition-all"
                >
                  <i className="fa-solid fa-chevron-left" />
                </button>
                {(() => {
                  const pages = [];
                  const start = Math.max(1, page - 2);
                  const end = Math.min(totalPages, page + 2);
                  if (start > 1) {
                    pages.push(
                      <button key={1} onClick={() => setPage(1)} className="w-8 h-8 rounded-lg flex items-center justify-center text-xs border-none cursor-pointer bg-[var(--bg2)] text-[var(--text2)] hover:bg-[var(--accent)] hover:text-white transition-all">1</button>
                    );
                    if (start > 2) pages.push(<span key="dots1" className="px-1 text-xs text-[var(--text3)]">&hellip;</span>);
                  }
                  for (let i = start; i <= end; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs border-none cursor-pointer transition-all ${
                          i === page
                            ? 'bg-[var(--accent)] text-white shadow-sm'
                            : 'bg-[var(--bg2)] text-[var(--text2)] hover:bg-[var(--accent)] hover:text-white'
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }
                  if (end < totalPages) {
                    if (end < totalPages - 1) pages.push(<span key="dots2" className="px-1 text-xs text-[var(--text3)]">&hellip;</span>);
                    pages.push(
                      <button key={totalPages} onClick={() => setPage(totalPages)} className="w-8 h-8 rounded-lg flex items-center justify-center text-xs border-none cursor-pointer bg-[var(--bg2)] text-[var(--text2)] hover:bg-[var(--accent)] hover:text-white transition-all">{totalPages}</button>
                    );
                  }
                  return pages;
                })()}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs border-none cursor-pointer disabled:opacity-30 disabled:cursor-default bg-[var(--bg2)] text-[var(--text2)] hover:bg-[var(--accent)] hover:text-white transition-all"
                >
                  <i className="fa-solid fa-chevron-right" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <div className="mt-4 text-center text-[10px] text-[var(--text3)]">
        <i className="fa-solid fa-rotate mr-1" /> Auto-refreshes every 2 minutes
      </div>
    </div>
  );
}
