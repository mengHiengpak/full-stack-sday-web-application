import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

const isClient = typeof window !== 'undefined';

API.interceptors.request.use((config) => {
  if (isClient) {
    const token = localStorage.getItem('sbay_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && isClient) {
      localStorage.removeItem('sbay_token');
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  },
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  me: () => API.get('/auth/me'),
};

export const postsAPI = {
  feed: (page = 1, limit = 10) => API.get(`/posts?page=${page}&limit=${limit}`),
  explore: (page = 1, limit = 10) => API.get(`/posts/explore?page=${page}&limit=${limit}`),
  get: (id) => API.get(`/posts/${id}`),
  create: (data) => API.post('/posts', data),
  update: (id, data) => API.put(`/posts/${id}`, data),
  like: (id) => API.post(`/posts/${id}/like`),
  share: (id) => API.post(`/posts/${id}/share`),
  delete: (id) => API.delete(`/posts/${id}`),
};

export const commentsAPI = {
  get: (postId) => API.get(`/comments/post/${postId}`),
  create: (postId, content, parentCommentId) => API.post(`/comments/post/${postId}`, { content, parentCommentId }),
  like: (id) => API.post(`/comments/${id}/like`),
  delete: (id) => API.delete(`/comments/${id}`),
};

export const usersAPI = {
  get: (id) => API.get(`/users/${id}`),
  getPosts: (id, page = 1, limit = 10) => API.get(`/users/${id}/posts?page=${page}&limit=${limit}`),
  suggested: (limit = 5) => API.get(`/users/suggested?limit=${limit}`),
  search: (q) => API.get(`/users/search?q=${q}`),
  follow: (id) => API.post(`/users/${id}/follow`),
  updateProfile: (data) => API.put('/users/profile/update', data),
  updateAvatar: (data) => API.put('/users/profile/avatar', data),
  updateCover: (data) => API.put('/users/profile/cover', data),
};

export const storiesAPI = {
  get: () => API.get('/stories'),
  create: (data) => API.post('/stories', data),
  delete: (id) => API.delete(`/stories/${id}`),
};

export const chatAPI = {
  createOrGet: (receiverId) => API.post('/chat', { receiverId }),
  getAll: () => API.get('/chat'),
  getMessages: (chatId, page = 1, limit = 50) => API.get(`/chat/${chatId}/messages?page=${page}&limit=${limit}`),
  sendMessage: (chatId, data) => API.post(`/chat/${chatId}/messages`, data),
  deleteMessage: (messageId) => API.delete(`/chat/messages/${messageId}`),
  deleteChat: (chatId) => API.delete(`/chat/${chatId}`),
  blockUser: (userId) => API.post(`/users/${userId}/block`),
};

export const friendsAPI = {
  sendRequest: (userId) => API.post(`/friends/request/${userId}`),
  respond: (requestId, status) => API.post(`/friends/respond/${requestId}`, { status }),
  getRequests: () => API.get('/friends/requests'),
  getList: () => API.get('/friends/list'),
  unfriend: (userId) => API.delete(`/friends/unfriend/${userId}`),
};

export const reactionsAPI = {
  togglePost: (postId, type) => API.post(`/reactions/post/${postId}`, { type }),
  toggleComment: (commentId, type) => API.post(`/reactions/comment/${commentId}`, { type }),
  toggleStory: (storyId, type) => API.post(`/reactions/story/${storyId}`, { type }),
  getPost: (postId) => API.get(`/reactions/post/${postId}`),
  getStory: (storyId) => API.get(`/reactions/story/${storyId}`),
};

export const storyCommentsAPI = {
  get: (storyId) => API.get(`/story-comments/${storyId}`),
  create: (storyId, content) => API.post(`/story-comments/${storyId}`, { content }),
  delete: (commentId) => API.delete(`/story-comments/${commentId}`),
};

export const notificationsAPI = {
  get: () => API.get('/notifications'),
  markRead: (id) => API.put(`/notifications/${id}/read`),
  markAllRead: () => API.put('/notifications/read-all'),
  unreadCount: () => API.get('/notifications/unread-count'),
};

export const marketplaceAPI = {
  getAll: () => API.get('/marketplace'),
  get: (id) => API.get(`/marketplace/${id}`),
  create: (data) => API.post('/marketplace', data),
  update: (id, data) => API.put(`/marketplace/${id}`, data),
  delete: (id) => API.delete(`/marketplace/${id}`),
  uploadImage: (id, data) => API.post(`/marketplace/${id}/images`, data),
};

export default API;
