
/**
 * Table :sessions
 * 
 * Property of our table
 * ---------------------
 * 1. id
 * 2. questions
 * 3. start_date (session scope: starting date)
 * 4. end_date  (session scope: ending date)
 * 5. mentorId
 * 6. menteeId
 * 7. status :pending/accepted/rejected
 * 8. score
 * 9. remark
 
 */

import GeneralHelper from '../helpers/general';

let table=[
  // {
  //   'questions': 'questions ',
  //   'start_date': '12-03-2019',
  //   'end_date': '04-12-2019',
  //   'mentorId': 2,
  //   'menteeId': 1,
  //   'status': 'pending',
  //   'id': 1,
  //   'created_at': 1566471653903
    
  // },
  // {
  //   'questions': 'questions ',
  //   'start_date': '12-03-2019',
  //   'end_date': '04-12-2019',
  //   'mentorId': 2,
  //   'menteeId': 3,
  //   'status': 'pending',
  //   'id': 1,
  //   'created_at': 1566471653903
    
  // }
];
const {removeUnexpect,isEmpty}=GeneralHelper;

class Session{
  
  constructor(){
    this._data=[];
    this._tab_index=null;
  }

  static expectInput(){
    const known_attributes=[
      'id',
      'questions',
      'start_date',
      'end_date',
      'mentorId',
      'menteeId',
      'status',
      'score',
      'remark',
    ];

    return known_attributes;

  }

  static create(item){
    item=removeUnexpect(Session.expectInput(),item);
   
    if(!isEmpty(item)){
      item.id=table.length+1;
      item.created_at=Date.now();
      table.push(item);
      return item;
    }else{
      throw {
        message:'You have send unexpect data',
        expect_data:Session.expectInput()
      };
    }

    
  }

  static all(){
    return table;
  }

  static find(itemId){
    
    const [first_item]=table.filter(({id})=>id===parseInt(itemId));
    return first_item;
  }

  //list of all sessions received by a mentor
  static findForMentor(mentor_id){
    const all_sessions=table.filter((session)=>session.mentorId===parseInt(mentor_id));
    return all_sessions;
  }

  //list of all sessions sent by a normal user(mentee)
  static findForMentee(mentee_id){
    const all_sessions=table.filter((session)=>session.menteeId===parseInt(mentee_id));
    return all_sessions;
  }

  
  static delete(item_id){
    table=table.filter(({id})=>id!==parseInt(item_id));
    return true;
  }

  findWhere(key,value){
    this._data=table.filter((item)=>item[key].toString()===value.toString());
    return this;
  }

  get(){
    return this._data;
  }

  first(){
    const [first]=this._data;
    return this._data.length>0?first:false;
  }

  static update(item_id,data=[]){
    
    let update_item={};

    table.map((item)=>{

      if(item.id===parseInt(item_id)){
        update_item=Object.assign(item,data);
        return update_item;
      }
      return item;

    });

    return update_item;

  }


}

export default Session;