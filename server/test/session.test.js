/* eslint-disable no-undef */
import { should,use,request } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../index';



should();
use(chaiHttp);

let user_mentee;
let user_mentor;
let created_session;
let user_3;
let user_admin;

//CREATE SESSIONS

describe('SessionController /POST sessions',()=>{

    

  
  before((done) => {
    
    const defaultUser1={
      firstName:'prodo',
      lastName:'kaka',
      email:'p4@gmail.com',
      password:'12345678',
      bio:'his bio',
      expertise:'web development',
      occupation:'software developer',
      address:'kigali',
    };


    const defaultUser2={
      firstName:'ged',
      lastName:'bro',
      email:'g4@gmail.com',
      password:'12345678',
      bio:'his bio',
      expertise:'web development',
      occupation:'software developer',
      address:'kigali',
    };

    const defaultUser3={
      firstName:'lol',
      lastName:'amakuru',
      email:'ama8@gmail.com',
      password:'12345678',
      bio:'his bio',
      expertise:'web development',
      occupation:'software developer',
      address:'kigali',
    };

    const defaultUserAdmin={
      firstName:'admin',
      lastName:'doctor',
      email:'doctor@gmail.com',
      password:'12345678',
      bio:'his bio',
      expertise:'web development',
      occupation:'software developer',
      address:'kigali',
    };

    request(server).post('/api/v1/auth/signup')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(defaultUserAdmin)
      .then((res) => {
         
        user_admin=res.body.data;
       
      });

    request(server).post('/api/v1/auth/signup')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(defaultUser1)
      .then((res) => {
         
        user_mentee=res.body.data;
       
      });

    request(server).post('/api/v1/auth/signup')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(defaultUser2)
      .then((res) => {
        user_mentor=res.body.data;
       
       
      });


    request(server).post('/api/v1/auth/signup')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(defaultUser3)
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
        res.body.data.should.have.property('type').eql('admin');
        res.body.data.should.have.property('message').eql('​User account changed to admin');
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

  
    


  
  it('Should return status code 400 when try to create session with invalid input ',(done)=>{
    
   
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

  
  it('Should return 400 code status if the mentorId is not found',(done)=>{
    const wrongToken='ciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoicHJvZG8iLCJsYXN0TmFtZSI6Imtha2EiLCJlbWFpbCI6InBAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkVFcyYmxUWnYzZ1FiNldNRXJZSmtULi5YSUhrendnZW5GWm1NTVlXVjZwaFRFd1dGUjhqbk8iLCJhZGRyZXNzIjoiYWRkcmVzcyIsImJpbyI6ImJpbyIsIm9jY3VwYXRpb24iOiJvY2N1cCIsImV4cGVydGlzZSI6ImV4cHJ0IiwidHlwZSI6Im5vcm1hbCIsImlhdCI6MTU2NjQ2NjQyNiwiZXhwIjoxNTY2ODEyMDI2fQ.hBkHlelgfCp1qnRVhgvCPFcm16camwv0mZNxFGhHkmw';
    request(server).post('/api/v1/sessions')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token',wrongToken)
      .end((err,res)=>{
        
        res.should.have.status(200);
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('invalid token');
        done();
      });
  });



  
  it('Should return status 401 if the token has been not sent',(done)=>{
    request(server).post('/api/v1/sessions')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .end((err,res)=>{
        
        res.should.have.status(401);
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
        
        res.should.have.status(200);
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
           
        res.should.have.status(200);
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('jwt malformed');
        done();
      });
  });


});






describe('SessionController /GET sessions',()=>{

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
        
        res.should.have.status(200);
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
           
        res.should.have.status(200);
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('jwt malformed');
        done();
      });
  });

});




// ACCEPT A MENTORSHIP SESSION TEST


describe('SessionController /PATCH: accept session',()=>{

  
  it(('Should login the mentor to update his payload in jwt'), (done) => {
    const user_mentor_credential = {
      email: user_mentor.email,
      password: '12345678'
    };
        
    request(server).post('/api/v1/auth/signin')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(user_mentor_credential)
      .end((err, res) => {
       
        Object.assign(user_mentor,res.body.data);
        res.should.have.status(200);
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
    const token_otherMentor='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZmlyc3ROYW1lIjoiYnJvIiwibGFzdE5hbWUiOiJ2aWNrIiwiZW1haWwiOiJ2aWNrQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJGMyLzZsWGhIOC5RMnE2cG5oM3BpQy5CVi9tOEJPdm9idlE1RkZaVHY4QlB4MngwNVNpc0tlIiwiYWRkcmVzcyI6ImFkZHJlc3MiLCJiaW8iOiJiaW8iLCJvY2N1cGF0aW9uIjoib2NjdXAiLCJleHBlcnRpc2UiOiJleHBydCIsInR5cGUiOiJtZW50b3IiLCJjcmVhdGVkX2F0IjoxNTY2Nzc0Nzc4MTEwLCJpYXQiOjE1NjY3NzQ4MzksImV4cCI6MTU2NzEyMDQzOX0.7qQr193tqO6-WtN0y4M6Cm9jPrttiZA1dvQLQEmih-4';
    
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
          
        res.should.have.status(200);
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
             
        res.should.have.status(200);
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
    const token_otherMentor='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZmlyc3ROYW1lIjoiYnJvIiwibGFzdE5hbWUiOiJ2aWNrIiwiZW1haWwiOiJ2aWNrQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJGMyLzZsWGhIOC5RMnE2cG5oM3BpQy5CVi9tOEJPdm9idlE1RkZaVHY4QlB4MngwNVNpc0tlIiwiYWRkcmVzcyI6ImFkZHJlc3MiLCJiaW8iOiJiaW8iLCJvY2N1cGF0aW9uIjoib2NjdXAiLCJleHBlcnRpc2UiOiJleHBydCIsInR5cGUiOiJtZW50b3IiLCJjcmVhdGVkX2F0IjoxNTY2Nzc0Nzc4MTEwLCJpYXQiOjE1NjY3NzQ4MzksImV4cCI6MTU2NzEyMDQzOX0.7qQr193tqO6-WtN0y4M6Cm9jPrttiZA1dvQLQEmih-4';
      
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
            
        res.should.have.status(200);
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
               
        res.should.have.status(200);
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('jwt malformed');
        done();
      });
  });
    
});