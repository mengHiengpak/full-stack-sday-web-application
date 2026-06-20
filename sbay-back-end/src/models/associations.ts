import User from './User';
import Post from './Post';
import Comment from './Comment';
import Story from './Story';
import Chat from './Chat';
import ChatMessage from './ChatMessage';
import FriendRequest from './FriendRequest';
import Reaction from './Reaction';
import StoryComment from './StoryComment';

User.belongsToMany(User, {
  as: 'followers',
  through: 'UserFollows',
  foreignKey: 'followingId',
  otherKey: 'followerId',
  timestamps: false,
});

User.belongsToMany(User, {
  as: 'following',
  through: 'UserFollows',
  foreignKey: 'followerId',
  otherKey: 'followingId',
  timestamps: false,
});

Post.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
User.hasMany(Post, { foreignKey: 'authorId' });

Post.belongsToMany(User, {
  as: 'LikedByUsers',
  through: 'PostLikes',
  foreignKey: 'postId',
  otherKey: 'userId',
  timestamps: false,
});
User.belongsToMany(Post, {
  as: 'LikedPosts',
  through: 'PostLikes',
  foreignKey: 'userId',
  otherKey: 'postId',
  timestamps: false,
});

Post.belongsToMany(User, {
  as: 'SharedByUsers',
  through: 'PostShares',
  foreignKey: 'postId',
  otherKey: 'userId',
  timestamps: false,
});
User.belongsToMany(Post, {
  as: 'SharedPosts',
  through: 'PostShares',
  foreignKey: 'userId',
  otherKey: 'postId',
  timestamps: false,
});

Comment.belongsTo(Post, { foreignKey: 'postId' });
Post.hasMany(Comment, { foreignKey: 'postId' });

Comment.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
User.hasMany(Comment, { foreignKey: 'authorId' });

Comment.belongsTo(Comment, { as: 'parentComment', foreignKey: 'parentCommentId' });
Comment.hasMany(Comment, { as: 'replies', foreignKey: 'parentCommentId' });

Comment.belongsToMany(User, {
  as: 'LikedByUsers',
  through: 'CommentLikes',
  foreignKey: 'commentId',
  otherKey: 'userId',
  timestamps: false,
});
User.belongsToMany(Comment, {
  as: 'LikedComments',
  through: 'CommentLikes',
  foreignKey: 'userId',
  otherKey: 'commentId',
  timestamps: false,
});

Story.belongsTo(User, { as: 'author', foreignKey: 'userId' });
User.hasMany(Story, { foreignKey: 'userId' });

Chat.belongsToMany(User, { as: 'Participants', through: 'ChatParticipants', foreignKey: 'chatId', otherKey: 'userId', timestamps: false });
User.belongsToMany(Chat, { as: 'Chats', through: 'ChatParticipants', foreignKey: 'userId', otherKey: 'chatId', timestamps: false });

Chat.hasMany(ChatMessage, { foreignKey: 'chatId' });
ChatMessage.belongsTo(Chat, { foreignKey: 'chatId' });

ChatMessage.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
User.hasMany(ChatMessage, { foreignKey: 'senderId' });

FriendRequest.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
FriendRequest.belongsTo(User, { as: 'receiver', foreignKey: 'receiverId' });
User.hasMany(FriendRequest, { as: 'SentRequests', foreignKey: 'senderId' });
User.hasMany(FriendRequest, { as: 'ReceivedRequests', foreignKey: 'receiverId' });

Reaction.belongsTo(User, { as: 'user', foreignKey: 'userId' });
Reaction.belongsTo(Post, { foreignKey: 'postId' });
Reaction.belongsTo(Comment, { foreignKey: 'commentId' });
Reaction.belongsTo(Story, { foreignKey: 'storyId' });
Post.hasMany(Reaction, { foreignKey: 'postId' });
Story.hasMany(Reaction, { foreignKey: 'storyId' });

StoryComment.belongsTo(Story, { foreignKey: 'storyId' });
StoryComment.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
Story.hasMany(StoryComment, { foreignKey: 'storyId' });

export { User, Post, Comment, Story, Chat, ChatMessage, FriendRequest, Reaction, StoryComment };
