import Koa from 'koa';
import { Op } from 'sequelize';
import { tblAccusedProducts } from '../models/tblAccusedProducts';
import { tblCase } from '../models/tblCase';
import { tblClaims } from '../models/tblClaims';
import { tblClaimTerms } from '../models/tblClaimTerms';
import { tblElements } from '../models/tblElements';
import { tblEvidence, tblEvidenceAttributes } from '../models/tblEvidence';
import { tblInfringementsList } from '../models/tblInfringmentsList';
import { tblPatents } from '../models/tblPatents';
import { tblTerms } from '../models/tblTerms';
import { uploadImage } from '../utils/uploadImage';

export const fetchPatents = async (ctx: Koa.Context) => {
  const { caseId } = ctx.query;
  const data = await tblPatents.findAll({
    attributes: [
      'PatentId',
      'CaseId',
      'PatentNumber',
      'PatentPDFId',
      'TutorialId',
      'AbstractText',
      'Summary',
      'Inventor',
      'Issued',
      'Filed',
      'Assignee',
      'Comments',
      'Title',
      'SummaryDate',
      'Abstract',
      'IsPriorArt',
      'InPreparation'
    ],
    where: { CaseId: caseId }
  });
  ctx.body = { status: 1, data };
};

export const fetchPatentClaims = async (ctx: Koa.Context) => {
  const { patentId } = ctx.query;
  const data = await tblClaims.findAll({
    where: { PatentId: patentId }
  });
  ctx.body = { status: 1, data };
};

export const fetchEvidences = async (ctx: Koa.Context) => {
  const { accusedProductId, elementId, type, evidenceHeadId } = ctx.query;
  if (!accusedProductId || !elementId || !evidenceHeadId) {
    ctx.body = { status: 0, data: { message: 'Invalid params' } };
    return;
  }
  let data = null;
  const _where: any = {
    AccusedProductId: accusedProductId,
    ElementId: elementId
  };
  if (evidenceHeadId && +evidenceHeadId !== -1) {
    _where.EvidenceHead = evidenceHeadId;
  }
  if (type === 'INFRINGMENTS') {
    data = await tblInfringementsList.findAll({
      where: _where,
      include: [
        {
          model: tblEvidence,
          where: {
            PartyId: 0
          },
          as: 'Evidence'
        }
      ],
      order: [['EvidenceOrder', 'ASC']]
    });
  } else if (type === 'NON-INFRINGMENTS') {
    data = await tblInfringementsList.findAll({
      where: _where,
      include: [
        {
          model: tblEvidence,
          where: {
            PartyId: {
              [Op.ne]: 0
            }
          },
          as: 'Evidence'
        }
      ],
      order: [['EvidenceOrder', 'ASC']]
    });
  }
  ctx.body = { status: 1, data };
};

export const fetchClaimElements = async (ctx: Koa.Context) => {
  const { claimId } = ctx.query;
  const data = await tblClaims.findOne({
    where: { ClaimId: claimId },
    include: [
      {
        model: tblClaimTerms,
        as: 'ClaimTerms',
        include: [
          {
            model: tblTerms,
            as: 'Term'
          }
        ]
      },
      {
        model: tblElements,
        as: 'Elements',
        order: [['ElementOrder', 'ASC']]
      }
    ]
  });
  ctx.body = { status: 1, data };
};

export const createEvidence = async (ctx: Koa.Context) => {
  let { elementId, productId, subHeadId, type, libraryId, refrence, content, isRedacted, pinSite, order, partyId } = ctx
    .request.body as any;
  let { figures } = ctx.request.files as any;

  if (figures && !Array.isArray(figures)) {
    const fig = new Array();
    fig.push(figures);
    figures = fig;
  }

  for (let index = 0; index < (figures || [])?.length; index++) {
    const element = figures[index];

    const replacement = await uploadImage(element);

    content = content.replace(`{{Figure_${index + 1}}}`, replacement);
  }
  content = content.replaceAll('\\', '');

  console.log({
    EvidenceOrder: order,
    EvidenceReference: refrence,
    EvidenceLibraryId: libraryId,
    Evidence: content,
    PinCite: pinSite,
    IsRedacted: isRedacted
  });
  // ctx.body = { status: 1, data: {} };
  // return;
  const eviRecord = await tblEvidence.create({
    EvidenceOrder: order,
    EvidenceReference: refrence,
    EvidenceLibraryId: libraryId,
    Evidence: content,
    PinCite: pinSite,
    IsRedacted: isRedacted,
    PartyId: partyId
  });
  const infringment = await tblInfringementsList.create({
    ElementId: elementId,
    AccusedProductId: productId,
    EvidenceId: eviRecord.EvidenceId,
    EvidenceOrder: eviRecord.EvidenceOrder,
    EvidenceHead: subHeadId
  });
  ctx.body = { status: 1, data: infringment };
};

export const editEvidence = async (ctx: Koa.Context) => {
  let {
    elementId,
    productId,
    subHeadId,
    editMode,
    libraryId,
    refrence,
    content,
    isRedacted,
    pinSite,
    order,
    evidenceId,
    partyId
  } = ctx.request.body as any;
  let { figures } = ctx.request.files as any;

  if (figures && !Array.isArray(figures)) {
    const fig = new Array();
    fig.push(figures);
    figures = fig;
  }

  for (let index = 0; index < (figures || [])?.length; index++) {
    const element = figures[index];

    const replacement = await uploadImage(element);

    content = content.replace(`{{Figure_${index + 1}}}`, replacement);
  }
  content = content.replaceAll('\\', '');
  if (editMode === 'single') {
    const eviRecord = await tblEvidence.create({
      EvidenceOrder: order,
      EvidenceReference: refrence,
      EvidenceLibraryId: libraryId,
      Evidence: content,
      PinCite: pinSite,
      IsRedacted: isRedacted,
      PartyId: partyId
    });
    const infringment = await tblInfringementsList.update(
      { EvidenceId: eviRecord.EvidenceId },
      { where: { AccusedProductId: productId, EvidenceId: evidenceId } }
    );
    ctx.body = { status: 1, data: { message: 'Date successfully created' } };
    return;
  } else {
    const eviRecord = await tblEvidence.update(
      {
        EvidenceOrder: order,
        EvidenceReference: refrence,
        EvidenceLibraryId: libraryId,
        Evidence: content,
        PinCite: pinSite,
        IsRedacted: isRedacted,
        PartyId: partyId
      },
      { where: { EvidenceId: evidenceId } }
    );
    ctx.body = { status: 1, data: { message: 'Date successfully updated' } };
  }
};

export const fetchEvidenceInstances = async (ctx: Koa.Context) => {
  const { evidenceId } = ctx.params;
  const { page = 1 } = ctx.query;
  const result = await tblInfringementsList.findAndCountAll({
    where: { EvidenceId: evidenceId },
    limit: 10,
    offset: (+page - 1) * 10
  });
  ctx.body = { status: 1, data: result };
};

export const deleteInfringements = async (ctx: Koa.Context) => {
  const { infringmentId } = ctx.params;
  const data = await tblInfringementsList.destroy({
    where: { InfringementId: infringmentId }
  });
  ctx.body = { status: 1, data };
};

// const data = await tblClaimTerms.findAll({
//     include: [
//         {
//             model: tblClaims,
//             as: 'Claim'
//         },
//         {
//             model: tblTerms,
//             as: 'Term'
//         }
//     ]
// })
