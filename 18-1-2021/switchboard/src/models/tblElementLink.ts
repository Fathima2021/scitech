import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface tblElementLinkAttributes {
  ElementLinkId?: number;
  ParentElementId?: number;
  ChildElementId?: number;
  GroupNumber?: number;
}

export type tblElementLinkPk = 'ElementLinkId';
export type tblSideId = tblElementLink[tblElementLinkPk];

export class tblElementLink extends Model<tblElementLinkAttributes> implements tblElementLinkAttributes {
  ElementLinkId?: number;
  ParentElementId?: number;
  ChildElementId?: number;
  GroupNumber?: number;

  static initModel(sequelize: Sequelize.Sequelize): typeof tblElementLink {
    tblElementLink.init(
      {
        ElementLinkId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true
        },
        ParentElementId: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        ChildElementId: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        GroupNumber: {
          type: DataTypes.BIGINT,
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'tblElementLink',
        schema: 'dbo',
        timestamps: false
      }
    );
    return tblElementLink;
  }
}
