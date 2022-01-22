import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface tblTenantMasterAttributes {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  created?: Date;
  modified?: Date;
  created_by?: string;
  modified_by?: string;
  status?: number;
}

export type tblTenantMasterPk = 'id';
export type tblTenantMasterId = tblTenantMaster[tblTenantMasterPk];
export type tblTenantMasterOptionalAttributes =
  | 'id'
  | 'name'
  | 'email'
  | 'phone'
  | 'address'
  | 'created'
  | 'modified'
  | 'created_by'
  | 'modified_by'
  | 'status';
export type tblTenantMasterCreationAttributes = Optional<tblTenantMasterAttributes, tblTenantMasterOptionalAttributes>;

export class tblTenantMaster
  extends Model<tblTenantMasterAttributes, tblTenantMasterCreationAttributes>
  implements tblTenantMasterAttributes
{
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  created?: Date;
  modified?: Date;
  created_by?: string;
  modified_by?: string;
  status?: number;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblTenantMaster {
    tblTenantMaster.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          primaryKey: true
        },
        name: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        email: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        phone: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        address: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        created: {
          type: DataTypes.DATE,
          allowNull: true
        },
        modified: {
          type: DataTypes.DATE,
          allowNull: true
        },
        created_by: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        modified_by: {
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
        tableName: 'tblTenantMaster',
        schema: 'dbo',
        timestamps: false
      }
    );
    return tblTenantMaster;
  }
}
