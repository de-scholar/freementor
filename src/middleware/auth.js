import GeneralHelper from '../helpers/general';

class Auth{

  static authorization(req,res,next){
    const token=req.headers['token'];
         
    if(token===undefined){
      return res.status(403).json({
        error:'Access forbiden',
        status:403
      });
            

    }else{
            
      req.token=token;
      next();
    }
  }

  static tokenVerify(req,res,next){
    GeneralHelper.verifyToken(req.token); 
        
    return next();
  }
}

export default Auth;