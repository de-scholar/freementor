
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
 * 11. role
 * 12. created_at
 * 
 */

import Model from './model';



class User extends Model{
  
  constructor(){
    super();
    this.known_attributes=[
      'id',
      'firstName',
      'lastName',
      'email',
      'password',
      'bio',
      'occupation',
      'expertise',
      'type',
      'address',
      'role'
      
    ];
  }

 

  findMentor(mentorId){
    const [first_user]=this.all().filter(({id,type})=>
      id===parseInt(mentorId) && type==='mentor');
      
    return first_user;
  }



}

export default new User();