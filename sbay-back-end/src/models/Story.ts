import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface StoryAttributes {
  id: number;
  userId: number;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface StoryCreationAttributes extends Optional<StoryAttributes, 'id' | 'mediaUrl' | 'mediaType' | 'caption' | 'createdAt' | 'updatedAt'> {}

class Story extends Model<StoryAttributes, StoryCreationAttributes> implements StoryAttributes {
  declare id: number;
  declare userId: number;
  declare mediaUrl: string;
  declare mediaType: 'image' | 'video';
  declare caption: string;
  declare expiresAt: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Story.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    mediaUrl: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    mediaType: {
      type: DataTypes.ENUM('image', 'video'),
      defaultValue: 'image',
    },
    caption: {
      type: DataTypes.STRING(200),
      defaultValue: '',
    },
    expiresAt: {
      type: DataTypes.DATE,
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
    tableName: 'Stories',
  }
);

export default Story;
