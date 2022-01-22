import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import { tblCase } from './tblCase';

export interface tblSidesAttributes {
  id?: number;
  CaseId?: number;
  Side?: string;
  isClientSide?: boolean;
  isCounterSide?: boolean;
}

export type tblSidesPk = 'id';
export type tblSideId = tblSides[tblSidesPk];

export class tblSides extends Model<tblSidesAttributes> implements tblSidesAttributes {
  id?: number;
  CaseId?: number;
  Side?: string;
  isClientSide?: boolean;
  isCounterSide?: boolean;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblSides {
    tblSides.init(
      {
        id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true
        },
        CaseId: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        Side: {
          type: DataTypes.STRING,
          allowNull: false
        },
        isClientSide: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        isCounterSide: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        }
      },
      {
        sequelize,
        tableName: 'tblSides',
        schema: 'dbo',
        timestamps: false
      }
    );
    return tblSides;
  }
}
