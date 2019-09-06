import { should,use,request } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../index';
import data from './data';


should();
use(chaiHttp);

let user_mentee;
let user_mentor;
let created_session;
let user_3;
let user_admin;
let unconcern_mentor;

//CREATE SESSIONS

describe('SessionController /POST sessions',()=>{

    

  
  before((done) => {
    
   

    request(server).post('/api/v1/auth/signup')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(data.session_test.user4)
      .then((res) => {
         
        user_admin=res.body.data;
       
      });

    request(server).post('/api/v1/auth/signup')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(data.session_test.user1)
      .then((res) => {
         
        user_mentee=res.body.data;
       
      });

    request(server).post('/api/v1/auth/signup')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(data.session_test.user2)
      .then((res) => {
        user_mentor=res.body.data;
       
       
      });


    request(server).post('/api/v1/auth/signup')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(data.session_test.user3)
      .then((res) => {
      
        user_3=res.body.data;
        done();
      });

  });

  
  it('Should change a normal user to admin',(done)=>{
    
    const {id:normal_user_id,token:user_admin_token}=user_admin;
    request(server).patch(`/api/v1/admin/${normal_user_id}`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_admin_token)
      .end((err,res)=>{

        Object.assign(user_admin,res.body.data);
        res.should.have.status(200);
        res.body.data.should.have.property('role').eql('admin');
        res.body.should.have.property('message').eql('Account changed to admin');
        done();
      });
  });

 

  
  it(('Should login the new admin user to update his payload in jwt'), (done) => {
    const user_admin_credential = {
      email: user_admin.email,
      password: '12345678'
    };
          
    request(server).post('/api/v1/auth/signin')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(user_admin_credential)
      .end((err, res) => {
         
        Object.assign(user_admin,res.body.data);
        res.should.have.status(200);
        res.body.message.should.be.a('string').eql('User is successfully logged in');
        done();
      });
  });

  
  it('Should change normal user to mentor first',(done)=>{
    const {id:normal_user_id}=user_mentor;
    const {token:user_admin_token}=user_admin;
    request(server).patch(`/api/v1/user/${normal_user_id}`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_admin_token)
      .end((err,res)=>{
        
        Object.assign(user_mentor,res.body.data);
        res.should.have.status(200);
        res.body.data.type.should.be.eql('mentor');
        done();
      });
  });



  
  it('Should create a mentorship session',(done)=>{
    
    const {id:mentorId}=user_mentor;
    const {token:mentee_token}=user_mentee;
    const defaultSession={
      questions:'questions here',
      mentorId:mentorId,
      start_date:'12/12/2019',
      end_date:'20/03/2020',
  
    };
    request(server).post('/api/v1/sessions')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', mentee_token)
      .send(defaultSession)
      .end((err,res)=>{
        created_session=res.body.data;
        res.should.have.status(200);
        res.body.data.should.have.property('status').eql('pending');
        done();
      });
  });

  
    


  
  it('Should return 400 code status if the mentorId is not found',(done)=>{
    
   
    const {token:mentee_token}=user_mentee;
    const defaultSession={
      questions:'questions here',
      mentorId:40,
      start_date:'12/12/2019',
      end_date:'20/03/2020',
  
    };
    request(server).post('/api/v1/sessions')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', mentee_token)
      .send(defaultSession)
      .end((err,res)=>{
        res.should.have.status(400);
        res.body.error.should.be.a('string').eql('Mentor not found');
        done();
      });
  });

  
  it('Should return 400 code status when the recorded input are invalid',(done)=>{

    const {id:mentorId}=user_mentor;
    const {token:mentee_token}=user_mentee;
    const defaultSession={
      questions:'questions here',
      mentorI:mentorId,
      start_date:'12/12/2019',
      end_date:'20/03/2020',
  
    };
    request(server).post('/api/v1/sessions')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', mentee_token)
      .send(defaultSession)
      .end((err,res)=>{
       
        res.should.have.status(400);
        res.body.error.should.have.be.an('object');
        done();
      });
  });



  
  it('Should return status 401 if the token has been not sent',(done)=>{
    request(server).post('/api/v1/sessions')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .end((err,res)=>{
        
        res.should.have.status(401);
        res.body.should.have.property('error').eql('Anauthorized,please login first');
        done();
      });
  });

  
  it('Should verify invalid token',(done)=>{
    const wrongToken='ciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoicHJvZG8iLCJsYXN0TmFtZSI6Imtha2EiLCJlbWFpbCI6InBAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkVFcyYmxUWnYzZ1FiNldNRXJZSmtULi5YSUhrendnZW5GWm1NTVlXVjZwaFRFd1dGUjhqbk8iLCJhZGRyZXNzIjoiYWRkcmVzcyIsImJpbyI6ImJpbyIsIm9jY3VwYXRpb24iOiJvY2N1cCIsImV4cGVydGlzZSI6ImV4cHJ0IiwidHlwZSI6Im5vcm1hbCIsImlhdCI6MTU2NjQ2NjQyNiwiZXhwIjoxNTY2ODEyMDI2fQ.hBkHlelgfCp1qnRVhgvCPFcm16camwv0mZNxFGhHkmw';
    request(server).post('/api/v1/sessions')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token',wrongToken)
      .end((err,res)=>{
        
       
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('invalid token');
        done();
      });
  });

  
  it('Should verify malformed token',(done)=>{
    
    const malformed_token='badToken';
    request(server).post('/api/v1/sessions')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token',malformed_token)
      .end((err,res)=>{
           
      
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('jwt malformed');
        done();
      });
  });


});






