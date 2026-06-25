import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface EditHistoryEntry {
  title?: string;
  content?: string;
  editedAt: Date;
}

interface PostAttributes {
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
  editHistory: EditHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
}

interface PostCreationAttributes extends Optional<PostAttributes, 'id' | 'title' | 'content' | 'mediaUrl' | 'mediaType' | 'mediaPublicId' | 'shareCount' | 'visibility' | 'tags' | 'isEdited' | 'editHistory' | 'createdAt' | 'updatedAt'> {}

class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
  declare id: number;
  declare authorId: number;
  declare title: string;
  declare content: string;
  declare mediaUrl: string;
  declare mediaType: 'image' | 'video' | 'none';
  declare mediaPublicId: string;
  declare shareCount: number;
  declare visibility: 'public' | 'friends' | 'private';
  declare tags: string[];
  declare isEdited: boolean;
  declare editHistory: EditHistoryEntry[];
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  declare commentCount?: number;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING(200),
      defaultValue: '',
    },
    content: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    mediaUrl: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    mediaType: {
      type: DataTypes.ENUM('image', 'video', 'none'),
      defaultValue: 'none',
    },
    mediaPublicId: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    shareCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    visibility: {
      type: DataTypes.ENUM('public', 'friends', 'private'),
      defaultValue: 'public',
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    isEdited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    editHistory: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'Posts',
    indexes: [
      { name: 'posts_author_id_created_at_idx', fields: ['authorId', 'createdAt'] },
      { name: 'posts_visibility_created_at_idx', fields: ['visibility', 'createdAt'] },
    ],
  }
);

export default Post;
