const dbFileCheck = async (itemId: any, ctx: any) => {
  return await ctx.db.tblLibraryItems.findOne({
    where: {
      library_item_id: itemId
    }
  });
};

const dbFilesCheck = async (filesList: any, ctx: any) => {
  return await ctx.db.tblLibraryItems.findAll({
    where: {
      library_item_id: filesList
    }
  });
};

export { dbFileCheck, dbFilesCheck };
