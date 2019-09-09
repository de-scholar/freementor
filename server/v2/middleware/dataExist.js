import User from '../models/User';
import Session from '../models/Session';
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
  checkSessionExist: async (req, res, next)=> {
    const { params: { sessionId }, auth_user } = req;

    try {
      const session = await Session.find(sessionId);
      let msg = 'Session not found,create sessions';

      if (!session) return response(res, 400, msg);

      msg = 'Session does not concern you';
      if (auth_user.id !== session.mentor_id) return response(res, 400, msg);

      msg = `You can not do this operation : session status is ${session.status}`;
      if (session.status !== 'pending') return response(res, 400, msg);

      return next();
    } catch (error) {
      return next(error);
    }
  },
};