describe('SessionController /GET sessions',()=>{

  before((done)=>{
    const unconern_mentor_info=data.session_test.unconcern_mentor;

    

    request(server).post('/api/v1/auth/signup')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(unconern_mentor_info)
      .then((res) => {
        unconcern_mentor=res.body.data;
        done();
      });
  });

  it(('Should login a user mentor to update his token paylaod'), (done) => {
    const existingUser = {
      email: user_mentor.email,
      password: '12345678'
    };
          
    request(server).post('/api/v1/auth/signin')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(existingUser)
      .end((err, res) => {
        
        user_mentor=res.body.data;
        res.should.have.status(200);
        res.body.message.should.be.a('string').eql('User is successfully logged in');
        done();
      });
  });
  
  it('Should return an array of received mentorship sessions if the auth user is a mentor',(done)=>{
    const {token:mentorToken}=user_mentor;
   
    
    request(server).get('/api/v1/sessions')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', mentorToken)
      .end((err,res)=>{
       
        res.should.have.status(200);
        res.body.data.should.be.an('array');
       
        done();
      });
  });


  
  it('Should return an array of sent mentorship sessions if the auth user is a mentee',(done)=>{
    const {token:menteeToken}=user_mentee;
    request(server).get('/api/v1/sessions')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', menteeToken)
      .end((err,res)=>{
        
        res.should.have.status(200);
        res.body.data.should.be.an('array');
        done();
      });
  });


  
  it('Should return status 401 if the token has been not sent',(done)=>{
    request(server).get('/api/v1/sessions')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .end((err,res)=>{
        
        res.should.have.status(401);
        res.body.should.have.property('error').eql('Anauthorized,please login first');
        done();
      });
  });

  
  it('Should verify invalid token',(done)=>{
    const wrongToken='ciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoicHJvZG8iLCJsYXN0TmFtZSI6Imtha2EiLCJlbWFpbCI6InBAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkVFcyYmxUWnYzZ1FiNldNRXJZSmtULi5YSUhrendnZW5GWm1NTVlXVjZwaFRFd1dGUjhqbk8iLCJhZGRyZXNzIjoiYWRkcmVzcyIsImJpbyI6ImJpbyIsIm9jY3VwYXRpb24iOiJvY2N1cCIsImV4cGVydGlzZSI6ImV4cHJ0IiwidHlwZSI6Im5vcm1hbCIsImlhdCI6MTU2NjQ2NjQyNiwiZXhwIjoxNTY2ODEyMDI2fQ.hBkHlelgfCp1qnRVhgvCPFcm16camwv0mZNxFGhHkmw';
    request(server).get('/api/v1/sessions')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token',wrongToken)
      .end((err,res)=>{
        
     
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('invalid token');
        done();
      });
  });

  
  it('Should verify malformed token',(done)=>{
    
    const malformed_token='badToken';
    request(server).get('/api/v1/sessions')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token',malformed_token)
      .end((err,res)=>{
           
       
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('jwt malformed');
        done();
      });
  });

});




// ACCEPT A MENTORSHIP SESSION TEST


