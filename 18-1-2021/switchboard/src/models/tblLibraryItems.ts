import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { tblLibraryItemTree, tblLibraryItemTreeId } from './tblLibraryItemTree';

export interface tblLibraryItemsAttributes {
  case_id: number;
  title?: string;
  is_secured: number;
  tenant_id?: number;
  item_version?: number;
  file_path?: string;
  created?: Date;
  created_by?: string;
  modified_by?: string;
  status?: number;
  type?: string;
  size?: string;
  in_use?: number;
  tag?: string;
  keywords?: string;
  check_in_status?: number;
  check_out_by?: string;
  name?: string;
  owned_by?: string;
  modified?: Date;
  library_item_id: number;
}

export type tblLibraryItemsPk = 'library_item_id';
export type tblLibraryItemsId = tblLibraryItems[tblLibraryItemsPk];
export type tblLibraryItemsOptionalAttributes =
  | 'title'
  | 'tenant_id'
  | 'item_version'
  | 'file_path'
  | 'created'
  | 'created_by'
  | 'modified_by'
  | 'status'
  | 'type'
  | 'size'
  | 'in_use'
  | 'tag'
  | 'keywords'
  | 'check_in_status'
  | 'check_out_by'
  | 'name'
  | 'owned_by'
  | 'modified'
  | 'library_item_id';
export type tblLibraryItemsCreationAttributes = Optional<tblLibraryItemsAttributes, tblLibraryItemsOptionalAttributes>;

export class tblLibraryItems
  extends Model<tblLibraryItemsAttributes, tblLibraryItemsCreationAttributes>
  implements tblLibraryItemsAttributes
{
  case_id!: number;
  title?: string;
  is_secured!: number;
  tenant_id?: number;
  item_version?: number;
  file_path?: string;
  created?: Date;
  created_by?: string;
  modified_by?: string;
  status?: number;
  type?: string;
  size?: string;
  in_use?: number;
  tag?: string;
  keywords?: string;
  check_in_status?: number;
  check_out_by?: string;
  name?: string;
  owned_by?: string;
  modified?: Date;
  library_item_id!: number;

  // tblLibraryItems hasMany tblLibraryItemTree via library_item_id
  tblLibraryItemTrees!: tblLibraryItemTree[];
  getTblLibraryItemTrees!: Sequelize.HasManyGetAssociationsMixin<tblLibraryItemTree>;
  setTblLibraryItemTrees!: Sequelize.HasManySetAssociationsMixin<tblLibraryItemTree, tblLibraryItemTreeId>;
  addTblLibraryItemTree!: Sequelize.HasManyAddAssociationMixin<tblLibraryItemTree, tblLibraryItemTreeId>;
  addTblLibraryItemTrees!: Sequelize.HasManyAddAssociationsMixin<tblLibraryItemTree, tblLibraryItemTreeId>;
  createTblLibraryItemTree!: Sequelize.HasManyCreateAssociationMixin<tblLibraryItemTree>;
  removeTblLibraryItemTree!: Sequelize.HasManyRemoveAssociationMixin<tblLibraryItemTree, tblLibraryItemTreeId>;
  removeTblLibraryItemTrees!: Sequelize.HasManyRemoveAssociationsMixin<tblLibraryItemTree, tblLibraryItemTreeId>;
  hasTblLibraryItemTree!: Sequelize.HasManyHasAssociationMixin<tblLibraryItemTree, tblLibraryItemTreeId>;
  hasTblLibraryItemTrees!: Sequelize.HasManyHasAssociationsMixin<tblLibraryItemTree, tblLibraryItemTreeId>;
  countTblLibraryItemTrees!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblLibraryItems {
    tblLibraryItems.init(
      {
        case_id: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        title: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        is_secured: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        tenant_id: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        item_version: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        file_path: {
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
        type: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        size: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        in_use: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        tag: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        keywords: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        check_in_status: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        check_out_by: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        name: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        owned_by: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        modified: {
          type: DataTypes.DATE,
          allowNull: true
        },
        library_item_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        }
      },
      {
        sequelize,
        tableName: 'tblLibraryItems',
        schema: 'dbo',
        timestamps: false,
        indexes: [
          {
            name: 'PK__tblLibra__AEB8759F95C00D7B',
            unique: true,
            fields: [{ name: 'library_item_id' }]
          }
        ]
      }
    );
    return tblLibraryItems;
  }
}
