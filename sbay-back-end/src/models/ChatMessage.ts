import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ChatMessageAttributes {
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

interface ChatMessageCreationAttributes extends Optional<ChatMessageAttributes, 'id' | 'mediaUrl' | 'mediaType' | 'readAt' | 'createdAt' | 'updatedAt'> {}

class ChatMessage extends Model<ChatMessageAttributes, ChatMessageCreationAttributes> implements ChatMessageAttributes {
  declare id: number;
  declare chatId: number;
  declare senderId: number;
  declare content: string;
  declare mediaUrl: string;
  declare mediaType: string;
  declare readAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

ChatMessage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    chatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Chats',
        key: 'id',
      },
    },
    senderId: {
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
      defaultValue: '',
    },
    mediaUrl: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    mediaType: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: 'ChatMessages',
  }
);

export default ChatMessage;
