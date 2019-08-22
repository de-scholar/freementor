import User from '../models/User';


class UserController{

  static mentors(req,res){
    const users=new User();
    let mentors=users.findWhere('type','mentor').get();

    
    return res.status(200).json({
      status:200,
      data:mentors,
     
    }); 
    
  }

  static mentor(req,res){
    const {mentorId}=req.params;
    const mentor=User.findMentor(mentorId);

    if(mentor!==undefined){
      
      return res.status(200).json({
        status:200,
        data:mentor,
      });
    }
    res.status(404).json({
      status:404,
      error:'Mentor not found',
    });
    
  }
}

export default UserController;