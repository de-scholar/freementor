
import Users from '../models/User';
class AdminController{

  static userToMentor(req,res){

    const {userId}=req.params;
    const user=Users.find(userId);
   
    if(user!==undefined){
      let msg='​User account changed to mentor';
      let user_mentor=user;
      if(user.type!=='mentor'){
        user_mentor=Users.update(user.id,{type:'mentor'});
      }
      else{
        msg='​User is already a mentor';
      }
      
      return res.status(200).json({
        status:200,
        data:{
          message:msg,
          user_mentor,
        }
      });
    }

    return res.status(404).json({
      status:404,
      error:'User not found,check his id',
      
    });

  }
}

export default AdminController;