import Koa from 'koa';



export const activity = async (ctx: Koa.Context) => {
    try{
        const { page = 1 } = ctx.query;
        const result = await ctx.db.tblLibraryItemsHistory.findAndCountAll({
            limit: 10,
            offset: (+page - 1) * 10
        });
        ctx.body = { status: 1, data:result };
    }catch(error){
        ctx.throw((error as any).status ? (error as any).status : 500, `Error: ${(error as any).message}`);
    }
}