import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface tblLibraryItemsHistoryAttributes {
  object_id?: number;
  title?: string;
  tenant_id?: number;
  case_id?: number;
  item_version?: number;
  is_secured?: number;
  created?: Date;
  created_by?: string;
  comments?: string;
  file_path?: string;
  id: number;
  object_type?: string;
}

export type tblLibraryItemsHistoryPk = 'id';
export type tblLibraryItemsHistoryId = tblLibraryItemsHistory[tblLibraryItemsHistoryPk];
export type tblLibraryItemsHistoryOptionalAttributes =
  | 'object_id'
  | 'title'
  | 'tenant_id'
  | 'case_id'
  | 'item_version'
  | 'is_secured'
  | 'created'
  | 'created_by'
  | 'comments'
  | 'file_path'
  | 'id'
  | 'object_type';
export type tblLibraryItemsHistoryCreationAttributes = Optional<
  tblLibraryItemsHistoryAttributes,
  tblLibraryItemsHistoryOptionalAttributes
>;

export class tblLibraryItemsHistory
  extends Model<tblLibraryItemsHistoryAttributes, tblLibraryItemsHistoryCreationAttributes>
  implements tblLibraryItemsHistoryAttributes
{
  object_id?: number;
  title?: string;
  tenant_id?: number;
  case_id?: number;
  item_version?: number;
  is_secured?: number;
  created?: Date;
  created_by?: string;
  comments?: string;
  file_path?: string;
  id!: number;
  object_type?: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblLibraryItemsHistory {
    tblLibraryItemsHistory.init(
      {
        object_id: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        title: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        tenant_id: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        case_id: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        item_version: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        is_secured: {
          type: DataTypes.INTEGER,
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
        comments: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        file_path: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        object_type: {
          type: DataTypes.STRING(100),
          allowNull: true
        }
      },
      {
        sequelize,
        tableName: 'tblLibraryItemsHistory',
        schema: 'dbo',
        timestamps: false
      }
    );
    return tblLibraryItemsHistory;
  }
}
