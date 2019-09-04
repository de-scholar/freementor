
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
import Review from './Review';



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


  findForMentor(mentor_id){
    const all_sessions=this.all().filter((session)=>session.mentorId===parseInt(mentor_id));
    return all_sessions;
  }

  findForMentee(mentee_id){
    const all_sessions=this.all().filter((session)=>session.menteeId===parseInt(mentee_id));
    return all_sessions;
  }

  review(sessionId){
    return Review.findWhere('sessionId',sessionId).first();
  }



}

export default new Session();