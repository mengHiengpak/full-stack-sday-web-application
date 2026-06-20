'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useToast } from '@/app/components/Toast';
import TopNav from '@/app/components/TopNav';
import Sidebar from '@/app/components/Sidebar';
import RightPanel from '@/app/components/RightPanel';
import BottomNav from '@/app/components/BottomNav';

export default function NewsDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace('/login'); return; }
    try {
      const raw = sessionStorage.getItem('sbay_news_article');
      if (raw) {
        const data = JSON.parse(raw);
        if (encodeURIComponent(data.headline?.slice(0, 60)) === params.id || data.url?.includes(params.id)) {
          setArticle(data);
          return;
        }
      }
      const allRaw = sessionStorage.getItem('sbay_news_articles');
      if (allRaw) {
        const all = JSON.parse(allRaw);
        const found = all.find((a) => encodeURIComponent(a.headline?.slice(0, 60)) === params.id);
        if (found) { setArticle(found); return; }
      }
    } catch {}
  }, [params.id, authLoading]);

  const openOriginal = () => {
    if (article?.url && article.url !== '#') {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <>
        <TopNav onOpenChat={() => router.push('/chat')} />
        <div className="flex pt-[56px] min-h-[calc(100vh-56px)]">
          <Sidebar toast={toast} onOpenDM={() => router.push('/chat')} activeView="" onViewChange={(v) => v === 'feed' ? router.push('/') : null} />
          <main className="flex-1 ml-[260px] mr-[300px] p-4 max-w-[680px] min-w-0 max-[1100px]:mr-0 max-[780px]:ml-0 max-[780px]:mb-[56px]">
            <div className="text-center py-16">
              <div className="text-5xl mb-4 text-[var(--text3)]"><i className="fa-solid fa-newspaper" /></div>
              <div className="text-lg font-bold text-[var(--text2)]">Article not found</div>
              <button onClick={() => router.push('/')} className="mt-4 px-5 py-2 bg-[var(--accent)] text-white text-sm font-semibold rounded-[10px] hover:bg-[var(--accent2)] transition-colors">Back to Home</button>
            </div>
          </main>
          <RightPanel toast={toast} />
        </div>
        <BottomNav onOpenChat={() => router.push('/chat')} toast={toast} onViewChange={(v) => v === 'feed' ? router.push('/') : null} />
      </>
    );
  }

  return (
    <>
      <TopNav onOpenChat={() => router.push('/chat')} />
      <div className="flex pt-[56px] min-h-[calc(100vh-56px)]">
        <Sidebar toast={toast} onOpenDM={() => router.push('/chat')} activeView="" onViewChange={(v) => v === 'feed' ? router.push('/') : null} />
        <main className="flex-1 ml-[260px] mr-[300px] p-4 max-w-[680px] min-w-0 max-[1100px]:mr-0 max-[780px]:ml-0 max-[780px]:mb-[56px]">
          <div className="animate-[fadeIn_.3s_ease]">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-[var(--text3)] hover:text-[var(--text)] mb-4 transition-colors">
              <i className="fa-solid fa-arrow-left" /> Back
            </button>

            <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] overflow-hidden">
              <div className="h-48 sm:h-64 flex items-center justify-center bg-gradient-to-br from-[var(--bg3)] to-[var(--bg2)] relative">
                <div className="w-20 h-20 rounded-[20px] flex items-center justify-center text-white text-4xl shadow-lg" style={{ background: article.color }}>
                  <i className={`fa-solid ${article.icon || 'fa-newspaper'}`} />
                </div>
                <div className="absolute top-4 left-4 bg-black/50 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1.5">
                  <i className={`fa-solid ${article.icon || 'fa-newspaper'}`} />
                  {article.source}
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <h1 className="font-[Sora] text-2xl sm:text-3xl font-extrabold text-[var(--text)] leading-tight">
                  {article.headline}
                </h1>

                <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-[var(--text3)]">
                  <span className="font-semibold" style={{ color: article.color }}>{article.source}</span>
                  <span>·</span>
                  <span><i className="fa-regular fa-clock mr-1" />{article.time}</span>
                  {article.feedName && (
                    <>
                      <span>·</span>
                      <span><i className="fa-solid fa-satellite mr-1" />{article.feedName}</span>
                    </>
                  )}
                </div>

                {article.summary && (
                  <div className="mt-6 p-4 bg-[var(--bg2)] border border-[var(--border)] rounded-[14px]">
                    <p className="text-sm text-[var(--text2)] leading-relaxed">{article.summary}</p>
                  </div>
                )}

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={openOriginal}
                    disabled={!article.url || article.url === '#'}
                    className="flex-1 px-5 py-3 bg-[var(--accent)] text-white text-sm font-bold rounded-[12px] hover:bg-[var(--accent2)] active:scale-[0.97] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="fa-solid fa-arrow-up-right-from-square" /> Read Full Article
                  </button>
                  <button
                    onClick={() => { navigator.clipboard?.writeText(article.url || window.location.href); toast?.('🔗 Link copied!'); }}
                    className="px-5 py-3 bg-[var(--bg2)] border border-[var(--border)] text-[var(--text2)] text-sm font-semibold rounded-[12px] hover:bg-[var(--bg3)] transition-all flex items-center justify-center gap-2"
                  >
                    <i className="fa-regular fa-copy" /> Copy Link
                  </button>
                </div>

                {article.url && article.url !== '#' && (
                  <div className="mt-5 p-3 bg-[var(--bg2)] border border-[var(--border)] rounded-[12px]">
                    <div className="text-xs text-[var(--text3)] mb-1">Original source</div>
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--accent)] hover:underline break-all">{article.url}</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        <RightPanel toast={toast} />
      </div>
      <BottomNav onOpenChat={() => router.push('/chat')} toast={toast} onViewChange={(v) => v === 'feed' ? router.push('/') : null} />
    </>
  );
}
