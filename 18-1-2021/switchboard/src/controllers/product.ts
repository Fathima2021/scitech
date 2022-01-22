import Koa from 'koa';
import { tblAccusedProductsList } from '../models/tblAccusedProductsList';
import { tblCase } from '../models/tblCase';
import { tblClaims } from '../models/tblClaims';
import { tblClaimTerms } from '../models/tblClaimTerms';
import { tblElements } from '../models/tblElements';
import { tblEvidence } from '../models/tblEvidence';
import { tblInfringements } from '../models/tblInfringements';
import { tblParties } from '../models/tblParties';
import { tblPatentAccusedProducts } from '../models/tblPatentAccusedProducts';
import { tblPatents } from '../models/tblPatents';
import { tblProductSubHeads } from '../models/tblProductSubHeads';
import { tblSides } from '../models/tblSides';
import { tblTerms } from '../models/tblTerms';

export const fetchProducts = async (ctx: Koa.Context) => {
  const { patentId, partyId } = ctx.query;

  const data = await tblAccusedProductsList.findAll({
    where: { ParentId: 0, PatentId: patentId, PartyId: partyId },
    include: [
      {
        model: tblAccusedProductsList,
        as: 'ChildProducts'
      }
    ]
  });
  ctx.body = { status: 1, data };
};

export const fetchProductSubHeadings = async (ctx: Koa.Context) => {
  const { productId } = ctx.query;

  const data = await tblProductSubHeads.findAll({
    where: { AccusedProductId: productId }
  });
  ctx.body = { status: 1, data };
};

export const createProductSubHeadings = async (ctx: Koa.Context) => {
  const { productId, sectionName } = ctx.request.body;
  console.log(productId, sectionName);
  const data = await tblProductSubHeads.create({
    AccusedProductId: productId,
    SectionName: sectionName
  });
  ctx.body = { status: 1, data };
};
