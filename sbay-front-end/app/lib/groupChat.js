const GROUPS_KEY = 'sbay_groups';
const GROUP_MSGS_KEY = 'sbay_group_messages';
let groupIdCounter = 0;

function getGroups() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(GROUPS_KEY) || '[]');
  } catch { return []; }
}

function saveGroups(groups) {
  try {
    localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
  } catch {}
}

function getGroupMessages() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(GROUP_MSGS_KEY) || '{}');
  } catch { return {}; }
}

function saveGroupMessages(data) {
  try {
    localStorage.setItem(GROUP_MSGS_KEY, JSON.stringify(data));
  } catch {}
}

export function createGroup(name, creatorId, members) {
  const groups = getGroups();
  groupIdCounter = groups.reduce((max, g) => Math.max(max, parseInt(g.id.replace('group_', '')) || 0), 0);
  groupIdCounter++;
  const group = {
    id: `group_${groupIdCounter}`,
    name,
    image: null,
    createdBy: creatorId,
    participants: members,
    lastMessage: null,
    lastMessageAt: null,
    updatedAt: new Date().toISOString(),
    isGroup: true,
  };
  groups.unshift(group);
  saveGroups(groups);
  const msgs = getGroupMessages();
  msgs[group.id] = [];
  saveGroupMessages(msgs);
  return group;
}

export function getGroupChats() {
  return getGroups();
}

export function getGroupById(id) {
  return getGroups().find((g) => g.id === id) || null;
}

export function sendGroupMessage(groupId, senderId, content) {
  const groups = getGroups();
  const group = groups.find((g) => g.id === groupId);
  if (!group) return null;
  const msgs = getGroupMessages();
  if (!msgs[groupId]) msgs[groupId] = [];
  const msg = {
    id: `gm_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    groupId,
    senderId,
    senderName: group.participants.find((p) => p.id === senderId)?.username || 'Unknown',
    content,
    createdAt: new Date().toISOString(),
    read: false,
  };
  msgs[groupId].push(msg);
  saveGroupMessages(msgs);
  group.lastMessage = msg;
  group.lastMessageAt = msg.createdAt;
  group.updatedAt = msg.createdAt;
  saveGroups(groups);
  return msg;
}

export function getGroupMessagesById(groupId) {
  const msgs = getGroupMessages();
  return msgs[groupId] || [];
}

export function addGroupMember(groupId, user) {
  const groups = getGroups();
  const group = groups.find((g) => g.id === groupId);
  if (!group) return null;
  if (group.participants.some((p) => p.id === user.id)) return group;
  group.participants.push(user);
  group.updatedAt = new Date().toISOString();
  saveGroups(groups);
  return group;
}

export function removeGroupMember(groupId, userId) {
  const groups = getGroups();
  const group = groups.find((g) => g.id === groupId);
  if (!group || group.createdBy === userId) return null;
  group.participants = group.participants.filter((p) => p.id !== userId);
  group.updatedAt = new Date().toISOString();
  saveGroups(groups);
  return group;
}

export function updateGroupName(groupId, name) {
  const groups = getGroups();
  const group = groups.find((g) => g.id === groupId);
  if (!group) return null;
  group.name = name;
  group.updatedAt = new Date().toISOString();
  saveGroups(groups);
  return group;
}
