
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
    this.table = 'reviews';
    this.attributes_to_change = {
      id: 'review_id',
    };
    this.known_attributes = [
      'id',
      'score',
      'remark',
      'session_id',
      'created_at',
    ];
  }
}

export default new Review();
