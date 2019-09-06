
import users from '../models/User';
import GeneralHelper from '../helpers/general';
const {response}=GeneralHelper;

class AdminController{

  static userToAdmin(req,res){
    const {userId}=req.params;
    
    const dataToChange={column:'role',value:'admin'};

    return users.switchTo(userId,dataToChange,res);
    
  }

  static adminToUser(req,res){
    const {userId}=req.params;
    
    const dataToChange={column:'role',value:'user'};

    return users.switchTo(userId,dataToChange,res);
  }

  static userToMentor(req,res){

    const {userId}=req.params;
    
    const dataToChange={column:'type',value:'mentor'};

    return users.switchTo(userId,dataToChange,res);
    

  }

  static mentorToUser(req,res){

    const {mentorId}=req.params;
    const dataToChange={column:'type',value:'user'};

    return users.switchTo(mentorId,dataToChange,res);
    

  }
}

export default AdminController;