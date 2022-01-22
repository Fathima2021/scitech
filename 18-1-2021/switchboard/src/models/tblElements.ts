import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import { tblElementLink } from './tblElementLink';

export interface tblElementsAttributes {
  ElementId?: number;
  ClaimId?: number;
  ElementText?: string;
  PlaintiffFigureId?: number;
  DefendantFigureId?: number;
  InvaliditySummary?: string;
  InfringementSummary?: string;
  ElementOrder?: number;
  InvaliditySummaryRecorded?: Date;
  InfringementSummaryRecorded?: Date;
  ElementHeading?: string;
}

export type tblElementsPk = 'ElementId';
export type tblSideId = tblElements[tblElementsPk];

export class tblElements extends Model<tblElementsAttributes> implements tblElementsAttributes {
  ElementId?: number;
  ClaimId?: number;
  ElementText?: string;
  PlaintiffFigureId?: number;
  DefendantFigureId?: number;
  InvaliditySummary?: string;
  InfringementSummary?: string;
  ElementOrder?: number;
  InvaliditySummaryRecorded?: Date;
  InfringementSummaryRecorded?: Date;
  ElementHeading?: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblElements {
    tblElements.init(
      {
        ElementId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true
        },
        ClaimId: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        ElementText: {
          type: DataTypes.STRING,
          allowNull: false
        },
        PlaintiffFigureId: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        DefendantFigureId: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        InvaliditySummary: {
          type: DataTypes.STRING,
          allowNull: false
        },
        InfringementSummary: {
          type: DataTypes.STRING,
          allowNull: false
        },
        ElementOrder: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        InvaliditySummaryRecorded: {
          type: DataTypes.DATE,
          allowNull: false
        },
        InfringementSummaryRecorded: {
          type: DataTypes.DATE,
          allowNull: false
        },
        ElementHeading: {
          type: DataTypes.STRING,
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'tblElements',
        schema: 'dbo',
        timestamps: false
      }
    );
    return tblElements;
  }
}
