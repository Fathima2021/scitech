import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import { tblCase } from './tblCase';
import { tblClaimTerms } from './tblClaimTerms';

export interface tblTermsAttributes {
  TermId?: number;
  CaseId?: number;
  TermText?: string;
  Active?: boolean;
}

export type tblTermsPk = 'TermId';
export type tblSideId = tblTerms[tblTermsPk];

export class tblTerms extends Model<tblTermsAttributes> implements tblTermsAttributes {
  TermId?: number;
  CaseId?: number;
  TermText?: string;
  Active?: boolean;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblTerms {
    tblTerms.init(
      {
        TermId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true
        },
        CaseId: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        TermText: {
          type: DataTypes.STRING,
          allowNull: false
        },
        Active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        }
      },
      {
        sequelize,
        tableName: 'tblTerms',
        schema: 'dbo',
        timestamps: false
      }
    );
    return tblTerms;
  }
}
