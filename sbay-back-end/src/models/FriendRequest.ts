import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface FriendRequestAttributes {
  id: number;
  senderId: number;
  receiverId: number;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  updatedAt: Date;
}

interface FriendRequestCreationAttributes extends Optional<FriendRequestAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'> {}

class FriendRequest extends Model<FriendRequestAttributes, FriendRequestCreationAttributes> implements FriendRequestAttributes {
  declare id: number;
  declare senderId: number;
  declare receiverId: number;
  declare status: 'pending' | 'accepted' | 'declined';
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

FriendRequest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'declined'),
      defaultValue: 'pending',
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
    tableName: 'FriendRequests',
  }
);

export default FriendRequest;
