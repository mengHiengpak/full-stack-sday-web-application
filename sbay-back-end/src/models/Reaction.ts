import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ReactionAttributes {
  id: number;
  postId: number | null;
  commentId: number | null;
  storyId: number | null;
  userId: number;
  type: 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry' | 'fire';
  createdAt: Date;
}

interface ReactionCreationAttributes extends Optional<ReactionAttributes, 'id' | 'createdAt'> {}

class Reaction extends Model<ReactionAttributes, ReactionCreationAttributes> implements ReactionAttributes {
  declare id: number;
  declare postId: number | null;
  declare commentId: number | null;
  declare storyId: number | null;
  declare userId: number;
  declare type: 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry' | 'fire';
  declare readonly createdAt: Date;
}

Reaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Posts',
        key: 'id',
      },
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Comments',
        key: 'id',
      },
    },
    storyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Stories',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.ENUM('like', 'love', 'haha', 'wow', 'sad', 'angry', 'fire'),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'Reactions',
    timestamps: false,
  }
);

export default Reaction;
