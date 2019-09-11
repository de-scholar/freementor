import User from '../models/User';
import Session from '../models/Session';
import Review from '../models/Review';
import GeneralHelper from '../helpers/general';

const { response } = GeneralHelper;

export default {
  checkUserEmail: async ({ body }, res, next)=> {
    try {
      const [simuler_user] = await User.findWhere(User.uniqueAttr, body.email);

      if (simuler_user) return response(res, 409, 'Email already exist');
      return next();
    } catch (error) {
      return next(error);
    }
  },
  checkEmailSignin: async (req, res, next)=> {
    try {
      const [user] = await User.findWhere('email', req.body.email);

      if (!user) return response(res, 401, 'Invalid Credentials');

      req.user_found = user;
      return next();
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

  checkSessionReviewOnCreate: async (req, res, next)=> {
    const { params: { sessionId } } = req;

    try {
      const session = await Session.find(sessionId);

      if (!session) return response(res, 400, 'Session to review is not found');

      const [review] = await Review.findWhere('session_id', sessionId);

      if (review) return response(res, 400, 'Session has another review');

      return next();
    } catch (e) {
      return next(e);
    }
  },
  checkSessionReviewOnDelete: async (req, res, next)=> {
    const { sessionId } = req.params;

    try {
      const [review] = await Review.findWhere('session_id', sessionId);

      if (!review) return response(res, 400, 'Review of the session not found');
      req.review_id = review.id;
      return next();
    } catch (e) {
      return next(e);
    }
  },
};
