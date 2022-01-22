import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface tblRoleAttributes {
  id: number;
  name?: string;
  description?: string;
  active?: number;
}

export type tblRolePk = 'id';
export type tblRoleId = tblRole[tblRolePk];
export type tblRoleOptionalAttributes = 'id' | 'name' | 'description' | 'active';
export type tblRoleCreationAttributes = Optional<tblRoleAttributes, tblRoleOptionalAttributes>;

export class tblRole extends Model<tblRoleAttributes, tblRoleCreationAttributes> implements tblRoleAttributes {
  id!: number;
  name?: string;
  description?: string;
  active?: number;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblRole {
    tblRole.init(
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
        description: {
          type: DataTypes.STRING(500),
          allowNull: true
        },
        active: {
          type: DataTypes.TINYINT,
          allowNull: true,
          defaultValue: 1
        }
      },
      {
        sequelize,
        tableName: 'tblRole',
        schema: 'dbo',
        timestamps: false,
        indexes: [
          {
            name: 'tblRole_index',
            unique: true,
            fields: [{ name: 'id' }]
          }
        ]
      }
    );
    return tblRole;
  }
}
