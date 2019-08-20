import GeneralHelper from '../helpers/general';
import User from '../model/User';


class UserController{

    static index(req,res){
        var users=User.all();
        return res.status(200).json({
            status:200,
            data:users
        });
    }

    static show(req,res){
        var user=User.find(req.params.id);
        return res.status(200).json({
            status:200,
            data:user
        });
    }


}

export default UserController;