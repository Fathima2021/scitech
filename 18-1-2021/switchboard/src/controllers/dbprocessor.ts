export const insertData = async (tableName: any, payload: any, ctx: any) => {
  try {
    const insertedData = await ctx.db[tableName].create(payload);
    return insertedData;
  } catch (err) {
    throw err;
  }
};

export const updateData = async (tableName: any, payload: any, condition: any, ctx: any) => {
  const updatedData = await ctx.db[tableName].update(payload, { where: condition });
  return updatedData;
};
