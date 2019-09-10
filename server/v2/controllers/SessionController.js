import User from '../models/User';
import Session from '../models/Session';
import GeneralHelper from '../helpers/general';

const { response, arrange_date, change_attribute } = GeneralHelper;

class SessionController {
  static async create(req, res, next) {
    try {
      const {
        auth_user: { id: mentee_id, email },
        body,
      } = req;

      const { mentor_id } = body;

      let session = await Session.create({ ...body, mentee_id, mentor_id });

      session.menteeEmail = email;
      session = change_attribute(session, Session.attributes_to_change);
      return response(res, 200, 'Session created successfully', arrange_date(session));
    } catch (e) {
      return next(e);
    }
  }

  static async acceptSession(req, res, next) {
    const { sessionId } = req.params;

    try {
      let update_session = await Session.update(sessionId, { status: 'accepted' });

      update_session = change_attribute(update_session, Session.attributes_to_change);
      return response(res, 200, 'Session accepted', arrange_date(update_session));
    } catch (e) {
      return next(e);
    }
  }

  static async rejectSession(req, res) {
    const { sessionId } = req.params;

    try {
      let update_session = await Session.update(sessionId, { status: 'rejected' });

      update_session = change_attribute(update_session, Session.attributes_to_change);
      return response(res, 200, 'Session rejected', arrange_date(update_session));
    } catch (e) {
      return next(e);
    }
  }
}

export default SessionController;
