import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface tblProjectsAttributes {
  id?: number;
  tenant_id?: number;
  project_name?: string;
  description?: string;
  target_storage_server?: string;
  target_base_directory?: string;
  created?: Date;
  created_by?: string;
  modified_by?: string;
  status?: number;
  modified?: Date;
}

export type tblProjectsPk = 'id';
export type tblProjectsId = tblProjects[tblProjectsPk];
export type tblProjectsOptionalAttributes =
  | 'id'
  | 'tenant_id'
  | 'project_name'
  | 'description'
  | 'target_storage_server'
  | 'target_base_directory'
  | 'created'
  | 'created_by'
  | 'modified_by'
  | 'status'
  | 'modified';
export type tblProjectsCreationAttributes = Optional<tblProjectsAttributes, tblProjectsOptionalAttributes>;

export class tblProjects
  extends Model<tblProjectsAttributes, tblProjectsCreationAttributes>
  implements tblProjectsAttributes
{
  id?: number;
  tenant_id?: number;
  project_name?: string;
  description?: string;
  target_storage_server?: string;
  target_base_directory?: string;
  created?: Date;
  created_by?: string;
  modified_by?: string;
  status?: number;
  modified?: Date;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblProjects {
    tblProjects.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          primaryKey: true
        },
        tenant_id: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        project_name: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        description: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        target_storage_server: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        target_base_directory: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        created: {
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
        },
        modified: {
          type: DataTypes.DATE,
          allowNull: true
        }
      },
      {
        sequelize,
        tableName: 'tblProjects',
        schema: 'dbo',
        timestamps: false
      }
    );
    return tblProjects;
  }
}
