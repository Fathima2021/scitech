import type { Sequelize } from 'sequelize';
import { tblItemMetadata } from './tblItemMetadata';
import type { tblItemMetadataAttributes, tblItemMetadataCreationAttributes } from './tblItemMetadata';
import { tblLibraryItemTree } from './tblLibraryItemTree';
import type { tblLibraryItemTreeAttributes, tblLibraryItemTreeCreationAttributes } from './tblLibraryItemTree';
import { tblLibraryItems } from './tblLibraryItems';
import type { tblLibraryItemsAttributes, tblLibraryItemsCreationAttributes } from './tblLibraryItems';
import { tblLibraryItemsHistory } from './tblLibraryItemsHistory';
import type {
  tblLibraryItemsHistoryAttributes,
  tblLibraryItemsHistoryCreationAttributes
} from './tblLibraryItemsHistory';
import { tblPermission } from './tblPermission';
import type { tblPermissionAttributes, tblPermissionCreationAttributes } from './tblPermission';
import { tblPermissionMaster } from './tblPermissionMaster';
import type { tblPermissionMasterAttributes, tblPermissionMasterCreationAttributes } from './tblPermissionMaster';
import { tblProjectCase } from './tblProjectCase';
import type { tblProjectCaseAttributes, tblProjectCaseCreationAttributes } from './tblProjectCase';
import { tblProjects } from './tblProjects';
import type { tblProjectsAttributes, tblProjectsCreationAttributes } from './tblProjects';
import { tblRole } from './tblRole';
import type { tblRoleAttributes, tblRoleCreationAttributes } from './tblRole';
import { tblRoleMaster } from './tblRoleMaster';
import type { tblRoleMasterAttributes, tblRoleMasterCreationAttributes } from './tblRoleMaster';
import { tblRolePermission } from './tblRolePermission';
import type { tblRolePermissionAttributes, tblRolePermissionCreationAttributes } from './tblRolePermission';
import { tblTagMaster } from './tblTagMaster';
import type { tblTagMasterAttributes, tblTagMasterCreationAttributes } from './tblTagMaster';
import { tblTenantMaster } from './tblTenantMaster';
import type { tblTenantMasterAttributes, tblTenantMasterCreationAttributes } from './tblTenantMaster';
import { tblUserProfile } from './tblUserProfile';
import type { tblUserProfileAttributes, tblUserProfileCreationAttributes } from './tblUserProfile';
import { tblAccusedProducts } from './tblAccusedProducts';
import { tblCase } from './tblCase';
import { tblClaims } from './tblClaims';
import { tblClaimTerms } from './tblClaimTerms';
import { tblElementLink } from './tblElementLink';
import { tblElements } from './tblElements';
import { tblEvidence } from './tblEvidence';
import { tblInfringements } from './tblInfringements';
import { tblParties } from './tblParties';
import { tblPatentAccusedProducts } from './tblPatentAccusedProducts';
import { tblPatents } from './tblPatents';
import { tblSides } from './tblSides';
import { tblTerms } from './tblTerms';
import { tblAccusedProductsList, tblAccusedProductsListAttributes } from './tblAccusedProductsList';
import { tblProductSubHeads, tblProductSubHeadsAttributes } from './tblProductSubHeads';
import { tblInfringementsList, tblInfringementsListAttributes } from './tblInfringmentsList';
import { tblFigures } from './tblFigure';

export default {
  tblItemMetadata,
  tblLibraryItemTree,
  tblLibraryItems,
  tblLibraryItemsHistory,
  tblPermission,
  tblPermissionMaster,
  tblProjectCase,
  tblProjects,
  tblRole,
  tblRoleMaster,
  tblRolePermission,
  tblTagMaster,
  tblTenantMaster,
  tblUserProfile,
  tblAccusedProducts,
  tblCase,
  tblClaims,
  tblClaimTerms,
  tblElements,
  tblElementLink,
  tblEvidence,
  tblInfringements,
  tblParties,
  tblPatentAccusedProducts,
  tblPatents,
  tblSides,
  tblTerms,
  tblAccusedProductsList,
  tblProductSubHeads,
  tblInfringementsList
};

