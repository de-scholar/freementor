import GeneralHelper from '../helpers/general';
import Users from '../model/User';
import bcrypt from 'bcrypt';
const {
  hashPassword,
  generateToken
}=GeneralHelper;



class AuthController{

  static signUp(req,res){
       
        

    let user_data={};
    user_data.id=Users.all().length+1;
    user_data.firstName=req.body.firstName;
    user_data.lastName=req.body.lastName;
    user_data.email=req.body.email;
    user_data.password=hashPassword(req.body.password);
    user_data.address=req.body.address;
    user_data.bio=req.body.bio;
    user_data.occupation=req.body.occupation;
    user_data.expertise=req.body.expertise;
    user_data.type='normal';//normal,mentor,admin

    const token=generateToken(user_data);
    const user=new Users();
    const simuler_user=user.findWhere('email',user_data.email).first();
      
    if(!simuler_user){
      //store user
      var created_user=Users.create(user_data);

      return res.status(200).json({
        status:200,
        message:'User created successfully',
        data:{
          token:token,
          message:'User created successfully',
          ...created_user
        }
      });
    }
    return res.status(401).json({
      status:401,
      error:'Email already exist',
    });
        

  }

  static signIn(req,res){
    let user_data={};
    user_data.email=req.body.email;
    user_data.password=req.body.password;
    const user=new Users();
    const user_found=user.findWhere('email',user_data.email).first();

    if(user_found!==false){
      const user=user_found;
            
          
           
      bcrypt.compare(user_data.password,user.password, function(err, success) {
        if(success){
          const token=generateToken(user);
          return res.status(200).json({
            message:'User is successfully logged in',
            status:200,
            data:{
              token:token,
              ...user
            }
          });
        }
        else{
          return res.status(404).json({
            status:404,
            error:'Password Incorrect',
            field:'password'
          });
        }
               
      });
            
            
            
    }else{
      return res.status(404).json({
        status:404,
        error:'Email Incorrect',
        field:'email'
      });
    }

        
       
  }

    


}

export default AuthController;