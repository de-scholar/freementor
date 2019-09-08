
/**
 * Table :users
 * -----------
 * Property of the table
 * ---------------------
 * 1. id
 * 2. firstName
 * 3. lastName
 * 4. email
 * 5. password
 * 6. bio
 * 7. occupation
 * 8. expertise
 * 9. type :normal/mentor/admin;
 * 10. address
 * 11. role
 * 12. created_at
 *
 */

import Model from './model';
import GeneralHelper from '../helpers/general';

const { response } = GeneralHelper;


class User extends Model {
  constructor() {
    super();
    this.table = 'users';
    this.dataToHide = ['password'];
    this.uniqueAttr = 'email';
    this.known_attributes = [
      'id',
      'firstname',
      'lastname',
      'email',
      'password',
      'bio',
      'occupation',
      'expertise',
      'type',
      'address',
      'role',

    ];
  }
}

export default new User();