export type {
  tblItemMetadataAttributes,
  tblItemMetadataCreationAttributes,
  tblLibraryItemTreeAttributes,
  tblLibraryItemTreeCreationAttributes,
  tblLibraryItemsAttributes,
  tblLibraryItemsCreationAttributes,
  tblLibraryItemsHistoryAttributes,
  tblLibraryItemsHistoryCreationAttributes,
  tblPermissionAttributes,
  tblPermissionCreationAttributes,
  tblPermissionMasterAttributes,
  tblPermissionMasterCreationAttributes,
  tblProjectCaseAttributes,
  tblProjectCaseCreationAttributes,
  tblProjectsAttributes,
  tblProjectsCreationAttributes,
  tblRoleAttributes,
  tblRoleCreationAttributes,
  tblRoleMasterAttributes,
  tblRoleMasterCreationAttributes,
  tblRolePermissionAttributes,
  tblRolePermissionCreationAttributes,
  tblTagMasterAttributes,
  tblTagMasterCreationAttributes,
  tblTenantMasterAttributes,
  tblTenantMasterCreationAttributes,
  tblUserProfileAttributes,
  tblUserProfileCreationAttributes,
  tblAccusedProductsListAttributes,
  tblProductSubHeadsAttributes,
  tblInfringementsListAttributes
};

