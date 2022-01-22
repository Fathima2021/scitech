import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface tblUserProfileAttributes {
  id?: number;
  user_name?: string;
  status?: number;
  last_login_time?: Date;
  login_status?: number;
  last_session_details?: string;
  preference?: string;
  favourites?: string;
}

export type tblUserProfilePk = 'id';
export type tblUserProfileId = tblUserProfile[tblUserProfilePk];
export type tblUserProfileOptionalAttributes =
  | 'id'
  | 'user_name'
  | 'status'
  | 'last_login_time'
  | 'login_status'
  | 'last_session_details'
  | 'preference'
  | 'favourites';
export type tblUserProfileCreationAttributes = Optional<tblUserProfileAttributes, tblUserProfileOptionalAttributes>;

export class tblUserProfile
  extends Model<tblUserProfileAttributes, tblUserProfileCreationAttributes>
  implements tblUserProfileAttributes
{
  id?: number;
  user_name?: string;
  status?: number;
  last_login_time?: Date;
  login_status?: number;
  last_session_details?: string;
  preference?: string;
  favourites?: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblUserProfile {
    tblUserProfile.init(
      {
        id: {
          type: DataTypes.BIGINT,
          allowNull: true,
          primaryKey: true
        },
        user_name: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        last_login_time: {
          type: DataTypes.DATE,
          allowNull: true
        },
        login_status: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        last_session_details: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        preference: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        favourites: {
          type: DataTypes.TEXT,
          allowNull: true
        }
      },
      {
        sequelize,
        tableName: 'tblUserProfile',
        schema: 'dbo',
        timestamps: false
      }
    );
    return tblUserProfile;
  }
}
