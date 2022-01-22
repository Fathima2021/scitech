import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface tblProjectCaseAttributes {
  case_id?: number;
  project_name?: string;
  case_name?: string;
  tenant_id?: number;
  project_id?: number;
  description?: string;
  created?: Date;
  modified?: Date;
  created_by?: string;
  modified_by?: string;
  status?: number;
}

export type tblProjectCaseOptionalAttributes =
  | 'case_id'
  | 'project_name'
  | 'case_name'
  | 'tenant_id'
  | 'project_id'
  | 'description'
  | 'created'
  | 'modified'
  | 'created_by'
  | 'modified_by'
  | 'status';
export type tblProjectCaseCreationAttributes = Optional<tblProjectCaseAttributes, tblProjectCaseOptionalAttributes>;

export class tblProjectCase
  extends Model<tblProjectCaseAttributes, tblProjectCaseCreationAttributes>
  implements tblProjectCaseAttributes
{
  case_id?: number;
  project_name?: string;
  case_name?: string;
  tenant_id?: number;
  project_id?: number;
  description?: string;
  created?: Date;
  modified?: Date;
  created_by?: string;
  modified_by?: string;
  status?: number;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblProjectCase {
    tblProjectCase.init(
      {
        case_id: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        project_name: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        case_name: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        tenant_id: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        project_id: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        description: {
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
        tableName: 'tblProjectCase',
        schema: 'dbo',
        timestamps: false
      }
    );
    return tblProjectCase;
  }
}
