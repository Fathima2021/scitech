import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface tblEvidenceAttributes {
  EvidenceId?: number;
  Heading?: string;
  EvidenceOrder?: number;
  EvidenceReference?: string;
  EvidenceLibraryId?: number;
  Evidence?: string;
  PinCite?: boolean;
  PartyId?: number;
  IsRedacted?: boolean;
}

export type tblEvidencePk = 'EvidenceId';
export type tblSideId = tblEvidence[tblEvidencePk];

export class tblEvidence extends Model<tblEvidenceAttributes> implements tblEvidenceAttributes {
  EvidenceId?: number;
  Heading?: string;
  EvidenceOrder?: number;
  EvidenceReference?: string;
  EvidenceLibraryId?: number;
  Evidence?: string;
  PinCite?: boolean;
  PartyId?: number;
  IsRedacted?: boolean;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblEvidence {
    tblEvidence.init(
      {
        EvidenceId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        Heading: {
          type: DataTypes.STRING,
          allowNull: true
        },
        EvidenceOrder: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        EvidenceReference: {
          type: DataTypes.STRING,
          allowNull: false
        },
        EvidenceLibraryId: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        Evidence: {
          type: DataTypes.STRING,
          allowNull: false
        },
        PinCite: {
          type: DataTypes.BOOLEAN,
          allowNull: false
        },
        PartyId: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        IsRedacted: {
          type: DataTypes.BOOLEAN,
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'tblEvidence',
        schema: 'dbo',
        timestamps: false
      }
    );
    return tblEvidence;
  }
}
