
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
import Model from './model';




class Session extends Model{
  
  constructor(){
    super();
    this.known_attributes=[
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
  }


  //list of all sessions received by a mentor
  findForMentor(mentor_id){
    const all_sessions=this.all().filter((session)=>session.mentorId===parseInt(mentor_id));
    return all_sessions;
  }

  //list of all sessions sent by a normal user(mentee)
  findForMentee(mentee_id){
    const all_sessions=this.all().filter((session)=>session.menteeId===parseInt(mentee_id));
    return all_sessions;
  }



}

export default new Session();