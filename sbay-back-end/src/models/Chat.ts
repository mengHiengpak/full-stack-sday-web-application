import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ChatAttributes {
  id: number;
  participants: number[];
  lastMessage: string;
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ChatCreationAttributes extends Optional<ChatAttributes, 'id' | 'lastMessage' | 'lastMessageAt' | 'createdAt' | 'updatedAt'> {}

class Chat extends Model<ChatAttributes, ChatCreationAttributes> implements ChatAttributes {
  declare id: number;
  declare participants: number[];
  declare lastMessage: string;
  declare lastMessageAt: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Chat.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    participants: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
      defaultValue: [],
    },
    lastMessage: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    lastMessageAt: {
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
    tableName: 'Chats',
  }
);

export default Chat;
