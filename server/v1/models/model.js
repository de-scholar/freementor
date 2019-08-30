
import GeneralHelper from '../helpers/general';

const {removeUnexpect}=GeneralHelper;

class Model{
  
  constructor(){
    this._table=[];
    this._data=[];
    this._tab_index=null;
    
  }

  create(item){
    item=removeUnexpect(this.known_attributes,item);
    item.created_at=Date.now();
    item.id=this.all().length+1;
    this._table.push(item);
    return item;
  }

  all(){
    return this._table;
  }

  find(userId){
    
    const [first_user]=this._table.filter(({id})=>id===parseInt(userId));
    return first_user;
  }


  findWhere(key,value){
    this._data=this._table.filter((item)=>item[key].toString()===value.toString());
    return this;
  }

  get(){
    return this._data;
  }

  first(){
    const [first]=this._data;
    return this._data.length>0?first:false;
  }

  update(user_id,data){
    let update_item={};
    this._table.map((item)=>{
      if(item.id===parseInt(user_id)){
        update_item=Object.assign(item,data);
        return update_item;
      }
      return item;
    });
    return update_item;

  }

  delete(item_id){
    const new_table=this._table.filter(({id})=>id!==parseInt(item_id));
    this._table=new_table;
    return true;
  }


}

export default Model;