export function initModels(sequelize: Sequelize) {
  tblItemMetadata.initModel(sequelize);
  tblLibraryItemTree.initModel(sequelize);
  tblLibraryItems.initModel(sequelize);
  tblLibraryItemsHistory.initModel(sequelize);
  tblPermission.initModel(sequelize);
  tblPermissionMaster.initModel(sequelize);
  tblProjectCase.initModel(sequelize);
  tblProjects.initModel(sequelize);
  tblRole.initModel(sequelize);
  tblRoleMaster.initModel(sequelize);
  tblRolePermission.initModel(sequelize);
  tblTagMaster.initModel(sequelize);
  tblTenantMaster.initModel(sequelize);
  tblUserProfile.initModel(sequelize);

  tblAccusedProducts.initModel(sequelize);
  tblCase.initModel(sequelize);
  tblClaims.initModel(sequelize);
  tblClaimTerms.initModel(sequelize);
  tblElementLink.initModel(sequelize);
  tblElements.initModel(sequelize);
  tblEvidence.initModel(sequelize);
  tblInfringements.initModel(sequelize);
  tblParties.initModel(sequelize);
  tblPatentAccusedProducts.initModel(sequelize);
  tblPatents.initModel(sequelize);
  tblSides.initModel(sequelize);
  tblTerms.initModel(sequelize);
  tblAccusedProductsList.initModel(sequelize);
  tblProductSubHeads.initModel(sequelize);
  tblInfringementsList.initModel(sequelize);
  tblFigures.initModel(sequelize);

  tblLibraryItemTree.belongsTo(tblLibraryItems, { foreignKey: 'library_item_id' });
  tblLibraryItems.hasMany(tblLibraryItemTree, { foreignKey: 'library_item_id' });

  tblSides.hasOne(tblParties, { as: 'Party', foreignKey: 'SideId' });

  tblParties.hasMany(tblEvidence, { as: 'Evidences', foreignKey: 'PartyId' });
  tblEvidence.belongsTo(tblParties, { as: 'Party', foreignKey: 'PartyId' });

  tblPatents.hasMany(tblClaims, { as: 'Claims', foreignKey: 'PatentId' });
  tblClaims.belongsTo(tblPatents, { as: 'Patent', foreignKey: 'PatentId' });

  tblPatents.hasMany(tblFigures, { as: 'Figures', foreignKey: 'PatentId' });
  tblFigures.belongsTo(tblPatents, { as: 'Patent', foreignKey: 'PatentId' });

  tblPatents.belongsToMany(tblAccusedProducts, {
    as: 'AccusedProducts',
    through: { model: tblPatentAccusedProducts, unique: false },
    foreignKey: 'AccusedProductId'
  });
  tblAccusedProducts.belongsToMany(tblPatents, {
    as: 'Patents',
    through: { model: tblPatentAccusedProducts, unique: false },
    foreignKey: 'PatentId'
  });
  tblAccusedProducts.hasMany(tblPatentAccusedProducts, { as: 'AccusedProducts', foreignKey: 'AccusedProductId' });
  tblPatents.hasMany(tblPatentAccusedProducts, { as: 'PatentAccusedProducts', foreignKey: 'PatentId' });
  tblPatentAccusedProducts.belongsTo(tblAccusedProducts, { as: 'Product', foreignKey: 'AccusedProductId' });
  tblPatentAccusedProducts.belongsTo(tblPatents, { as: 'Patent', foreignKey: 'PatentId' });

  tblTerms.belongsToMany(tblClaims, {
    as: 'Claims',
    through: { model: tblClaimTerms, unique: false },
    foreignKey: 'ClaimId'
  });
  tblClaims.belongsToMany(tblTerms, {
    as: 'Terms',
    through: { model: tblClaimTerms, unique: false },
    foreignKey: 'TermId'
  });
  tblClaimTerms.belongsTo(tblClaims, { as: 'Claim', foreignKey: 'ClaimId' });
  tblClaimTerms.belongsTo(tblTerms, { as: 'Term', foreignKey: 'TermId' });
  tblTerms.hasMany(tblClaimTerms, { as: 'ClaimTerms', foreignKey: 'TermId' });
  tblClaims.hasMany(tblClaimTerms, { as: 'ClaimTerms', foreignKey: 'ClaimId' });

  tblCase.hasMany(tblSides, { as: 'Sides', foreignKey: 'CaseId' });
  tblSides.belongsTo(tblSides, { as: 'Case', foreignKey: 'CaseId' });
  tblCase.hasMany(tblAccusedProducts, { as: 'AccusedProducts', foreignKey: 'CaseId' });
  tblAccusedProducts.belongsTo(tblCase, { as: 'Case', foreignKey: 'CaseId' });
  tblCase.hasMany(tblPatents, { as: 'Patents', foreignKey: 'CaseId' });
  tblPatents.belongsTo(tblCase, { as: 'Case', foreignKey: 'CaseId' });
  tblCase.hasMany(tblTerms, { as: 'Terms', foreignKey: 'CaseId' });
  tblTerms.belongsTo(tblCase, { as: 'Case', foreignKey: 'CaseId' });

  tblClaims.hasMany(tblElements, { as: 'Elements', foreignKey: 'ClaimId' });
  tblElements.belongsTo(tblClaims, { as: 'Claim', foreignKey: 'ClaimId' });
  tblInfringements.belongsTo(tblAccusedProducts, { as: 'AccusedProduct', foreignKey: 'AccusedProductId' });
  tblAccusedProducts.hasMany(tblInfringements, { as: 'Infringements', foreignKey: 'AccusedProductId' });

  tblElements.hasMany(tblInfringements, { as: 'Infringements', foreignKey: 'ElementId' });

  tblInfringements.belongsTo(tblElements, { as: 'Element', foreignKey: 'ElementId' });
  tblInfringements.belongsTo(tblEvidence, { as: 'Evidence', foreignKey: 'EvidenceId' });

  tblEvidence.hasMany(tblInfringements, { as: 'Infringements', foreignKey: 'EvidenceId' });

  tblAccusedProductsList.hasMany(tblAccusedProductsList, { as: 'ChildProducts', foreignKey: 'ParentId' });

  tblProductSubHeads.hasOne(tblAccusedProductsList, { as: 'AccusedProduct', foreignKey: 'AccusedProductId' });

  tblInfringementsList.belongsTo(tblEvidence, { as: 'Evidence', foreignKey: 'EvidenceId' });

  return {
    tblItemMetadata,
    tblLibraryItemTree,
    tblLibraryItems,
    tblLibraryItemsHistory,
    tblPermission,
    tblPermissionMaster,
    tblProjectCase,
    tblProjects,
    tblRole,
    tblRoleMaster,
    tblRolePermission,
    tblTagMaster,
    tblTenantMaster,
    tblUserProfile,
    tblAccusedProducts,
    tblCase,
    tblClaimTerms,
    tblClaims,
    tblElementLink,
    tblElements,
    tblEvidence,
    tblInfringements,
    tblParties,
    tblPatentAccusedProducts,
    tblPatents,
    tblTerms,
    tblSides,
    tblAccusedProductsList,
    tblInfringementsList
  };
}
