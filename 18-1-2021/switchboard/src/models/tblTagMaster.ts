import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface tblTagMasterAttributes {
  tag_name?: string;
  is_deleted?: number;
  project_id?: number;
  case_id?: number;
  tag_id: number;
}

export type tblTagMasterPk = 'tag_id';
export type tblTagMasterId = tblTagMaster[tblTagMasterPk];
export type tblTagMasterOptionalAttributes = 'tag_name' | 'is_deleted' | 'project_id' | 'case_id' | 'tag_id';
export type tblTagMasterCreationAttributes = Optional<tblTagMasterAttributes, tblTagMasterOptionalAttributes>;

export class tblTagMaster
  extends Model<tblTagMasterAttributes, tblTagMasterCreationAttributes>
  implements tblTagMasterAttributes
{
  tag_name?: string;
  is_deleted?: number;
  project_id?: number;
  case_id?: number;
  tag_id!: number;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblTagMaster {
    tblTagMaster.init(
      {
        tag_name: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        is_deleted: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        project_id: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        case_id: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        tag_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        }
      },
      {
        sequelize,
        tableName: 'tblTagMaster',
        schema: 'dbo',
        timestamps: false,
        indexes: [
          {
            name: 'PK__tblTagMa__4296A2B6AF0C3FF1',
            unique: true,
            fields: [{ name: 'tag_id' }]
          }
        ]
      }
    );
    return tblTagMaster;
  }
}
