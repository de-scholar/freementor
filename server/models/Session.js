
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
 
 */

import GeneralHelper from '../helpers/general';

let table=[];
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