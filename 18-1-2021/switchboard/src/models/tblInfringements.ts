import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import { tblAccusedProducts } from './tblAccusedProducts';
import { tblElements } from './tblElements';
import { tblEvidence } from './tblEvidence';

export interface tblInfringementsAttributes {
  InfringementId?: number;
  ElementId?: number;
  AccusedProductId?: number;
  EvidenceId?: number;
  EvidenceOrder?: number;
}

export type tblInfringementsPk = 'InfringementId';
export type tblSideId = tblInfringements[tblInfringementsPk];

export class tblInfringements extends Model<tblInfringementsAttributes> implements tblInfringementsAttributes {
  InfringementId?: number;
  ElementId?: number;
  AccusedProductId?: number;
  EvidenceId?: number;
  EvidenceOrder?: number;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblInfringements {
    tblInfringements.init(
      {
        InfringementId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        ElementId: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        AccusedProductId: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        EvidenceId: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        EvidenceOrder: {
          type: DataTypes.BIGINT,
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'tblInfringements',
        schema: 'dbo',
        timestamps: false
      }
    );
    return tblInfringements;
  }
}
