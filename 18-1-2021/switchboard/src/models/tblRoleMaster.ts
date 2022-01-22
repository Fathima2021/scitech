import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface tblRoleMasterAttributes {
  id: number;
  role_name?: string;
  description?: string;
  status?: number;
}

export type tblRoleMasterPk = 'id';
export type tblRoleMasterId = tblRoleMaster[tblRoleMasterPk];
export type tblRoleMasterOptionalAttributes = 'id' | 'role_name' | 'description' | 'status';
export type tblRoleMasterCreationAttributes = Optional<tblRoleMasterAttributes, tblRoleMasterOptionalAttributes>;

export class tblRoleMaster
  extends Model<tblRoleMasterAttributes, tblRoleMasterCreationAttributes>
  implements tblRoleMasterAttributes
{
  id!: number;
  role_name?: string;
  description?: string;
  status?: number;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblRoleMaster {
    tblRoleMaster.init(
      {
        id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        role_name: {
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
        tableName: 'tblRoleMaster',
        schema: 'dbo',
        timestamps: false
      }
    );
    return tblRoleMaster;
  }
}
