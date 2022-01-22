import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface tblPatentsAttributes {
  PatentId?: number;
  CaseId?: number;
  PatentNumber?: string;
  PatentPDFId?: number;
  TutorialId?: number;
  AbstractText?: string;
  Summary?: string;
  CoverImage?: string;
  Inventor?: string;
  Issued?: string;
  Filed?: string;
  Assignee?: string;
  Comments?: string;
  Title?: string;
  SummaryDate?: Date;
  Abstract?: string;
  MetadataBlob?: string;
  IsPriorArt?: boolean;
  InPreparation?: boolean;
}

export type tblPatentsPk = 'PatentId';
export type tblPatentsId = tblPatents[tblPatentsPk];

export class tblPatents extends Model<tblPatentsAttributes> implements tblPatentsAttributes {
  PatentId?: number;
  CaseId?: number;
  PatentNumber?: string;
  PatentPDFId?: number;
  TutorialId?: number;
  AbstractText?: string;
  Summary?: string;
  CoverImage?: string;
  Inventor?: string;
  Issued?: string;
  Filed?: string;
  Assignee?: string;
  Comments?: string;
  Title?: string;
  SummaryDate?: Date;
  Abstract?: string;
  MetadataBlob?: string;
  IsPriorArt?: boolean;
  InPreparation?: boolean;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblPatents {
    tblPatents.init(
      {
        PatentId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        CaseId: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        PatentNumber: {
          type: DataTypes.STRING,
          allowNull: false
        },
        PatentPDFId: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        TutorialId: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        AbstractText: {
          type: DataTypes.STRING,
          allowNull: false
        },
        Summary: {
          type: DataTypes.STRING,
          allowNull: false
        },
        CoverImage: {
          type: DataTypes.STRING,
          allowNull: false
        },
        Inventor: {
          type: DataTypes.STRING,
          allowNull: false
        },
        Issued: {
          type: DataTypes.STRING,
          allowNull: false
        },
        Filed: {
          type: DataTypes.STRING,
          allowNull: false
        },
        Assignee: {
          type: DataTypes.STRING,
          allowNull: false
        },
        Comments: {
          type: DataTypes.STRING,
          allowNull: false
        },
        Title: {
          type: DataTypes.STRING,
          allowNull: false
        },
        SummaryDate: {
          type: DataTypes.DATE,
          allowNull: false
        },
        Abstract: {
          type: DataTypes.STRING,
          allowNull: false
        },
        MetadataBlob: {
          type: DataTypes.STRING,
          allowNull: false
        },
        IsPriorArt: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        InPreparation: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        }
      },
      {
        sequelize,
        tableName: 'tblPatents',
        schema: 'dbo',
        timestamps: false
      }
    );
    return tblPatents;
  }
}
