import { Joi } from 'koa-joi-router';

const createPermissionsValidator = Joi.object({
  name: Joi.string().required(),
  resource: Joi.string().required(),
  method: Joi.string().required()
});

const updatePermissionsValidator = Joi.object({
  id: Joi.string().required(),
  name: Joi.string(),
  resource: Joi.string(),
  method: Joi.string()
});

export { createPermissionsValidator, updatePermissionsValidator };
