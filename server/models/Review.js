
/**
 * Table :sessions
 * 
 * Property of our table
 * ---------------------
 * 1. id
 * 2. score
 * 3. remark
 * 4. sessionId
 * 5. crated_at
 */

import GeneralHelper from '../helpers/general';

let table=[
  {
    'score': 3,
    'remark': 'fsdfjnhfjksdf nkfdfjksd nkjfdskfds',
    'sessionId': 1,
    'id': 1,
    'created_at': 1566558853223,
    'mentorId': 2,
    'menteeId': 1,
    'menteeFullName': 'prodo kaka'

  },
];

const {removeUnexpect,isEmpty}=GeneralHelper;

class Review{
  
  constructor(){
    this._data=[];
    this._tab_index=null;
  }

  static expectInput(){
    const known_attributes=[
      'id',
      'score',
      'remark',
      'sessionId',
      'crated_at'
    ];

    return known_attributes;

  }

  static create(item){
    item=removeUnexpect(Review.expectInput(),item);
   
    if(!isEmpty(item)){
      item.id=table.length+1;
      item.created_at=Date.now();
      table.push(item);
      return item;
    }else{
      throw {
        message:'You have send unexpect data',
        expect_data:Review.expectInput()
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

export default Review;