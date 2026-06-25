'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { usersAPI, friendsAPI } from '@/app/lib/api';

export default function ProfileCard({ open, onClose, toast, name, initials, userId }) {
  const { user } = useAuth();
  const router = useRouter();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [editWebsite, setEditWebsite] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [saving, setSaving] = useState(false);
  const [pfpError, setPfpError] = useState(false);

  useEffect(() => {
    if (open && userId && userId !== user?.id) {
      loadProfile();
    }
  }, [open, userId]);

  const loadProfile = async () => {
    setLoading(true);
    setPfpError(false);
    try {
      const res = await usersAPI.get(userId);
      setProfileUser(res.data.data);
    } catch {
      // could not load
    } finally {
      setLoading(false);
    }
  };

  const handleFriendAction = async (action) => {
    const prevStatus = profileUser?.friendStatus;
    setProfileUser(prev => prev ? { ...prev, friendStatus: action === 'send' ? 'sent' : action === 'accept' ? 'friends' : action === 'unfriend' ? 'none' : prev.friendStatus } : prev);
    try {
      if (action === 'send') {
        await friendsAPI.sendRequest(userId);
        toast?.('Friend request sent');
      } else if (action === 'accept') {
        await friendsAPI.respond(profileUser?.friendRequestId, 'accepted');
        toast?.('Friend request accepted');
      } else if (action === 'unfriend') {
        await friendsAPI.unfriend(userId);
        toast?.('Unfriended');
      }
      loadProfile();
    } catch (err) {
      loadProfile();
      const msg = err.response?.data?.message || 'Action failed';
      toast?.(msg);
    }
  };

  const startEdit = () => {
    setEditBio(user?.bio || '');
    setEditWebsite(user?.website || '');
    setEditLocation(user?.location || '');
    setEditing(true);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await usersAPI.updateProfile({ bio: editBio, website: editWebsite, location: editLocation });
      toast?.('✅ Profile updated!');
      setEditing(false);
      if (profileUser) loadProfile();
    } catch (err) {
      toast?.(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  const isOwn = userId === user?.id;
  const displayName = profileUser?.username || name || 'Your Name';
  const displayInitials = displayName.slice(0, 2).toUpperCase();
  const friendsCount = profileUser?.friendsCount || 0;

  return (
    <div className="fixed inset-0 z-[300] bg-black/75 backdrop-blur-md flex items-center justify-center animate-[fadeIn_.2s]" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-[380px] max-w-[95vw] bg-[var(--bg2)] border border-[var(--border)] rounded-[28px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,.6)] animate-[slideUp_.3s_ease] relative">
        <div className="absolute -top-[60px] left-1/2 -translate-x-1/2 w-[260px] h-[260px] rounded-full bg-[radial-gradient(circle,rgba(108,99,255,.25)_0%,transparent_70%)] pointer-events-none z-0" />
        <div className="flex flex-col items-center pt-8 px-6 pb-5 relative z-[1]">
          <button onClick={onClose} className="absolute top-3.5 right-3.5 bg-[var(--card)] border border-[var(--border)] rounded-full w-8 h-8 text-[var(--text2)] cursor-pointer flex items-center justify-center text-sm hover:bg-[var(--card2)] hover:text-[var(--text)] transition-all"><i className="fa-solid fa-xmark" /></button>
          <div className="w-[88px] h-[88px] rounded-[28px] flex items-center justify-center text-[32px] font-black text-white font-[Sora] shadow-[0_12px_40px_rgba(108,99,255,.4)] mb-3.5 relative" style={{ background: profileUser?.profilePicture && !pfpError ? `url(${profileUser.profilePicture})` : 'linear-gradient(135deg,var(--accent),var(--accent2))', backgroundSize: 'cover' }}>
            {(!profileUser?.profilePicture || pfpError) && displayInitials}
            {profileUser?.profilePicture && !pfpError && <img src={profileUser.profilePicture} alt="" className="hidden" onError={() => setPfpError(true)} />}
            <div className="absolute -bottom-1 -right-1 w-[22px] h-[22px] rounded-full bg-[var(--online)] border-3 border-[var(--bg2)]" />
          </div>
          <div className="font-[Sora] text-xl font-extrabold text-[var(--text)] mb-1">{displayName}</div>
          <div className="text-xs text-[var(--text3)] mb-2.5">@{displayName.toLowerCase()}</div>
          {profileUser?.bio && <div className="text-xs leading-relaxed text-[var(--text2)] text-center max-w-[280px]">{profileUser.bio}</div>}
        </div>
        <div className="grid grid-cols-3 gap-px bg-[var(--border)] border-y border-[var(--border)]">
          {[
            { num: profileUser?.postCount?.toString() || '0', label: 'Posts' },
            { num: friendsCount.toString(), label: 'Friends' },
          ].map((s, i) => (
            <div key={i} className="bg-[var(--bg2)] py-4 px-2 text-center">
              <div className="font-[Sora] text-lg font-extrabold text-[var(--text)]">{s.num}</div>
              <div className="text-[11px] text-[var(--text3)] mt-0.5 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2.5 px-6 py-4 pb-6">
          {isOwn ? (
            <button onClick={startEdit} className="flex-1 py-3 bg-[var(--accent)] border-none rounded-[16px] text-white text-sm font-bold cursor-pointer flex items-center justify-center gap-[7px] hover:bg-[#5855d6] hover:-translate-y-[1px] transition-all">
              <i className="fa-solid fa-pen" />Edit Profile
            </button>
          ) : (
            <>
              {profileUser?.friendStatus === 'none' && (
                <button onClick={() => handleFriendAction('send')} className="flex-1 py-3 border-none rounded-[16px] text-white text-sm font-bold cursor-pointer flex items-center justify-center gap-[7px] hover:-translate-y-[1px] transition-all" style={{ background: 'var(--accent)' }}>
                  <i className="fa-solid fa-user-plus" /><span>Add Friend</span>
                </button>
              )}
              {profileUser?.friendStatus === 'sent' && (
                <button disabled className="flex-1 py-3 border-none rounded-[16px] text-sm font-bold flex items-center justify-center gap-[7px] cursor-not-allowed opacity-60" style={{ background: 'var(--accent3)' }}>
                  <span>Requested</span>
                </button>
              )}
              {profileUser?.friendStatus === 'received' && (
                <button onClick={() => handleFriendAction('accept')} className="flex-1 py-3 border-none rounded-[16px] text-white text-sm font-bold cursor-pointer flex items-center justify-center gap-[7px] hover:-translate-y-[1px] transition-all" style={{ background: 'var(--accent)' }}>
                  <i className="fa-solid fa-check" /><span>Accept</span>
                </button>
              )}
              {profileUser?.friendStatus === 'friends' && (
                <button onClick={() => handleFriendAction('unfriend')} className="flex-1 py-3 border-none rounded-[16px] text-white text-sm font-bold cursor-pointer flex items-center justify-center gap-[7px] hover:-translate-y-[1px] hover:!bg-red-500 transition-all" style={{ background: 'var(--accent3)' }}>
                  <i className="fa-solid fa-user-check" /><span>Friends ✓</span>
                </button>
              )}
              <button onClick={() => { onClose(); router.push(`/chat?userId=${userId}`); }} className="flex-1 py-3 bg-[var(--card)] border border-[var(--border)] rounded-[16px] text-[var(--text)] text-sm font-bold cursor-pointer flex items-center justify-center gap-[7px] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:-translate-y-[1px] transition-all">
                <i className="fa-solid fa-message" />Message
              </button>
            </>
          )}
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-[400] bg-black/75 backdrop-blur-md flex items-center justify-center animate-[fadeIn_.2s]" onClick={(e) => e.target === e.currentTarget && setEditing(false)}>
          <div className="w-[380px] max-w-[95vw] bg-[var(--bg2)] border border-[var(--border)] rounded-[28px] p-6 shadow-[0_40px_100px_rgba(0,0,0,.6)] animate-[slideUp_.3s_ease]" onClick={(e) => e.stopPropagation()}>
            <div className="font-[Sora] text-lg font-extrabold mb-5 flex items-center justify-between">
              Edit Profile
              <button onClick={() => setEditing(false)} className="bg-transparent border-none text-[var(--text2)] cursor-pointer text-xl"><i className="fa-solid fa-xmark" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text2)] mb-1.5">Bio</label>
                <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} maxLength={200} rows={3} className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] outline-none resize-none focus:border-[var(--accent)] transition-colors" placeholder="Tell us about yourself..." />
                <div className="text-xs text-[var(--text3)] text-right mt-1">{editBio.length}/200</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text2)] mb-1.5">Website</label>
                <input type="url" value={editWebsite} onChange={(e) => setEditWebsite(e.target.value)} className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors" placeholder="https://" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text2)] mb-1.5">Location</label>
                <input type="text" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors" placeholder="City, Country" />
              </div>
              <button onClick={saveProfile} disabled={saving} className="w-full py-3 bg-[var(--accent)] border-none rounded-[16px] text-white text-sm font-bold cursor-pointer hover:bg-[#5855d6] hover:-translate-y-[1px] transition-all disabled:opacity-60">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
