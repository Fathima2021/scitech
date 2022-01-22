import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface tblItemMetadataAttributes {
  id?: number;
  tenant_id?: number;
  asset_id?: number;
  name?: string;
  type?: string;
  size?: string;
  created?: Date;
  modified?: Date;
  created_by?: string;
  modified_by?: string;
  in_use?: number;
  tag?: string;
  keywords?: string;
  check_in_status?: number;
  check_out_by?: string;
}

export type tblItemMetadataPk = 'id';
export type tblItemMetadataId = tblItemMetadata[tblItemMetadataPk];
export type tblItemMetadataOptionalAttributes =
  | 'id'
  | 'tenant_id'
  | 'asset_id'
  | 'name'
  | 'type'
  | 'size'
  | 'created'
  | 'modified'
  | 'created_by'
  | 'modified_by'
  | 'in_use'
  | 'tag'
  | 'keywords'
  | 'check_in_status'
  | 'check_out_by';
export type tblItemMetadataCreationAttributes = Optional<tblItemMetadataAttributes, tblItemMetadataOptionalAttributes>;

export class tblItemMetadata
  extends Model<tblItemMetadataAttributes, tblItemMetadataCreationAttributes>
  implements tblItemMetadataAttributes
{
  id?: number;
  tenant_id?: number;
  asset_id?: number;
  name?: string;
  type?: string;
  size?: string;
  created?: Date;
  modified?: Date;
  created_by?: string;
  modified_by?: string;
  in_use?: number;
  tag?: string;
  keywords?: string;
  check_in_status?: number;
  check_out_by?: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblItemMetadata {
    tblItemMetadata.init(
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
        asset_id: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        name: {
          type: DataTypes.STRING(100),
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
        }
      },
      {
        sequelize,
        tableName: 'tblItemMetadata',
        schema: 'dbo',
        timestamps: false
      }
    );
    return tblItemMetadata;
  }
}
