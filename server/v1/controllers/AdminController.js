
import users from '../models/User';

class AdminController{

  static userToAdmin(req,res){
    const {userId}=req.params;
    const user=users.find(userId);
    if(user!==undefined){
      const user_admin=users.update(user.id,{type:'admin'});
      return res.status(200).json({
        status:200,
        data:{
          message:'​User account changed to admin',
          ...user_admin,
        }
      });
    }
    
    return res.status(400).json({
      status:400,
      error:'User with the sent id not found',
      
    });
  }

  static userToMentor(req,res){

    const {userId}=req.params;
    const user=users.find(userId);
    let error_msg='User not found,check his id';

    if(user!==undefined){
      let user_mentor=user;
      
      if(user.type!=='mentor'){

        user_mentor=users.update(user.id,{type:'mentor'});

        return res.status(200).json({
          status:200,
          data:{
            message:'​User account changed to mentor',
            ...user_mentor,
          }
        });
      }
      error_msg='​User is already a mentor';
      
      
    }

    return res.status(400).json({
      status:400,
      error:error_msg,
      
    });

  }

  static mentorToUser(req,res){

    const {mentorId}=req.params;
    const mentor=users.findMentor(mentorId);
    
    if(mentor!==undefined){
     
      const user_updated=users.update(mentorId,{type:'user'});

      return res.status(200).json({
        status:200,
        data:{
          message:'​Mentor account changed to user',
          ...user_updated,
        }
      });
     
    }

    return res.status(400).json({
      status:400,
      error:'Mentor not found',
      
    });

  }
}

export default AdminController;