import { Joi } from 'koa-joi-router';

const createEvidenceValidator = Joi.object({
  elementId: Joi.number().required(),
  productId: Joi.number().required(),
  subHeadId: Joi.number().required(),
  type: Joi.string().required(),
  libraryId: Joi.number().required(),
  refrence: Joi.string().required(),
  content: Joi.string().required(),
  figures: Joi.object().optional(),
  isRedacted: Joi.boolean().required(),
  pinSite: Joi.boolean().required(),
  order: Joi.number().required()
});

export { createEvidenceValidator };
