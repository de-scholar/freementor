import User from '../models/User';
import GeneralHelper from '../helpers/general';

const { response } = GeneralHelper;

export default {
  checkUser: async ({ body }, res, next)=> {
    try {
      const check_user = await User.findWhere(User.uniqueAttr, body.email);
      const simuler_user = check_user.first();

      return simuler_user ? response(res, 409, 'Email already exist')
        : next();
    } catch (error) {
      return next(error);
    }
  },
};
