import { Context } from 'koa';

const ensureRoleAccess = async (ctx: Context, next: any) => {
  // if (!ctx.user || !ctx.user.roles || !ctx.user.roles.length) {
  //   ctx.throw('user data is required');
  // }
  // const roleData = await ctx.db.tblRole.findAll({ where: { name: ctx.user.roles } });
  // if (!roleData || !roleData.length) {
  //   ctx.throw('user role not found');
  // }
  // const { _matchedRoute: method, method: resource } = ctx;
  // const permissionData = await ctx.db.tblPermission.findOne({ where: { method, resource } });
  // if (!permissionData) {
  //   ctx.throw(`permission mapping is required of route: ${method}`);
  // }
  // const rolePermissionData = await ctx.db.tblRolePermission.findOne({
  //   where: {
  //     role: roleData.map((x: any) => x.id),
  //     permission: permissionData.id
  //   }
  // });
  // if (!rolePermissionData) {
  //   ctx.throw("you're not authorized to use this resource");
  // }
  await next();
};

export { ensureRoleAccess };
