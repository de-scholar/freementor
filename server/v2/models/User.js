
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
 * 11. is_admin
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
      'is_admin',

    ];
  }

  async switchTo(userId, data, res, next) {
    try {
      const user = await this.find(userId);

      let msg;

      if (user) {
        const new_user = await this.update(user.id, data);
        const [column] = Object.keys(data);

        msg = `Account changed to ${column === 'is_admin' ? new_user[column] ? 'admin':'user' :new_user[column]}`;
        return response(res, 200, msg, { [column]: new_user[column] });
      }

      msg = 'user with the sent id not found';
      return response(res, 412, msg);
    } catch (error) {
      return next(error);
    }
  }
}

export default new User();
