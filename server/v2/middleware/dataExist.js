import User from '../models/User';
import GeneralHelper from '../helpers/general';

const { response } = GeneralHelper;

export default {
  checkUserEmail: async ({ body }, res, next)=> {
    try {
      const [simuler_user] = await User.findWhere(User.uniqueAttr, body.email);

      return simuler_user ? response(res, 409, 'Email already exist')
        : next();
    } catch (error) {
      return next(error);
    }
  },
};
