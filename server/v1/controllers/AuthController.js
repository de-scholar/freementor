import GeneralHelper from '../helpers/general';
import users from '../models/User';
import bcrypt from 'bcrypt';

const {
  hashPassword,
  generateToken,
  response
}=GeneralHelper;


class AuthController{

  static signUp(req,res){
    let {body}=req;
 

    body.id=users.all().length+1;
    body.password=hashPassword(req.body.password);
    body.type='user';//user,mentor
    body.role='user';//user,admin
    const {id,email,type,role}=body;
    
    const token=generateToken({id,email,type,role});
    const simuler_user=users.findWhere('email',email).first();
    let msg;
      
    if(!simuler_user){
      //store user
      var created_user=users.create(body);

      msg='User created successfully';
      const {id,firstName,lastName,email}=created_user;
      const data={token,id,firstName,lastName,email};

      return response(res,201,msg,data)
  
    }
    msg='Email already exist';
    return response(res,400,msg);
    
  }

  static signIn(req,res){
    let user_data={};

    user_data.email=req.body.email;
    user_data.password=req.body.password;
    
    const user_found=users.findWhere('email',user_data.email).first();
    let msg;
    
    if(user_found!==false){
      const user=user_found;
        
      bcrypt.compare(user_data.password,user.password, (err, success)=> {
       
        if(success){
          const {id,email,type,role,firstName,lastName}=user;
          const token=generateToken({id,email,type,role});

          msg='User is successfully logged in';
          let data={id,token,firstName,lastName,email};

          return response(res,200,msg,data);
          
        }
        msg='Invalid Credentials';
        return response(res,401,msg);
               
      });
            
    }
    else{
      msg='Invalid Credentials';
      return response(res,401,msg);
    }
        
       
  }


}

export default AuthController;