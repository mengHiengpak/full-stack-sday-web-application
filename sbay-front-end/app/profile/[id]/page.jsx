'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { usersAPI, postsAPI, friendsAPI, chatAPI } from '@/app/lib/api';
import { useToast } from '@/app/components/Toast';
import TopNav from '@/app/components/TopNav';
import Sidebar from '@/app/components/Sidebar';
import PostCard from '@/app/components/PostCard';
import RightPanel from '@/app/components/RightPanel';
import BottomNav from '@/app/components/BottomNav';
import ShareModal from '@/app/components/ShareModal';

export default function ProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading, updateUser } = useAuth();
  const toast = useToast();
  const profileId = parseInt(id);
  const isOwn = user?.id === profileId;

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [editWebsite, setEditWebsite] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [saving, setSaving] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [sharePost, setSharePost] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [friendsList, setFriendsList] = useState([]);
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [pfpError, setPfpError] = useState(false);
  const [coverError, setCoverError] = useState(false);

  const avatarRef = useRef(null);
  const coverRef = useRef(null);

  const loadProfile = useCallback(async () => {
    try {
      const res = await usersAPI.get(profileId);
      const data = res.data.data;
      setProfile(data);
      setPfpError(false);
      setCoverError(false);
    } catch {
      toast?.('User not found');
      router.replace('/');
    } finally {
      setProfileLoading(false);
    }
  }, [profileId, toast, router]);

  const loadPosts = useCallback(async () => {
    setPostsLoading(true);
    try {
      const res = await usersAPI.getPosts(profileId);
      setPosts(res.data.data || []);
    } catch {
      // posts unavailable
    } finally {
      setPostsLoading(false);
    }
  }, [profileId]);

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace('/login'); return; }
    loadProfile();
    loadPosts();
  }, [user, loading, loadProfile, loadPosts, router]);

  const handleFriendAction = async (action) => {
    const prevStatus = profile?.friendStatus;
    setProfile(prev => prev ? { ...prev, friendStatus: action === 'send' ? 'sent' : action === 'accept' ? 'friends' : action === 'unfriend' ? 'none' : prev.friendStatus } : prev);
    try {
      if (action === 'send') {
        await friendsAPI.sendRequest(profileId);
        toast?.('Friend request sent');
      } else if (action === 'accept') {
        await friendsAPI.respond(profile?.friendRequestId, 'accepted');
        toast?.('Friend request accepted');
      } else if (action === 'unfriend') {
        await friendsAPI.unfriend(profileId);
        toast?.('Unfriended');
      }
    } catch {
      setProfile(prev => prev ? { ...prev, friendStatus: prevStatus } : prev);
      loadProfile();
      toast?.('Action failed');
    }
  };

  const startEdit = () => {
    setEditBio(profile?.bio || '');
    setEditWebsite(profile?.website || '');
    setEditLocation(profile?.location || '');
    setEditing(true);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await usersAPI.updateProfile({ bio: editBio, website: editWebsite, location: editLocation });
      toast?.('Profile updated');
      setEditing(false);
      loadProfile();
    } catch (err) {
      toast?.(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append('avatar', file);
    try {
      const res = await usersAPI.updateAvatar(form);
      toast?.('Avatar updated');
      updateUser({ profilePicture: res.data.data.profilePicture });
      loadProfile();
    } catch {
      toast?.('Failed to upload avatar');
    }
    e.target.value = '';
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append('cover', file);
    try {
      const res = await usersAPI.updateCover(form);
      toast?.('Cover photo updated');
      updateUser({ coverPhoto: res.data.data.coverPhoto });
      loadProfile();
    } catch {
      toast?.('Failed to upload cover');
    }
    e.target.value = '';
  };

  const loadFriends = useCallback(async () => {
    setFriendsLoading(true);
    try {
      const res = await friendsAPI.getList();
      setFriendsList(res.data.data || []);
    } catch {
      setFriendsList([]);
    } finally {
      setFriendsLoading(false);
    }
  }, []);

  const handleDelete = (postId) => {
    setPosts((prev) => prev.filter(p => p.id !== postId));
  };

  if (!user) return null;

  const navigateHome = (view) => {
    router.push('/');
  };

  const initials = profile?.username?.slice(0, 2).toUpperCase() || '?';
  const friendsCount = profile?.friendsCount || 0;
  const joinedDate = profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '';

  return (
    <>
      <TopNav onOpenChat={() => router.push('/chat')} />
      <div className="flex pt-[56px] min-h-[calc(100vh-56px)]">
        <Sidebar toast={toast} onOpenDM={() => router.push('/chat')} activeView="" onViewChange={navigateHome} />
        <main className="flex-1 ml-[260px] mr-[300px] max-[1100px]:mr-0 max-[780px]:ml-0 max-[780px]:mb-[56px]">
          <div className="bg-[var(--bg2)] border-b border-[var(--border)]">
            <div className="relative h-[280px] bg-[var(--bg3)] overflow-hidden">
              {profile?.coverPhoto && !coverError ? (
                <img src={profile.coverPhoto} alt="" className="w-full h-full object-cover" onError={() => setCoverError(true)} />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-[var(--accent)]/30 to-[var(--accent2)]/30" />
              )}
              {isOwn && (
                <>
                  <button onClick={() => coverRef.current?.click()} className="absolute bottom-3 right-3 bg-black/50 text-white border-none rounded px-3 py-1.5 text-xs font-medium cursor-pointer hover:bg-black/70 flex items-center gap-1.5">
                    <i className="fa-solid fa-camera" />Edit Cover
                  </button>
                  <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                </>
              )}
            </div>
            <div className="px-8 max-[480px]:px-4 pb-4 relative">
              <div className="flex items-end -mt-[60px] mb-3 max-[480px]:flex-wrap">
                <div className="relative flex-shrink-0">
                  <div className="w-[120px] h-[120px] rounded-full border-4 border-[var(--bg2)] bg-[var(--accent)] flex items-center justify-center text-4xl font-bold text-white overflow-hidden shadow-md max-[480px]:w-[80px] max-[480px]:h-[80px] max-[480px]:text-2xl">
                    {profile?.profilePicture && !pfpError ? (
                      <img src={profile.profilePicture} alt="" className="w-full h-full object-cover" onError={() => setPfpError(true)} />
                    ) : (
                      initials
                    )}
                  </div>
                  {isOwn && (
                    <>
                      <button onClick={() => avatarRef.current?.click()} className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[var(--accent)] text-white border-2 border-[var(--bg2)] flex items-center justify-center cursor-pointer hover:bg-[var(--accent2)]">
                        <i className="fa-solid fa-camera text-xs" />
                      </button>
                      <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                    </>
                  )}
                </div>
                <div className="ml-4 pb-1 flex-1 max-[480px]:ml-3 max-[480px]:min-w-0">
                  <h1 className="text-xl font-bold text-[var(--text)] max-[480px]:text-base">{profile?.username || 'User'}</h1>
                  <p className="text-sm text-[var(--text3)] max-[480px]:text-xs">@{profile?.username?.toLowerCase() || 'user'}</p>
                </div>
                <div className="pb-1 max-[480px]:w-full max-[480px]:mt-2 max-[480px]:pl-[calc(80px+12px)]">
                  {isOwn ? (
                    <button onClick={startEdit} className="px-4 py-1.5 bg-[var(--bg3)] border border-[var(--border)] rounded-md text-sm font-semibold text-[var(--text)] cursor-pointer hover:bg-[var(--card2)] flex items-center gap-1.5">
                      <i className="fa-solid fa-pen" />Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      {profile?.friendStatus === 'none' && (
                        <button onClick={() => handleFriendAction('send')} className="px-5 py-1.5 rounded-md text-sm font-semibold cursor-pointer border-none bg-[var(--accent)] text-white hover:bg-[var(--accent2)]">
                          <span>Add Friend</span>
                        </button>
                      )}
                      {profile?.friendStatus === 'sent' && (
                        <button disabled className="px-5 py-1.5 rounded-md text-sm font-semibold cursor-not-allowed border-none bg-[var(--bg3)] text-[var(--text3)] opacity-60">
                          <span>Requested</span>
                        </button>
                      )}
                      {profile?.friendStatus === 'received' && (
                        <button onClick={() => handleFriendAction('accept')} className="px-5 py-1.5 rounded-md text-sm font-semibold cursor-pointer border-none bg-[var(--accent)] text-white hover:bg-[var(--accent2)]">
                          <span>Accept</span>
                        </button>
                      )}
                      {profile?.friendStatus === 'friends' && (
                        <button onClick={() => handleFriendAction('unfriend')} className="px-5 py-1.5 rounded-md text-sm font-semibold cursor-pointer border-none bg-[var(--bg3)] text-[var(--text)] hover:bg-red-50 hover:text-red-500">
                          <span>Friends ✓</span>
                        </button>
                      )}
                      <button onClick={() => router.push(`/chat?userId=${profileId}`)} className="px-4 py-1.5 bg-[var(--bg3)] border border-[var(--border)] rounded-md text-sm font-semibold text-[var(--text)] cursor-pointer hover:bg-[var(--card2)]">
                        <i className="fa-solid fa-message" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-[var(--text2)] mb-3">
                {profile?.bio && <p className="w-full text-[var(--text)] mb-1">{profile.bio}</p>}
                {profile?.location && <span><i className="fa-solid fa-location-dot mr-1 text-[var(--text3)]" />{profile.location}</span>}
                {profile?.website && (
                  <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">
                    <i className="fa-solid fa-link mr-1" />{profile.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                {joinedDate && <span><i className="fa-solid fa-calendar mr-1 text-[var(--text3)]" />Joined {joinedDate}</span>}
              </div>

              <div className="flex items-center gap-4 text-sm border-t border-[var(--border)] pt-3">
                <span className="font-semibold text-[var(--text)]">{posts.length}</span>
                <span className="text-[var(--text3)] mr-2">posts</span>
                <button onClick={() => { loadFriends(); setShowFriendsModal(true); }} className="flex items-center gap-0.5 hover:underline cursor-pointer bg-transparent border-none p-0">
                  <span className="font-semibold text-[var(--text)]">{friendsCount}</span>
                  <span className="text-[var(--text3)]">friends</span>
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-[680px] mx-auto p-4">
            <div className="flex border-b border-[var(--border)] mb-4">
              <button onClick={() => setActiveTab('posts')} className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${activeTab === 'posts' ? 'text-[var(--accent)] border-[var(--accent)]' : 'text-[var(--text3)] border-transparent hover:text-[var(--text)]'}`}>
                Posts
              </button>
            </div>

            {postsLoading ? (
              <div className="space-y-4">
                {[1,2].map(i => (
                  <div key={i} className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--bg3)]" />
                      <div className="space-y-2 flex-1">
                        <div className="h-3 w-24 rounded bg-[var(--bg3)]" />
                        <div className="h-2.5 w-16 rounded bg-[var(--bg3)]" />
                      </div>
                    </div>
                    <div className="h-3 w-full rounded bg-[var(--bg3)] mb-2" />
                    <div className="h-3 w-3/4 rounded bg-[var(--bg3)]" />
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3 opacity-30"><i className="fa-regular fa-file-lines" /></div>
                <div className="font-semibold text-[var(--text2)] mb-1">No posts yet</div>
                <div className="text-sm text-[var(--text3)]">When they post, it will show up here.</div>
              </div>
            ) : (
              <div>
                {posts.map(p => (
                  <PostCard key={p.id} post={p} toast={toast} onOpenProfile={() => {}} onShare={(post) => { setSharePost(post); setShareOpen(true); }} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>
        </main>
        <RightPanel toast={toast} />
      </div>
      <BottomNav onOpenChat={() => router.push('/chat')} toast={toast} onViewChange={navigateHome} />
      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} toast={toast} post={sharePost} />

      {showFriendsModal && (
        <div className="fixed inset-0 z-[400] bg-black/50 flex items-center justify-center" onClick={(e) => e.target === e.currentTarget && setShowFriendsModal(false)}>
          <div className="w-[420px] max-w-[95vw] max-h-[70vh] bg-[var(--bg2)] border border-[var(--border)] rounded-2xl shadow-lg flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--border)]">
              <h2 className="text-lg font-bold text-[var(--text)]">Friends</h2>
              <button onClick={() => setShowFriendsModal(false)} className="w-8 h-8 rounded-full bg-[var(--bg)] flex items-center justify-center text-[var(--text3)] hover:bg-[var(--bg3)] hover:text-[var(--text)] transition-colors bg-transparent border-none cursor-pointer">
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {friendsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : friendsList.length === 0 ? (
                <div className="text-center py-12 text-sm text-[var(--text3)]">No friends yet</div>
              ) : (
                friendsList.map((f) => (
                  <div key={f.id || f.userId} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--bg3)] transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c084fc] to-[#a855f7] flex items-center justify-center font-bold text-sm text-white flex-shrink-0">
                      {f.username?.slice(0, 2).toUpperCase() || '?'}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-[var(--text)]">{f.username || 'Unknown'}</div>
                    </div>
                    <button
                      onClick={() => router.push(`/chat?userId=${f.id || f.userId}`)}
                      className="w-8 h-8 rounded-full bg-[var(--bg)] flex items-center justify-center text-[var(--text2)] hover:bg-[var(--bg3)] hover:text-[var(--accent)] transition-colors"
                    >
                      <i className="fa-solid fa-message text-xs" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[400] bg-black/50 flex items-center justify-center" onClick={(e) => e.target === e.currentTarget && setEditing(false)}>
          <div className="w-[400px] max-w-[95vw] bg-[var(--bg2)] border border-[var(--border)] rounded-lg p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[var(--text)]">Edit Profile</h2>
              <button onClick={() => setEditing(false)} className="bg-transparent border-none text-[var(--text3)] cursor-pointer text-xl hover:text-[var(--text)]"><i className="fa-solid fa-xmark" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text2)] mb-1">Bio</label>
                <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} maxLength={200} rows={3} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--text)] outline-none resize-none focus:border-[var(--accent)]" placeholder="Tell us about yourself..." />
                <div className="text-xs text-[var(--text3)] text-right mt-1">{editBio.length}/200</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text2)] mb-1">Website</label>
                <input type="url" value={editWebsite} onChange={(e) => setEditWebsite(e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" placeholder="https://" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text2)] mb-1">Location</label>
                <input type="text" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" placeholder="City, Country" />
              </div>
              <button onClick={saveProfile} disabled={saving} className="w-full py-2 bg-[var(--accent)] text-white border-none rounded-md text-sm font-semibold cursor-pointer hover:bg-[var(--accent2)] disabled:opacity-60">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
