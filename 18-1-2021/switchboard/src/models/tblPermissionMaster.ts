import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface tblPermissionMasterAttributes {
  id: number;
  permission_name?: string;
  resource?: string;
  method?: string;
  description?: string;
  status?: number;
}

export type tblPermissionMasterPk = 'id';
export type tblPermissionMasterId = tblPermissionMaster[tblPermissionMasterPk];
export type tblPermissionMasterOptionalAttributes =
  | 'id'
  | 'permission_name'
  | 'resource'
  | 'method'
  | 'description'
  | 'status';
export type tblPermissionMasterCreationAttributes = Optional<
  tblPermissionMasterAttributes,
  tblPermissionMasterOptionalAttributes
>;

export class tblPermissionMaster
  extends Model<tblPermissionMasterAttributes, tblPermissionMasterCreationAttributes>
  implements tblPermissionMasterAttributes
{
  id!: number;
  permission_name?: string;
  resource?: string;
  method?: string;
  description?: string;
  status?: number;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblPermissionMaster {
    tblPermissionMaster.init(
      {
        id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        permission_name: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        resource: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        method: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        description: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: true
        }
      },
      {
        sequelize,
        tableName: 'tblPermissionMaster',
        schema: 'dbo',
        timestamps: false
      }
    );
    return tblPermissionMaster;
  }
}
