import Koa from 'koa';
import { tblCase } from '../models/tblCase';
import { tblFigures } from '../models/tblFigure';

export const fetchCase = async (ctx: Koa.Context) => {
  const { caseId } = ctx.query;
  const data = await tblCase.findOne({
    where: { CaseId: caseId }
  });
  ctx.body = { status: 1, data };
};

export const fetchFigures = async (ctx: Koa.Context) => {
  const { patentId } = ctx.query;
  try {
    const data = await tblFigures.findAll({
      where: { PatentId: patentId }
    });
    ctx.body = { status: 1, data };
  } catch (error) {
    ctx.body = { status: 0, error };
  }
};