describe('SessionController /PATCH: accept session',()=>{

  before((done)=>{

    //login the mentor
    const user_mentor_credential = {
      email: user_mentor.email,
      password: '12345678'
    };
        
    request(server).post('/api/v1/auth/signin')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(user_mentor_credential)
      .then((res) => {
        Object.assign(user_mentor,res.body.data);
      });


    //creating uncorcern mentor
    const {id:normal_user_id}=unconcern_mentor;
    const {token:user_admin_token}=user_admin;
    request(server).patch(`/api/v1/user/${normal_user_id}`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_admin_token)
      .then((res)=>{
          
        Object.assign(unconcern_mentor,res.body.data);
        done();
      });
  });
  
  it(('Should login the unconcern mentor to update his payload in jwt'), (done) => {
    const unconcern_mentor_credential = {
      email: unconcern_mentor.email,
      password: '12345678'
    };
        
    request(server).post('/api/v1/auth/signin')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(unconcern_mentor_credential)
      .end((err, res) => {
        Object.assign(unconcern_mentor,res.body.data);
        done();
      });
  });
  
  
  it('Should return a status code 200 when mentor accept a session',(done)=>{
    const {id:sessionId}=created_session;
    const {token:mentorToken}=user_mentor;
   
    
    request(server).patch(`/api/v1/sessions/${sessionId}/accept`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', mentorToken)
      .end((err,res)=>{
        const {status}=res.body.data;
        Object.assign(created_session,{status});
        res.should.have.status(200);
        res.body.data.should.have.property('status').eql('accepted');
         
        done();
      });
  });


  
  it('Should return a status code 400 when session with sent sessionId is not found',(done)=>{
    const wrong_sessionId=312;
    const {token:mentorToken}=user_mentor;
    request(server).patch(`/api/v1/sessions/${wrong_sessionId}/accept`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', mentorToken)
      .end((err,res)=>{
                
        res.should.have.status(400);
        res.body.error.should.be.a('string').eql('Session not found,create sessions');
             
        done();
      });
  });

  
  it('Should return a status code 400 when an unconcern mentor want to accept a mentorship request',(done)=>{
    const {id:sessionId}=created_session;
    const {token:token_otherMentor}=unconcern_mentor;
    request(server).patch(`/api/v1/sessions/${sessionId}/accept`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', token_otherMentor)
      .end((err,res)=>{
        res.should.have.status(400);
        res.body.error.should.be.a('string').eql('Session does not concern you');
             
        done();
      });
  });
  
  
  
  it('Should return a status code 400 when a mentor is trying to repeat the same operation',(done)=>{
  
    const {id:sessionId}=created_session;
    const {token:mentorToken}=user_mentor;
    request(server).patch(`/api/v1/sessions/${sessionId}/accept`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', mentorToken)
      .end((err,res)=>{
            
        res.should.have.status(400);
        res.body.error.should.be.a('string')
          .eql(`You can not do this operation : session status is ${created_session.status}`);
        
        done();
      });
  });

  
  it('Should return a status code 403 when an auth user is not a mentor',(done)=>{
    const {id:sessionId}=created_session;
    const {token:normal_userToken}=user_3;
    
    request(server).patch(`/api/v1/sessions/${sessionId}/accept`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', normal_userToken)
      .end((err,res)=>{
           
        res.should.have.status(403);
        res.body.error.should.be.a('string')
          .eql('Access forbiden,reserved for mentors');
        
        done();
      });
  });
    
  
  it('Should return status 401 if the token has been not sent',(done)=>{
    const {id:sessionId}=created_session;
    
    request(server).patch(`/api/v1/sessions/${sessionId}/accept`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .end((err,res)=>{
          
        res.should.have.status(401);
        res.body.should.have.property('error').eql('Anauthorized,please login first');
        done();
      });
  });
  
  
  it('Should verify invalid token',(done)=>{
    const wrongToken='ciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoicHJvZG8iLCJsYXN0TmFtZSI6Imtha2EiLCJlbWFpbCI6InBAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkVFcyYmxUWnYzZ1FiNldNRXJZSmtULi5YSUhrendnZW5GWm1NTVlXVjZwaFRFd1dGUjhqbk8iLCJhZGRyZXNzIjoiYWRkcmVzcyIsImJpbyI6ImJpbyIsIm9jY3VwYXRpb24iOiJvY2N1cCIsImV4cGVydGlzZSI6ImV4cHJ0IiwidHlwZSI6Im5vcm1hbCIsImlhdCI6MTU2NjQ2NjQyNiwiZXhwIjoxNTY2ODEyMDI2fQ.hBkHlelgfCp1qnRVhgvCPFcm16camwv0mZNxFGhHkmw';
    const {id:sessionId}=created_session;
    
    request(server).patch(`/api/v1/sessions/${sessionId}/accept`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token',wrongToken)
      .end((err,res)=>{
          
  
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('invalid token');
        done();
      });
  });
  
  
  it('Should verify malformed token',(done)=>{
      
    const malformed_token='badToken';
    const {id:sessionId}=created_session;
    request(server).patch(`/api/v1/sessions/${sessionId}/accept`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token',malformed_token)
      .end((err,res)=>{
             
       
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('jwt malformed');
        done();
      });
  });
  
});





// REJECT MENTORSHIP SESSION



describe('SessionController /PATCH reject session',()=>{

  
  before((done)=>{
    //creation of a new sesion
    const {id:mentorId}=user_mentor;
    const {token:mentee_token}=user_mentee;
    const defaultSession={
      questions:'questions2 here',
      mentorId:mentorId,
      start_date:'12/12/2019',
      end_date:'20/03/2020',
  
    };

    request(server).post('/api/v1/sessions')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', mentee_token)
      .send(defaultSession)
      .then((res)=>{
        created_session=res.body.data;
        done();
      });
  });


  
  it('Should return a status code 200 when mentor reject a session',(done)=>{
    const {id:sessionId}=created_session;
    const {token:mentorToken}=user_mentor;
     
    request(server).patch(`/api/v1/sessions/${sessionId}/reject`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', mentorToken)
      .end((err,res)=>{
       
        const {status}=res.body.data;
        Object.assign(created_session,{status});
        res.should.have.status(200);
        res.body.data.should.have.property('status').eql('rejected');
           
        done();
      });
  });
  
  
  
  it('Should return a status code 400 when session with sent sessionId is not found',(done)=>{
    const wrong_sessionId=312;
    const {token:mentorToken}=user_mentor;
    request(server).patch(`/api/v1/sessions/${wrong_sessionId}/reject`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', mentorToken)
      .end((err,res)=>{
                  
        res.should.have.status(400);
        res.body.error.should.be.a('string').eql('Session not found,create sessions');
               
        done();
      });
  });
  
  
  it('Should return a status code 400 when an unconcern mentor want to reject a mentorship request',(done)=>{
    const {id:sessionId}=created_session;
    const {token:token_otherMentor}=unconcern_mentor;
    request(server).patch(`/api/v1/sessions/${sessionId}/reject`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', token_otherMentor)
      .end((err,res)=>{
          
        res.should.have.status(400);
        res.body.error.should.be.a('string').eql('Session does not concern you');
               
        done();
      });
  });
    
    
  
  it('Should return a status code 400 when a mentor is trying to repeat the same operation',(done)=>{
    const {id:sessionId}=created_session;
    const {token:mentorToken}=user_mentor;
    request(server).patch(`/api/v1/sessions/${sessionId}/reject`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', mentorToken)
      .end((err,res)=>{
              
        res.should.have.status(400);
        res.body.error.should.be.a('string')
          .eql(`You can not do this operation : session status is ${created_session.status}`);
          
        done();
      });
  });
  
  
  it('Should return a status code 403 when an auth user is not a mentor',(done)=>{
    const {id:sessionId}=created_session;
      
    const {token:normal_userToken}=user_3;
      
    request(server).patch(`/api/v1/sessions/${sessionId}/reject`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', normal_userToken)
      .end((err,res)=>{
             
        res.should.have.status(403);
        res.body.error.should.be.a('string')
          .eql('Access forbiden,reserved for mentors');
          
        done();
      });
  });
      
  
  it('Should return status 401 if the token has been not sent',(done)=>{
    const {id:sessionId}=created_session;
      
    request(server).patch(`/api/v1/sessions/${sessionId}/reject`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .end((err,res)=>{
            
        res.should.have.status(401);
        res.body.should.have.property('error').eql('Anauthorized,please login first');
        done();
      });
  });
    
  
  it('Should verify invalid token',(done)=>{
    const wrongToken='ciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoicHJvZG8iLCJsYXN0TmFtZSI6Imtha2EiLCJlbWFpbCI6InBAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkVFcyYmxUWnYzZ1FiNldNRXJZSmtULi5YSUhrendnZW5GWm1NTVlXVjZwaFRFd1dGUjhqbk8iLCJhZGRyZXNzIjoiYWRkcmVzcyIsImJpbyI6ImJpbyIsIm9jY3VwYXRpb24iOiJvY2N1cCIsImV4cGVydGlzZSI6ImV4cHJ0IiwidHlwZSI6Im5vcm1hbCIsImlhdCI6MTU2NjQ2NjQyNiwiZXhwIjoxNTY2ODEyMDI2fQ.hBkHlelgfCp1qnRVhgvCPFcm16camwv0mZNxFGhHkmw';
    const {id:sessionId}=created_session;
      
    request(server).patch(`/api/v1/sessions/${sessionId}/reject`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token',wrongToken)
      .end((err,res)=>{
            
        
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('invalid token');
        done();
      });
  });
    
  
  it('Should verify malformed token',(done)=>{
        
    const malformed_token='badToken';
    const {id:sessionId}=created_session;
    request(server).patch(`/api/v1/sessions/${sessionId}/reject`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token',malformed_token)
      .end((err,res)=>{
      
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('jwt malformed');
        done();
      });
  });
    
});