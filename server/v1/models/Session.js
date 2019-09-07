
/**
 * Table :sessions
 *
 * Property of our table
 * ---------------------
 * 1. id
 * 2. questions
 * 3. start_date (session scope: starting date)
 * 4. end_date  (session scope: ending date)
 * 5. mentorId
 * 6. menteeId
 * 7. status :pending/accepted/rejected
 * 8. score
 * 9. remark

 */
import Model from './model';
import Review from './Review';
import User from './User';


class Session extends Model {
  constructor() {
    super();
    this.known_attributes = [
      'id',
      'questions',
      'start_date',
      'end_date',
      'mentorId',
      'menteeId',
      'status',
    ];
  }


  findFor(userId, userType) {
    const fetch_sessions = this.all().filter((session)=> session[`${userType}Id`] === parseInt(userId));
    const all_sessions = [];

    fetch_sessions.forEach((session)=> {
      let target_companionUser;
      let companion_name;

      if (userType === 'mentor') {
        target_companionUser = User.find(session.menteeId);
        companion_name = 'mentee';
      } else {
        target_companionUser = User.find(session.mentorId);
        companion_name = 'mentor';
      }
      const {
        id, firstName, lastName, email,
      } = target_companionUser;

      target_companionUser = {
        id, firstName, lastName, email,
      };
      const { id: sessionId, status, created_at } = session;
      const session_needData = { sessionId, status, created_at };

      all_sessions.push({ ...session, ...{ [companion_name]: target_companionUser } });
    });

    return all_sessions;
  }


  review(sessionId) {
    return Review.findWhere('sessionId', sessionId).first();
  }
}

export default new Session();
