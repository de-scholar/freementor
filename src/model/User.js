
let user_tb=[];

class Users{
  
  constructor(){
    this._data=[];
  }

  static create(user){
    user.id=user_tb.length+1;
    user.created_at=Date.now();
    user_tb.push(user);
    return user;
  }

  static all(){
    return user_tb;
  }

  static find(userId){
    return user_tb.find(({id})=>id===userId);
  }

  static delete(user_id){
    user_tb=user_tb.filter(({id})=>id!==user_id);
  }

  findWhere(key,value){
    this._data=user_tb.filter((user)=>user[key]===value);
    return this;
  }

  get(){
    return this._data;
  }

  first(){
    const [first]=this._data;
    return this._data.length>0?first:false;
  }


}

export default Users;