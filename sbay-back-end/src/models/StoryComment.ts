import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface StoryCommentAttributes {
  id: number;
  storyId: number;
  authorId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface StoryCommentCreationAttributes extends Optional<StoryCommentAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class StoryComment extends Model<StoryCommentAttributes, StoryCommentCreationAttributes> implements StoryCommentAttributes {
  declare id: number;
  declare storyId: number;
  declare authorId: number;
  declare content: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

StoryComment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    storyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Stories',
        key: 'id',
      },
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
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
    tableName: 'StoryComments',
  }
);

export default StoryComment;
