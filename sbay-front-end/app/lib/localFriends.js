function reqKey(userId) { return `sbay_friend_requests_${userId}`; }
function listKey(userId) { return `sbay_friend_list_${userId}`; }

function get(key) {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}

function set(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

export function sendFriendRequest(fromUserId, toUserId, fromUsername) {
  const requests = get(reqKey(toUserId));
  if (requests.some((r) => r.fromUserId === fromUserId && r.toUserId === toUserId)) return;
  requests.push({
    id: `fr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    fromUserId,
    toUserId,
    fromUsername,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
  set(reqKey(toUserId), requests);
}

export function respondToRequest(currentUserId, requestId, status) {
  const requests = get(reqKey(currentUserId));
  const idx = requests.findIndex((r) => r.id === requestId);
  if (idx === -1) return null;
  requests[idx].status = status;
  requests[idx].respondedAt = new Date().toISOString();
  set(reqKey(currentUserId), requests);
  if (status === 'accepted') {
    const req = requests[idx];
    let friends = get(listKey(currentUserId));
    if (!friends.some((f) => f.userId === req.fromUserId)) {
      friends.push({ userId: req.fromUserId, username: req.fromUsername, since: new Date().toISOString() });
    }
    set(listKey(currentUserId), friends);
  }
  return requests[idx];
}

export function getFriendRequestsForUser(userId) {
  return get(reqKey(userId)).filter((r) => r.status === 'pending');
}

export function getFriendList(userId) {
  return get(listKey(userId));
}

export function isFriend(currentUserId, targetUserId) {
  return get(listKey(currentUserId)).some((f) => f.userId === targetUserId);
}

export function getFriendStatus(currentUserId, otherUserId) {
  if (currentUserId === otherUserId) return 'none';
  if (isFriend(currentUserId, otherUserId)) return 'friends';
  const requestsToMe = get(reqKey(currentUserId));
  if (requestsToMe.some((r) => r.fromUserId === otherUserId && r.status === 'pending')) return 'received';
  const requestsFromMe = get(reqKey(otherUserId));
  if (requestsFromMe.some((r) => r.fromUserId === currentUserId && r.status === 'pending')) return 'sent';
  return 'none';
}

export function getPendingRequestId(currentUserId, fromUserId) {
  const requests = get(reqKey(currentUserId));
  const req = requests.find(
    (r) => r.fromUserId === fromUserId && r.status === 'pending'
  );
  return req?.id || null;
}

export function unfriend(currentUserId, targetUserId) {
  let friends = get(listKey(currentUserId));
  friends = friends.filter((f) => f.userId !== targetUserId);
  set(listKey(currentUserId), friends);
}
