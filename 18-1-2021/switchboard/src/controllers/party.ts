import Koa from 'koa';
import { tblCase } from '../models/tblCase';
import { tblClaims } from '../models/tblClaims';
import { tblClaimTerms } from '../models/tblClaimTerms';
import { tblElements } from '../models/tblElements';
import { tblEvidence } from '../models/tblEvidence';
import { tblInfringements } from '../models/tblInfringements';
import { tblParties } from '../models/tblParties';
import { tblPatentAccusedProducts } from '../models/tblPatentAccusedProducts';
import { tblPatents } from '../models/tblPatents';
import { tblSides } from '../models/tblSides';
import { tblTerms } from '../models/tblTerms';

export const fetchParties = async (ctx: Koa.Context) => {
  const { caseId } = ctx.query;

  const data = await tblSides.findAll({
    where: { CaseId: caseId },
    include: [
      {
        model: tblParties,
        as: 'Party'
      }
    ]
  });
  ctx.body = { status: 1, data };
};
