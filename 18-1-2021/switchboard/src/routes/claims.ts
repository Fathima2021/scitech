import Router from 'koa-joi-router';
import koaBody from 'koa-body';
import {
  createEvidence,
  deleteInfringements,
  editEvidence,
  fetchClaimElements,
  fetchEvidenceInstances,
  fetchEvidences,
  fetchPatentClaims,
  fetchPatents
} from '../controllers';
import { authorizeAzureAdToken, ensureRoleAccess, handleError } from '../middleware';
import { createEvidenceValidator } from '../validators';
import multer from 'koa-multer';
import path from 'path';
const router = Router();

// Upload File Storage Path and File Naming
const storage = multer.diskStorage({
  destination(req: any, file: any, cb: any) {
    cb(null, path.join(__dirname, '/public'));
  },
  filename(req: any, file: any, cb: any) {
    const type = file.originalname.split('.')[1];
    cb(null, `${file.fieldname}-${Date.now().toString(16)}.${type}`);
  }
});

const upload = multer({ storage });

router.route([
  {
    method: 'GET',
    path: '/v1/patents',
    handler: [handleError, koaBody(), fetchPatents]
    // [handleError, authorizeAzureAdToken, ensureRoleAccess, koaBody(), fetchProjectDetails]
  },
  {
    method: 'GET',
    path: '/v1/claims',
    handler: [handleError, koaBody(), fetchPatentClaims]
  },
  {
    method: 'GET',
    path: '/v1/evidences',
    handler: [handleError, koaBody(), fetchEvidences]
  },
  {
    method: 'POST',
    path: '/v1/evidences',
    handler: [handleError, koaBody({ multipart: true }), upload.array('figures'), createEvidence]
  },
  {
    method: 'PUT',
    path: '/v1/evidences',
    handler: [handleError, koaBody({ multipart: true }), upload.array('figures'), editEvidence]
  },
  {
    method: 'DELETE',
    path: '/v1/infringements/:infringmentId',
    handler: [handleError, koaBody(), deleteInfringements]
  },
  {
    method: 'GET',
    path: '/v1/claims/elements',
    handler: [handleError, koaBody(), fetchClaimElements]
  },
  {
    method: 'GET',
    path: '/v1/evidences/:evidenceId/instances',
    handler: [handleError, koaBody(), fetchEvidenceInstances]
  }
]);

export default router;
