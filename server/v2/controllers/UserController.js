import User from '../models/User';
import GeneralHelper from '../helpers/general';

const { response, arrange_date } = GeneralHelper;

const dataToHide = ['role', 'type'];

class UserController {
  static async mentors(req, res, next) {
    try {
      let mentors = await User.findWhere('type', 'mentor');

      mentors = arrange_date(mentors);

      return response(res, 200, 'List of mentors', mentors, [...User.dataToHide, ...dataToHide]);
    } catch (error) {
      return next(error);
    }
  }

  static async mentor(req, res, next) {
    const { mentorId } = req.params;

    try {
      let [mentor] = await User.customQuery('WHERE id=$1 AND type=$2', [mentorId, 'mentor']);

      mentor = arrange_date(mentor);
      if (mentor) return response(res, 200, 'A specific mentor', mentor, [...User.dataToHide, ...dataToHide]);
      return response(res, 412, 'Mentor not found');
    } catch (error) {
      return next(error);
    }
  }
}

export default UserController;
