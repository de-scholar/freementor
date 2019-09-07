
/**
 * Table :sessions
 *
 * Property of our table
 * ---------------------
 * 1. id
 * 2. score
 * 3. remark
 * 4. sessionId
 * 5. crated_at
 */

import Model from './model';

class Review extends Model {
  constructor() {
    super();
    this.known_attributes = [
      'id',
      'score',
      'remark',
      'sessionId',
      'created_at',
    ];
  }

  session(sessionId) {
    return this.findWhere('sessionId', sessionId).first();
  }
}

export default new Review();
