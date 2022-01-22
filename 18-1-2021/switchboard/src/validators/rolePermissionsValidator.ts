import { Joi } from 'koa-joi-router';

const createRolePermissionsValidator = Joi.object({
  role: Joi.string().required(),
  permission: Joi.string().required()
});

const updateRolePermissionsValidator = Joi.object({
  id: Joi.string().required(),
  role: Joi.string().required(),
  permission: Joi.string().required()
});

export { createRolePermissionsValidator, updateRolePermissionsValidator };
