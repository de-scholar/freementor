
let table=[];

class Users{
  
  constructor(){
    this._data=[];
    this._tab_index=null;
  }

  static create(user){
    user.id=table.length+1;
    user.created_at=Date.now();
    table.push(user);
    return user;
  }

  static all(){
    return table;
  }

  static find(userId){
    
    const [first_user]=table.filter(({id})=>id===parseInt(userId));
    return first_user;
  }

  static delete(user_id){
    table=table.filter(({id})=>id!==parseInt(user_id));
    return true;
  }

  findWhere(key,value){
    this._data=table.filter((user)=>user[key].toString()===value.toString());
    return this;
  }

  get(){
    return this._data;
  }

  first(){
    const [first]=this._data;
    return this._data.length>0?first:false;
  }

  static update(user_id,data=[]){
    const [first_user]=table.filter(({id},index)=>{

      if(id===parseInt(user_id))this._tab_index=index;
      return id===user_id;

    });

    //update user
    const update_user=Object.assign(first_user,data);
    //update the index of the user in table
    table[this._tab_index]=update_user;

    return update_user;

  }


}

export default Users;