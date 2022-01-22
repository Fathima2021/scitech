import { Context } from 'koa';

const createRolePermission = async (ctx: Context) => {
  const data = ctx.request.body;
  // TODO: ensure it doesn't exist
  const res = await ctx.db.tblRolePermissionsMaster.create(data);
  ctx.body = {
    status: 1,
    data: res.id
  };
};

const updateRolePermission = async (ctx: Context) => {
  const data = ctx.request.body;
  const res = await ctx.db.tblRolePermissionsMaster.update(data, { where: { id: data.id } });
  ctx.body = {
    status: 1
  };
};

const listRolePermissions = async (ctx: Context) => {
  const data = await ctx.db.tblRolePermissionsMaster.findAll({
    include: [ctx.db.tblRolesMaster, ctx.db.tblPermissionsMaster]
  });
  ctx.body = {
    status: 1,
    response: data
  };
};

export { createRolePermission, updateRolePermission, listRolePermissions };
