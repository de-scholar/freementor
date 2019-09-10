
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

class Session extends Model {
  constructor() {
    super();
    this.table = 'sessions';
    this.attributes_to_change = {
      id: 'session_id',
    };
    this.known_attributes = [
      'id',
      'questions',
      'date',
      'mentor_id',
      'mentee_id',
      'status',
    ];
  }
}

export default new Session();
