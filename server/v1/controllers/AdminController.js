
import users from '../models/User';
import GeneralHelper from '../helpers/general';
const {response}=GeneralHelper;

class AdminController{

  static userToAdmin(req,res){
    const {userId}=req.params;
    const user=users.find(userId);
    let msg;
    
    if(user!==undefined){
     
      const user_admin=users.update(user.id,{role:'admin'});
      msg='​User account changed to admin';
      
      return response(res,200,msg,user_admin);
      
    }

    msg='User with the sent id not found';
    return response(res,400,msg);
    
  }

  static adminToUser(req,res){
    const {userId}=req.params;
    const user=users.find(userId);
    let msg='​Admin account changed to normal user';

    if(user!==undefined){
      const user_admin=users.update(user.id,{role:'user'});
      return response(res,200,msg,user_admin);
    
    }
    
    msg='Admin with the sent id not found';
    return response(res,400,msg);
  }

  static userToMentor(req,res){

    const {userId}=req.params;
    const user=users.find(userId);
    let msg='User not found,check his id';

    if(user!==undefined){
      let user_mentor=user;
      
      if(user.type!=='mentor'){

        user_mentor=users.update(user.id,{type:'mentor'});
        msg='​User account changed to mentor';
        return response(res,200,msg,user_mentor);
      }
      msg='​User is already a mentor';
      
      
    }
    return response(res,400,msg);
    

  }

  static mentorToUser(req,res){

    const {mentorId}=req.params;
    const mentor=users.findMentor(mentorId);
    let msg;
    if(mentor!==undefined){
     
      const user_updated=users.update(mentorId,{type:'user'});
      msg='​Mentor account changed to user';
      return response(res,200,msg,user_updated);
     
     
    }
    msg='Mentor not found';
    return response(res,400,msg);
    

  }
}

export default AdminController;