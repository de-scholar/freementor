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

      const menteeEmail = email;
      session = change_attribute({...session, menteeEmail }, Session.attributes_to_change);
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

  static async view_sessions(req, res, next) {
    const { auth_user } = req;

    let { type: user_type } = auth_user;
    let companion_type = 'mentee';

    if (user_type === 'user') {
      user_type = 'mentee';
      companion_type = 'mentor';
    }
    try {
      const query = (`SELECT users.email as ${companion_type}_email , `
      + ' sessions.*  FROM sessions INNER JOIN users '
      + ` ON sessions.${companion_type}_id = users.id `
      + ` WHERE sessions.${user_type}_id = $1 `);
      let all_sessions = await Session.fullQuery(query, [auth_user.id]);

      all_sessions = change_attribute(all_sessions, Session.attributes_to_change);
      return response(res, 200, 'List of all sessions', arrange_date(all_sessions), ['start_date', 'end_date']);
    } catch (error) {
      next(error);
    }
  }
}

export default SessionController;
