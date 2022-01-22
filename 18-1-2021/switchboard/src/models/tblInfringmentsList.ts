import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import { tblAccusedProducts } from './tblAccusedProducts';

export interface tblInfringementsListAttributes {
  InfringementId?: number;
  ElementId?: number;
  AccusedProductId?: number;
  EvidenceId?: number;
  EvidenceOrder?: number;
  EvidenceHead?: number;
}

export type tblInfringementsListPk = 'InfringementId';
export type tblInfringementsListId = tblInfringementsList[tblInfringementsListPk];

export class tblInfringementsList
  extends Model<tblInfringementsListAttributes>
  implements tblInfringementsListAttributes
{
  InfringementId?: number;
  ElementId?: number;
  AccusedProductId?: number;
  EvidenceId?: number;
  EvidenceOrder?: number;
  EvidenceHead?: number;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblInfringementsList {
    tblInfringementsList.init(
      {
        InfringementId: {
          type: DataTypes.NUMBER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        ElementId: {
          type: DataTypes.NUMBER,
          allowNull: false
        },
        AccusedProductId: {
          type: DataTypes.NUMBER,
          allowNull: false
        },
        EvidenceId: {
          type: DataTypes.NUMBER,
          allowNull: false
        },
        EvidenceOrder: {
          type: DataTypes.NUMBER,
          allowNull: false
        },
        EvidenceHead: {
          type: DataTypes.NUMBER,
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'tblInfringementsList',
        schema: 'dbo',
        timestamps: false
      }
    );

    return tblInfringementsList;
  }
}
