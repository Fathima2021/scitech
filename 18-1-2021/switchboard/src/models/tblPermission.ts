import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface tblPermissionAttributes {
  id: number;
  name?: string;
  method?: string;
  resource?: string;
}

export type tblPermissionPk = 'id';
export type tblPermissionId = tblPermission[tblPermissionPk];
export type tblPermissionOptionalAttributes = 'id' | 'name' | 'method' | 'resource';
export type tblPermissionCreationAttributes = Optional<tblPermissionAttributes, tblPermissionOptionalAttributes>;

export class tblPermission
  extends Model<tblPermissionAttributes, tblPermissionCreationAttributes>
  implements tblPermissionAttributes
{
  id!: number;
  name?: string;
  method?: string;
  resource?: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblPermission {
    tblPermission.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true
        },
        name: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        method: {
          type: DataTypes.STRING(200),
          allowNull: true
        },
        resource: {
          type: DataTypes.STRING(100),
          allowNull: true
        }
      },
      {
        sequelize,
        tableName: 'tblPermission',
        schema: 'dbo',
        timestamps: false,
        indexes: [
          {
            name: 'tblPermissions_pk',
            unique: true,
            fields: [{ name: 'id' }]
          }
        ]
      }
    );
    return tblPermission;
  }
}
