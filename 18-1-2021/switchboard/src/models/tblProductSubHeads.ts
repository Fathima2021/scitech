import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import { tblAccusedProducts } from './tblAccusedProducts';
import { tblPatents } from './tblPatents';
import { tblSides } from './tblSides';
import { tblTerms } from './tblTerms';

export interface tblProductSubHeadsAttributes {
  ProductSubHeadId?: number;
  SectionName?: string;
  AccusedProductId?: number;
}

export type tblAccusedProductsListPk = 'ProductSubHeadId';
export type tblAccusedProductsListId = tblProductSubHeads[tblAccusedProductsListPk];

export class tblProductSubHeads extends Model<tblProductSubHeadsAttributes> implements tblProductSubHeadsAttributes {
  ProductSubHeadId?: number;
  SectionName?: string;
  AccusedProductId?: number;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblProductSubHeads {
    tblProductSubHeads.init(
      {
        ProductSubHeadId: {
          type: DataTypes.NUMBER,
          allowNull: false,
          primaryKey: true,
          autoIncrementIdentity: true,
          autoIncrement: true
        },
        SectionName: {
          type: DataTypes.STRING,
          allowNull: false
        },
        AccusedProductId: {
          type: DataTypes.NUMBER,
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'tblProductSubHeads',
        schema: 'dbo',
        timestamps: false
      }
    );

    return tblProductSubHeads;
  }
}
