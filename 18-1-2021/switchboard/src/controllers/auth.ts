import Koa from 'koa';
import { createError } from '../utils/createError';
import Sequelize from 'sequelize';

/** Login  */

export const login = async (ctx: Koa.Context) => {
  try {
    let user = { ...ctx.user, lastLogin: '' };
    let lastLogin;
    const findData = await ctx.db.tblUserProfile.findOne({
      where: {
        user_name: user.email
      }
    });

    if (findData) {
      lastLogin = findData.dataValues.last_login_time;
      user = { ...user, lastLogin: lastLogin };
      const updateData = await ctx.db.tblUserProfile.update(
        { last_login_time: Sequelize.fn('GETDATE'), login_status: 1, last_session_details: 'login' },
        {
          where: {
            user_name: user.email
          }
        }
      );
      if (!updateData) {
        createError(500, 'login failed!');
      }
    } else {
      const createData = await ctx.db.tblUserProfile.create({
        last_login_time: Sequelize.fn('GETDATE'),
        login_status: 1,
        last_session_details: 'login',
        id: Date.now(),
        status: 1,
        preference: '',
        favourites: '',
        user_name: user.email
      });
      if (!createData) {
        createError(500, 'something went wrong , try again!');
      }
    }
    ctx.body = { status: 1, user };
  } catch (error) {
    ctx.throw((error as any).status ? (error as any).status : 500, `Error: ${(error as any).message}`);
  }
};

// /** Logout  */

export const logout = async (ctx: Koa.Context) => {
  try {
    const user = ctx.user;
    const findData = await ctx.db.tblUserProfile.findOne({
      where: {
        user_name: user.email
      }
    });
    if (!findData) {
      createError(400, 'User not found!');
    }
    const updateData = await ctx.db.tblUserProfile.update(
      { last_login_time: Sequelize.fn('GETDATE'), login_status: 0, last_session_details: 'logged out' },
      {
        where: {
          user_name: user.email
        }
      }
    );
    if (!updateData) {
      createError(500, 'logout failed!');
    }
    ctx.body = { status: 1, message: 'SUCCESS' };
  } catch (error) {
    ctx.throw((error as any).status ? (error as any).status : 500, `Error: ${(error as any).message}`);
  }
};
