import User from '../models/User';
import Session from '../models/Session';
import GeneralHelper from '../helpers/general';

const { response, arrange_date } = GeneralHelper;

class SessionController {
  static async create(req, res, next) {
    try {
      const {
        auth_user: { id: mentee_id, email },
        body,
      } = req;

      body.status = 'pending';
      const { mentor_id } = body;

      let session = await Session.create({ ...body, mentee_id, mentor_id });

      session.menteeEmail = email;

      return response(res, 200, 'Session created successfully', arrange_date(session));
    } catch (e) {
      return next(e);
    }
  }

  static async acceptSession(req, res, next) {
    const { sessionId } = req.params;

    try {
      const update_session = await Session.update(sessionId, { status: 'accepted' });

      return response(res, 200, 'Session accepted', arrange_date(update_session));
    } catch (e) {
      return next(e);
    }
  }

  static async rejectSession(req, res) {
    const { sessionId } = req.params;

    try {
      const update_session = await Session.update(sessionId, { status: 'rejected' });

      return response(res, 200, 'Session rejected', arrange_date(update_session));
    } catch (e) {
      return next(e);
    }
  }
}

export default SessionController;
