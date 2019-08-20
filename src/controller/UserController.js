import User from '../model/User';


class UserController{

  static mentors(req,res){
    var mentors=new User().findWhere('type','mentor').get();
    return res.status(200).json({
      status:200,
      data:mentors
    }); 
  }
}

export default UserController;