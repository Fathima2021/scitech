import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import { tblAccusedProducts } from './tblAccusedProducts';
import { tblPatents } from './tblPatents';

export interface tblPatentAccusedProductsAttributes {
  AccusedProductId?: number;
  PatentId?: number;
}

export type tblPatentAccusedProductsPk = 'AccusedProductId';
export type tblSideId = tblPatentAccusedProducts[tblPatentAccusedProductsPk];

export class tblPatentAccusedProducts
  extends Model<tblPatentAccusedProductsAttributes>
  implements tblPatentAccusedProductsAttributes
{
  AccusedProductId?: number;
  PatentId?: number;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblPatentAccusedProducts {
    tblPatentAccusedProducts.init(
      {
        AccusedProductId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true
        },
        PatentId: {
          type: DataTypes.BIGINT,
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'tblPatentAccusedProducts',
        schema: 'dbo',
        timestamps: false
      }
    );
    return tblPatentAccusedProducts;
  }
}
