import { Context } from 'koa';

const createPermission = async (ctx: Context) => {
  const data = ctx.request.body;
  const res = await ctx.db.tblPermissionsMaster.create(data);
  ctx.body = {
    status: 1,
    data: res.id
  };
};

const updatePermission = async (ctx: Context) => {
  const data = ctx.request.body;
  await ctx.db.tblPermissionsMaster.update(data, { where: { id: data.id } });
  ctx.body = {
    status: 1
  };
};

const listPermissions = async (ctx: Context) => {
  const data = await ctx.db.tblPermissionsMaster.findAll();
  ctx.body = {
    status: 1,
    response: data
  };
};

export { createPermission, updatePermission, listPermissions };
