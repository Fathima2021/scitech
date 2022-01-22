import koaBody from 'koa-body';
import Router from 'koa-joi-router';
import {
  getAllRootFolders,
  getChildFoldersById,
  getProjectTreeById,
  fullTextSearch,
  copyPasteItems,
  cutPasteItems,
  exportProject,
  renameFileById,
  createNewFolder,
  deleteFilesById,
  getProjectsList,
  getCasesListByProject
} from '../controllers';
import { handleError } from '../middleware';
import { authorizeAzureAdToken } from '../middleware/auth';
import { ensureRoleAccess } from '../middleware/ensureRoleAccess';
import ensureDestinationExist from '../middleware/filesystem/ensureDestinationExist';
import ensureSourceExist from '../middleware/filesystem/ensureSourceExist';
import ensureRemoveMiddleware from '../middleware/removeFile';
import ensureRenameMiddleware from '../middleware/renameFile';

const router = Router();

/** Projects routes */

router.route([
  {
    method: 'GET',
    path: '/v1/projects/list',
    handler: [handleError, authorizeAzureAdToken, ensureRoleAccess, getProjectsList]
  },
  {
    method: 'GET',
    path: '/v1/projects/cases/list',
    handler: [handleError, authorizeAzureAdToken, ensureRoleAccess, getCasesListByProject]
  },
  {
    method: 'GET',
    path: '/v1/projects/root/list',
    handler: [handleError, authorizeAzureAdToken, ensureRoleAccess, getAllRootFolders]
  },
  {
    method: 'GET',
    path: '/v1/projects',
    handler: [handleError, authorizeAzureAdToken, ensureRoleAccess, getChildFoldersById]
  },
  {
    method: 'GET',
    path: '/v1/projects/tree',
    handler: [handleError, authorizeAzureAdToken, ensureRoleAccess, getProjectTreeById]
  },
  {
    method: 'GET',
    path: '/v1/projects/export/all',
    handler: [handleError, authorizeAzureAdToken, ensureRoleAccess, exportProject]
  },
  {
    method: 'GET',
    path: '/v1/search',
    handler: [handleError, authorizeAzureAdToken, ensureRoleAccess, fullTextSearch]
  },
  {
    method: 'POST',
    path: '/v1/projects/copyPaste',
    handler: [
      handleError,
      authorizeAzureAdToken,
      ensureRoleAccess,
      koaBody(),
      ensureSourceExist,
      ensureDestinationExist,
      copyPasteItems
    ]
  },
  {
    method: 'POST',
    path: '/v1/projects/cutPaste',
    handler: [
      handleError,
      authorizeAzureAdToken,
      ensureRoleAccess,
      koaBody(),
      ensureSourceExist,
      ensureDestinationExist,
      cutPasteItems
    ]
  },
  {
    method: 'POST',
    path: '/v1/projects/delete',
    handler: [handleError, authorizeAzureAdToken, ensureRoleAccess, koaBody(), ensureRemoveMiddleware, deleteFilesById]
  },
  {
    method: 'POST',
    path: '/v1/projects/rename',
    handler: [handleError, authorizeAzureAdToken, ensureRoleAccess, koaBody(), ensureRenameMiddleware, renameFileById]
  },
  {
    method: 'POST',
    path: '/v1/projects/createNew',
    handler: [handleError, authorizeAzureAdToken, ensureRoleAccess, koaBody(), createNewFolder]
  }
]);

export default router;
