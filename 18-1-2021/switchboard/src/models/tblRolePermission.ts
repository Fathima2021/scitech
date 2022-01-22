import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface tblRolePermissionAttributes {
  id: number;
  role?: number;
  permission?: number;
}

export type tblRolePermissionPk = 'id';
export type tblRolePermissionId = tblRolePermission[tblRolePermissionPk];
export type tblRolePermissionOptionalAttributes = 'id' | 'role' | 'permission';
export type tblRolePermissionCreationAttributes = Optional<
  tblRolePermissionAttributes,
  tblRolePermissionOptionalAttributes
>;

export class tblRolePermission
  extends Model<tblRolePermissionAttributes, tblRolePermissionCreationAttributes>
  implements tblRolePermissionAttributes
{
  id!: number;
  role?: number;
  permission?: number;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblRolePermission {
    tblRolePermission.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true
        },
        role: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        permission: {
          type: DataTypes.INTEGER,
          allowNull: true
        }
      },
      {
        sequelize,
        tableName: 'tblRolePermission',
        schema: 'dbo',
        timestamps: false,
        indexes: [
          {
            name: 'tblRolePermission_pk',
            unique: true,
            fields: [{ name: 'id' }]
          }
        ]
      }
    );
    return tblRolePermission;
  }
}
