import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import { tblAccusedProducts } from './tblAccusedProducts';
import { tblPatents } from './tblPatents';
import { tblSides } from './tblSides';
import { tblTerms } from './tblTerms';

export interface tblAccusedProductsListAttributes {
  AccusedProductId?: number;
  ProductName?: string;
  ParentId?: number;
  CaseId?: number;
  PatentId?: number;
  PartyId?: number;
}

export type tblAccusedProductsListPk = 'AccusedProductId';
export type tblAccusedProductsListId = tblAccusedProductsList[tblAccusedProductsListPk];

export class tblAccusedProductsList
  extends Model<tblAccusedProductsListAttributes>
  implements tblAccusedProductsListAttributes
{
  AccusedProductId?: number;
  ProductName?: string;
  ParentId?: number;
  CaseId?: number;
  PatentId?: number;
  PartyId?: number;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblAccusedProductsList {
    tblAccusedProductsList.init(
      {
        AccusedProductId: {
          type: DataTypes.NUMBER,
          allowNull: false,
          primaryKey: true
        },
        ProductName: {
          type: DataTypes.STRING,
          allowNull: false
        },
        ParentId: {
          type: DataTypes.NUMBER,
          allowNull: false
        },
        CaseId: {
          type: DataTypes.NUMBER,
          allowNull: false
        },
        PatentId: {
          type: DataTypes.NUMBER,
          allowNull: false
        },
        PartyId: {
          type: DataTypes.NUMBER,
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'tblAccusedProductsList',
        schema: 'dbo',
        timestamps: false
      }
    );

    return tblAccusedProductsList;
  }
}
