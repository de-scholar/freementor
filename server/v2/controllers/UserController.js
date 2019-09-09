import User from '../models/User';
import GeneralHelper from '../helpers/general';

const { response } = GeneralHelper;

const dataToHide = ['role', 'type'];

class UserController {
  static async mentors(req, res, next) {
    try {
      const mentors = await User.findWhere('type', 'mentor');

      return response(res, 200, 'OK', mentors, [...User.dataToHide, ...dataToHide]);
    } catch (error) {
      return next(error);
    }
  }

  static async mentor(req, res, next) {
    const { mentorId } = req.params;

    try {
      const [mentor] = await User.customQuery('WHERE id=$1 AND type=$2', [mentorId, 'mentor']);

      if (mentor) return response(res, 200, 'OK', mentor, [...User.dataToHide, ...dataToHide]);

      return response(res, 412, 'Mentor not found');
    } catch (error) {
      return next(error);
    }
  }
}

export default UserController;
