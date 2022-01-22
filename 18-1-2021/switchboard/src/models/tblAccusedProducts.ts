import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface tblAccusedProductAttributes {
  AccusedProductId?: number;
  CaseId?: number;
  ProductName?: string;
  LibraryId?: number;
}

export type tblAccusedProductsPk = 'AccusedProductId';
export type tblSideId = tblAccusedProducts[tblAccusedProductsPk];

export class tblAccusedProducts extends Model<tblAccusedProductAttributes> implements tblAccusedProductAttributes {
  AccusedProductId?: number;
  CaseId?: number;
  ProductName?: string;
  LibraryId?: number;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblAccusedProducts {
    tblAccusedProducts.init(
      {
        AccusedProductId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true
        },
        CaseId: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        ProductName: {
          type: DataTypes.STRING,
          allowNull: false
        },
        LibraryId: {
          type: DataTypes.BIGINT,
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'tblAccusedProducts',
        schema: 'dbo',
        timestamps: false
      }
    );
    return tblAccusedProducts;
  }
}
