import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { tblLibraryItems, tblLibraryItemsId } from './tblLibraryItems';

export interface tblLibraryItemTreeAttributes {
  id: number;
  library_item_id: number;
  parent_id?: number;
  tenant_id?: number;
  item_version?: number;
}

export type tblLibraryItemTreePk = 'id';
export type tblLibraryItemTreeId = tblLibraryItemTree[tblLibraryItemTreePk];
export type tblLibraryItemTreeOptionalAttributes = 'id' | 'parent_id' | 'tenant_id' | 'item_version';
export type tblLibraryItemTreeCreationAttributes = Optional<
  tblLibraryItemTreeAttributes,
  tblLibraryItemTreeOptionalAttributes
>;

export class tblLibraryItemTree
  extends Model<tblLibraryItemTreeAttributes, tblLibraryItemTreeCreationAttributes>
  implements tblLibraryItemTreeAttributes
{
  id!: number;
  library_item_id!: number;
  parent_id?: number;
  tenant_id?: number;
  item_version?: number;

  // tblLibraryItemTree belongsTo tblLibraryItems via library_item_id
  library_item!: tblLibraryItems;
  getLibrary_item!: Sequelize.BelongsToGetAssociationMixin<tblLibraryItems>;
  setLibrary_item!: Sequelize.BelongsToSetAssociationMixin<tblLibraryItems, tblLibraryItemsId>;
  createLibrary_item!: Sequelize.BelongsToCreateAssociationMixin<tblLibraryItems>;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblLibraryItemTree {
    tblLibraryItemTree.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        library_item_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'tblLibraryItems',
            key: 'library_item_id'
          }
        },
        parent_id: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        tenant_id: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        item_version: {
          type: DataTypes.INTEGER,
          allowNull: true
        }
      },
      {
        sequelize,
        tableName: 'tblLibraryItemTree',
        schema: 'dbo',
        timestamps: false,
        indexes: [
          {
            name: 'PK__tblLibra__3213E83F5EF51243',
            unique: true,
            fields: [{ name: 'id' }]
          }
        ]
      }
    );
    return tblLibraryItemTree;
  }
}
