import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface tblClaimTermsAttributes {
  ClaimTermId?: number;
  ClaimId?: number;
  TermId?: number;
}

export type tblClaimTermsPk = 'ClaimTermId';
export type tblClaimTermsId = tblClaimTerms[tblClaimTermsPk];

export class tblClaimTerms extends Model<tblClaimTermsAttributes> implements tblClaimTermsAttributes {
  ClaimTermId?: number;
  ClaimId?: number;
  TermId?: number;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblClaimTerms {
    tblClaimTerms.init(
      {
        ClaimTermId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        TermId: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        ClaimId: {
          type: DataTypes.BIGINT,
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'tblClaimTerms',
        schema: 'dbo',
        timestamps: false
      }
    );
    return tblClaimTerms;
  }
}
