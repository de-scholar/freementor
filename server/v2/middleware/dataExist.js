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
  checkMentorExist: async ({ body }, res, next)=> {
    const mentor_id = parseInt(body.mentor_id);

    try {
      const [mentor] = await User.customQuery('WHERE id=$1 AND type=$2', [mentor_id, 'mentor']);

      if (!mentor) return response(res, 412, 'Mentor not found');
      return next();
    } catch (error) {
      return next(error);
    }
  },
};
