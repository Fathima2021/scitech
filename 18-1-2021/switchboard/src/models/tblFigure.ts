import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import { tblCase } from './tblCase';
import { tblClaimTerms } from './tblClaimTerms';

export interface tblFiguresAttributes {
  FigureId?: number;
  PatentId?: number;
  FigureText?: string;
  Figure?: string;
  Selected?: boolean;
  UserModified?: boolean;
  FigureHeading?: string;
  Path?: string;
}

export type tblFiguresPk = 'FigureId';
export type tblSideId = tblFigures[tblFiguresPk];

export class tblFigures extends Model<tblFiguresAttributes> implements tblFiguresAttributes {
  FigureId?: number;
  PatentId?: number;
  FigureText?: string;
  Figure?: string;
  Selected?: boolean;
  UserModified?: boolean;
  FigureHeading?: string;
  Path?: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblFigures {
    tblFigures.init(
      {
        FigureId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true
        },
        PatentId: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        FigureText: {
          type: DataTypes.STRING,
          allowNull: false
        },
        FigureHeading: {
          type: DataTypes.STRING,
          allowNull: false
        },
        Path: {
          type: DataTypes.STRING,
          allowNull: false
        },
        Figure: {
          type: DataTypes.STRING,
          allowNull: false
        },
        Selected: {
          type: DataTypes.BOOLEAN,
          allowNull: false
        },
        UserModified: {
          type: DataTypes.BOOLEAN,
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'tblFigures',
        schema: 'dbo',
        timestamps: false
      }
    );
    return tblFigures;
  }
}
