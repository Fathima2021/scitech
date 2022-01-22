import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import { tblAccusedProducts } from './tblAccusedProducts';
import { tblPatents } from './tblPatents';
import { tblSides } from './tblSides';
import { tblTerms } from './tblTerms';

export interface tblCaseAttributes {
  CaseId?: number;
  CaseName?: string;
  Judge?: string;
  CaseDescription?: string;
  Duration?: number;
  InceptionMonth?: number;
  InceptionYear?: number;
  District?: string;
  CaseFile?: string;
  Passcode?: string;
  Ism?: boolean;
  Isf?: boolean;
}

export type tblCasePk = 'CaseId';
export type tblCaseId = tblCase[tblCasePk];

export class tblCase extends Model<tblCaseAttributes> implements tblCaseAttributes {
  CaseId?: number;
  CaseName?: string;
  Judge?: string;
  CaseDescription?: string;
  Duration?: number;
  InceptionMonth?: number;
  InceptionYear?: number;
  District?: string;
  CaseFile?: string;
  Passcode?: string;
  Ism?: boolean;
  Isf?: boolean;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblCase {
    tblCase.init(
      {
        CaseId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true
        },
        CaseName: {
          type: DataTypes.STRING,
          allowNull: false
        },
        Judge: {
          type: DataTypes.STRING,
          allowNull: false
        },
        CaseDescription: {
          type: DataTypes.STRING,
          allowNull: false
        },
        Duration: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        InceptionMonth: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        InceptionYear: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        District: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        CaseFile: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        Passcode: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        Ism: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        Isf: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        }
      },
      {
        sequelize,
        tableName: 'tblCase',
        schema: 'dbo',
        timestamps: false
      }
    );

    return tblCase;
  }
}
