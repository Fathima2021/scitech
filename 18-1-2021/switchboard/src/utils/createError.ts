export const createError = (status: number, message: string) => {
  let error: any = new Error(message);
  error.status = status ? status : 500;
  throw error;
};
