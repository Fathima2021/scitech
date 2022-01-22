import { Context } from 'koa';

const createRole = async (ctx: Context) => {
  const data = ctx.request.body;
  const res = await ctx.db.tblRolesMaster.create(data);
  ctx.body = {
    status: 1,
    data: res.id
  };
};

const updateRole = async (ctx: Context) => {
  const data = ctx.request.body;
  const res = await ctx.db.tblRolesMaster.update(data, { where: { id: data.id } });
  ctx.body = {
    status: 1
  };
};

const listRoles = async (ctx: Context) => {
  const data = await ctx.db.tblRolesMaster.findAll();
  ctx.body = {
    status: 1,
    response: data
  };
};

export { createRole, updateRole, listRoles };
