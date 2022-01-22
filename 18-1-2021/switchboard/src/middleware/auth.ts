import { Context } from 'koa';
import jwksClient from 'jwks-rsa';
import jwt from 'jsonwebtoken';

const tenantId = '91567928-bfd2-4271-9e33-032e0584956e';

const getAuthHeader = (ctx: any) => {
  return ctx.request.get('authorization').replace(/Bearer /, '');
};

const getSigningKeys = async (header: any, tid: string): Promise<any> => {
  const client = jwksClient({ jwksUri: `https://login.microsoftonline.com/${tid}/discovery/v2.0/keys` });
  return await client.getSigningKey(header.kid);
};

const verifyTokenSignature = async (authToken: string): Promise<any | boolean> => {
  const decodedToken: any = jwt.decode(authToken, { complete: true });
  const keys = await getSigningKeys(decodedToken.header, decodedToken.payload.tid);
  return jwt.verify(authToken, keys.getPublicKey());
};

const authorizeAzureAdToken = async (ctx: Context, next: any) => {
  // const token = getAuthHeader(ctx);
  // if (!token) {
  //   ctx.throw('Auth token is required');
  // }
  // try {
  //   if(process.env.NODE_ENV === 'development'){
  //     ctx.user = {
  //       name: "Lokendranath",
  //       email: "lokendranath@patent-art.com",
  //       roles: ["Admin"]
  //     };
  //   }else{
  //     const jwtPayload = await verifyTokenSignature(token);
  //     ctx.user = {
  //       name: jwtPayload.name,
  //       email: jwtPayload.preferred_username,
  //       roles: jwtPayload.roles
  //     };
  //   }
  // } catch (e) {
  //   ctx.throw('Unauthorized user');
  // }
  await next();
};

export { authorizeAzureAdToken };
