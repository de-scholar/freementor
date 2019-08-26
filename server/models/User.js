
/**
 * Table :users
 * -----------
 * Property of the table
 * ---------------------
 * 1. id
 * 2. firstName
 * 3. lastName
 * 4. email
 * 5. password
 * 6. bio
 * 7. occupation
 * 8. expertise
 * 9. type :normal/mentor/admin;
 * 10. address
 * 11. created_at
 */

let table=[
  // {
  //   'id': 1,
  //   'firstName': 'prodo',
  //   'lastName': 'kaka',
  //   'email': 'p@gmail.com',
  //   'password': '$2b$10$T9E0O1I7MWN688TD3WIYPuAYgLRO9sdxM/Viwo0XIKw.MqSvDkmC6',
  //   'address': 'address',
  //   'bio': 'bio',
  //   'occupation': 'occup',
  //   'expertise': 'exprt',
  //   'type': 'normal',
  //   'created_at': 1566471640041,

  // },
  // {
  //   'id': 2,
  //   'firstName': 'bro',
  //   'lastName': 'vick',
  //   'email': 'vick@gmail.com',
  //   'password': '$2b$10$LZwvFxhIVCgqYxVXOx.qkOjUHbuBO20HrXRhYjgGhs8U14UE107ES',
  //   'address': 'address',
  //   'bio': 'bio',
  //   'occupation': 'occup',
  //   'expertise': 'exprt',
  //   'type': 'mentor',
  //   'created_at': 1566471646043
  // },
  // {
  //   'id': 3,
  //   'firstName': 'gedeon',
  //   'lastName': 'kate',
  //   'email': 'g@gmail.com',
  //   'password': '$2b$10$LZwvFxhIVCgqYxVXOx.qkOjUHbuBO20HrXRhYjgGhs8U14UE107ES',
  //   'address': 'address',
  //   'bio': 'bio',
  //   'occupation': 'occup',
  //   'expertise': 'exprt',
  //   'type': 'mentor',
  //   'created_at': 1566471646043
  // }
];

class User{
  
  constructor(){
    this._data=[];
    this._tab_index=null;
  }

  static create(user){
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

  static findMentor(mentorId){
    const [first_user]=table.filter(({id,type})=>
      id===parseInt(mentorId) && type==='mentor');
      
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
    let update_item={};
    table.map((item)=>{
      if(item.id===parseInt(user_id)){
        update_item=Object.assign(item,data);
        return update_item;
      }
      return item;
    });
    return update_item;

  }

  static truncate(){
    table=[];
  }


}

export default User;