import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import { tblClaimTerms } from './tblClaimTerms';

export interface tblClaimsAttributes {
  PatentId?: number;
  Asserted?: boolean;
  ClaimId?: number;
  ClaimOrder?: number;
  ClaimText?: string;
  DependsOnId?: number;
}

export type tblClaimsPk = 'PatentId';
export type tblClaimsId = tblClaims[tblClaimsPk];

export class tblClaims extends Model<tblClaimsAttributes> implements tblClaimsAttributes {
  PatentId?: number;
  Asserted?: boolean;
  ClaimId?: number;
  ClaimOrder?: number;
  ClaimText?: string;
  DependsOnId?: number;
  commentsServer?:string

  static initModel(sequelize: Sequelize.Sequelize): typeof tblClaims {
    tblClaims.init(
      {
        ClaimId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        Asserted: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        PatentId: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        ClaimOrder: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        DependsOnId: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        ClaimText: {
          type: DataTypes.STRING,
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'tblClaims',
        schema: 'dbo',
        timestamps: false
      }
    );
    return tblClaims;
  }
}
