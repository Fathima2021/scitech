export default async (ctx: any, next: any): Promise<void> => {
  try {
    if (ctx.invalid) {
      ctx.status = 400;
      ctx.body = {
        status: 0,
        message: ctx?.invalid?.body?.msg
      };
      return;
    }
    await next();
  } catch (err) {
    if (ctx.status === 200) {
      ctx.status = 400;
    }
    ctx.response.status = (err as any).status ? (err as any).status : 500;
    ctx.body = {
      status: 0,
      message: (err as any).message
    };
  }
};
