'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useToast } from '@/app/components/Toast';
import { postsAPI } from '@/app/lib/api';
import TopNav from '@/app/components/TopNav';
import Sidebar from '@/app/components/Sidebar';
import StoriesRow from '@/app/components/StoriesRow';
import CreatePost from '@/app/components/CreatePost';
import PostCard from '@/app/components/PostCard';
import RightPanel from '@/app/components/RightPanel';
import ChatPanel from '@/app/components/ChatPanel';
import ShareModal from '@/app/components/ShareModal';
import ProfileCard from '@/app/components/ProfileCard';
import BottomNav from '@/app/components/BottomNav';
import MusicPage from '@/app/components/pages/MusicPage';
import GamingPage from '@/app/components/pages/GamingPage';
import NewsPage from '@/app/components/pages/NewsPage';
import MemoriesPage from '@/app/components/pages/MemoriesPage';
import BirthdaysPage from '@/app/components/pages/BirthdaysPage';
import FundraisersPage from '@/app/components/pages/FundraisersPage';
import TrendingPage from '@/app/components/pages/TrendingPage';
import LivePage from '@/app/components/pages/LivePage';

export default function HomePage() {
  const { user, loading } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [view, setView] = useState('feed');
  const [chatOpen, setChatOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [sharePost, setSharePost] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState({});

  const loadFeed = useCallback(async () => {
    setFeedLoading(true);
    try {
      const res = view === 'feed' ? await postsAPI.feed() : await postsAPI.explore();
      setPosts(res.data.data || []);
    } catch {
      setPosts([]);
    } finally {
      setFeedLoading(false);
    }
  }, [view]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && (view === 'feed' || view === 'explore')) loadFeed();
  }, [user, view, loadFeed]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const handlePost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const openProfile = (name, initials, userId) => {
    setProfileData({ name, initials, userId });
    setProfileOpen(true);
  };

  const openShare = (post) => {
    setSharePost(post);
    setShareOpen(true);
  };

  const handleDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return (
    <>
      <TopNav onOpenChat={() => setChatOpen(true)} />
      <div className="flex pt-[56px] min-h-[calc(100vh-56px)]">
        <Sidebar toast={toast} onOpenDM={() => setChatOpen(true)} activeView={view} onViewChange={setView} />
        <main className="flex-1 ml-[260px] mr-[300px] p-4 max-w-[680px] min-w-0 max-[1100px]:mr-0 max-[780px]:ml-0 max-[780px]:mb-[56px]">
          {view === 'feed' && (
            <>
              <StoriesRow toast={toast} />
              <CreatePost onPost={handlePost} toast={toast} />
            </>
          )}
          {view === 'explore' && (
            <div className="text-center text-sm text-[var(--text3)] mb-4">Explore &mdash; what&apos;s happening now</div>
          )}

          {(view === 'feed' || view === 'explore') ? (
            <div id="feed">
              {feedLoading ? (
                <div className="space-y-4">
                  {[1,2,3].map((i) => (
                    <div key={i} className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] overflow-hidden p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--bg3)]" />
                        <div className="space-y-2 flex-1">
                          <div className="h-3 w-24 rounded bg-[var(--bg3)]" />
                          <div className="h-2.5 w-16 rounded bg-[var(--bg3)]" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 w-full rounded bg-[var(--bg3)]" />
                        <div className="h-3 w-3/4 rounded bg-[var(--bg3)]" />
                        <div className="h-[200px] w-full rounded bg-[var(--bg3)] mt-3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center text-sm text-[var(--text3)] py-16">
                  <div className="font-semibold text-[var(--text2)] mb-1">Nothing here yet</div>
                  <div>Follow some people or create the first post!</div>
                </div>
              ) : (
                posts.map((p) => <PostCard key={p.id} post={p} toast={toast} onOpenProfile={openProfile} onShare={openShare} onDelete={handleDelete} />)
              )}
            </div>
          ) : view === 'live' ? <LivePage toast={toast} /> :
            view === 'music' ? <MusicPage toast={toast} /> :
            view === 'gaming' ? <GamingPage toast={toast} /> :
            view === 'news' ? <NewsPage toast={toast} /> :
            view === 'memories' ? <MemoriesPage toast={toast} /> :
            view === 'birthdays' ? <BirthdaysPage toast={toast} /> :
            view === 'fundraisers' ? <FundraisersPage toast={toast} /> : null}
        </main>
        <RightPanel toast={toast} />
      </div>
      <BottomNav onOpenChat={() => setChatOpen(true)} toast={toast} onViewChange={setView} />
      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} toast={toast} post={sharePost} />
      <ProfileCard open={profileOpen} onClose={() => setProfileOpen(false)} toast={toast} {...profileData} />
    </>
  );
}
