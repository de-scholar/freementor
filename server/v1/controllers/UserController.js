import users from '../models/User';
import GeneralHelper from '../helpers/general';
const {response}=GeneralHelper;


class UserController{

  static mentors(req,res){
    
    let mentors=users.findWhere('type','mentor').get();

    return response(res,200,'OK',mentors);
    
  }

  static mentor(req,res){
    const {mentorId}=req.params;
    const mentor=users.findMentor(mentorId);
    
    if(mentor!==undefined){
      
      return res.status(200).json({
        status:200,
        data:mentor,
      });
    }
    return response(res,400,'Mentor not found');
    
  }
}

export default UserController;