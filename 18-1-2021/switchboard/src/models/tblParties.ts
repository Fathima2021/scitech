import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import { tblEvidence } from './tblEvidence';

export interface tblPartiesAttributes {
  Id?: number;
  SideId?: number;
  ShortName?: string;
  Name?: string;
  IsHighlighted?: boolean;
  IsPrimary?: boolean;
}

export type tblPartiesPk = 'Id';
export type tblSideId = tblParties[tblPartiesPk];

export class tblParties extends Model<tblPartiesAttributes> implements tblPartiesAttributes {
  Id?: number;
  SideId?: number;
  ShortName?: string;
  Name?: string;
  IsHighlighted?: boolean;
  IsPrimary?: boolean;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblParties {
    tblParties.init(
      {
        Id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true
        },
        SideId: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        ShortName: {
          type: DataTypes.STRING,
          allowNull: false
        },
        Name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        IsHighlighted: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        IsPrimary: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        }
      },
      {
        sequelize,
        tableName: 'tblParties',
        schema: 'dbo',
        timestamps: false
      }
    );
    return tblParties;
  }
}
