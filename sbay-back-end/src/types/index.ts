import { Request } from 'express';
import { User } from '../models';

export interface IUser {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  profilePicture: string;
  coverPhoto: string;
  bio: string;
  website: string;
  location: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

export interface IPost {
  id: number;
  authorId: number;
  title: string;
  content: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'none';
  mediaPublicId: string;
  shareCount: number;
  visibility: 'public' | 'friends' | 'private';
  tags: string[];
  isEdited: boolean;
  editHistory: { title?: string; content?: string; editedAt: Date }[];
  createdAt: Date;
  updatedAt: Date;
  commentCount?: number;
}

export interface IComment {
  id: number;
  postId: number;
  authorId: number;
  content: string;
  parentCommentId: number | null;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChat {
  id: number;
  participants: number[];
  lastMessage: string;
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatMessage {
  id: number;
  chatId: number;
  senderId: number;
  content: string;
  mediaUrl: string;
  mediaType: string;
  readAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFriendRequest {
  id: number;
  senderId: number;
  receiverId: number;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  updatedAt: Date;
}

export interface IReaction {
  id: number;
  postId: number | null;
  commentId: number | null;
  storyId: number | null;
  userId: number;
  type: 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry' | 'fire';
  createdAt: Date;
}

export interface IStoryComment {
  id: number;
  storyId: number;
  authorId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthPayload {
  id: string;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}
