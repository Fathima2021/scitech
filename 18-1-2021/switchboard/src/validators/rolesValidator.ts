import { Joi } from 'koa-joi-router';

const createRolesValidator = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required()
});

const updateRolesValidator = Joi.object({
  id: Joi.string().required(),
  name: Joi.string(),
  description: Joi.string()
});

export { createRolesValidator, updateRolesValidator };
