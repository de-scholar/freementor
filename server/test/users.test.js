/* eslint-disable no-undef */
import { should,use,request } from 'chai';
import chaiHttp from 'chai-http';
import server from '../bin/www';


should();
use(chaiHttp);


let user_admin;
let user_mentor;

// eslint-disable-next-line no-undef
describe('UserController /GET all mentors',()=>{

  // eslint-disable-next-line no-undef
  before((done) => {

  
    
    const defaultUser1={
      firstName:'prodo',
      lastName:'kaka',
      email:'p1@gmail.com',
      password:'12345678',
      bio:'his bio',
      expertise:'web development',
      occupation:'software developer',
      address:'kigali',
    };


    const defaultUser2={
      firstName:'ged',
      lastName:'bro',
      email:'g1@gmail.com',
      password:'12345678',
      bio:'his bio',
      expertise:'web development',
      occupation:'software developer',
      address:'kigali',
    };

  

    request(server).post('/api/v1/auth/signup')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(defaultUser1)
      .then((res) => {
         
        user_admin=res.body.data;
       
      });

    request(server).post('/api/v1/auth/signup')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(defaultUser2)
      .then((res) => {
         
        user_mentor=res.body.data;
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

 

  // eslint-disable-next-line no-undef
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
      .end(()=>{
        done();
      });
  });
  
  it('Should return an array containing object of all mentors',(done)=>{
    const {token}=user_mentor;
    request(server).get('/api/v1/mentors')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', token)
      .end((err,res)=>{
        
        res.should.have.status(200);
        res.body.data.should.be.an('array');
        done();
      });
  });


  
  it('Should return status 401 if the token has been not sent',(done)=>{
    request(server).get('/api/v1/mentors')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .end((err,res)=>{
        
        res.should.have.status(401);
        done();
      });
  });

  
  it('Should verify invalid token',(done)=>{
    const wrongToken='ciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoicHJvZG8iLCJsYXN0TmFtZSI6Imtha2EiLCJlbWFpbCI6InBAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkVFcyYmxUWnYzZ1FiNldNRXJZSmtULi5YSUhrendnZW5GWm1NTVlXVjZwaFRFd1dGUjhqbk8iLCJhZGRyZXNzIjoiYWRkcmVzcyIsImJpbyI6ImJpbyIsIm9jY3VwYXRpb24iOiJvY2N1cCIsImV4cGVydGlzZSI6ImV4cHJ0IiwidHlwZSI6Im5vcm1hbCIsImlhdCI6MTU2NjQ2NjQyNiwiZXhwIjoxNTY2ODEyMDI2fQ.hBkHlelgfCp1qnRVhgvCPFcm16camwv0mZNxFGhHkmw';
    request(server).get('/api/v1/mentors')
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
    request(server).get('/api/v1/mentors')
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


// eslint-disable-next-line no-undef
describe('UserController /GET specific mentor',()=>{
  
  it('Should return an object of a specific mentor',(done)=>{
    const {token,id:mentorId}=user_mentor;
    request(server).get(`/api/v1/mentors/${mentorId}`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', token)
      .end((err,res)=>{
          
        res.should.have.status(200);
        res.body.data.should.be.an('object');
        done();
      });
  });

  it('Should return a status code 400 if the mentor was not found',(done)=>{
    const {token}=user_mentor;
    const wrong_mentor_id='jjoi4768';
    request(server).get(`/api/v1/mentors/${wrong_mentor_id}`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', token)
      .end((err,res)=>{
          
        res.should.have.status(400);
        res.body.error.should.be.an('string').eql('Mentor not found');
        done();
      });
  });
  
  
  it('Should return status 401 if the token has been not sent',(done)=>{
    request(server).get('/api/v1/mentors')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .end((err,res)=>{
          
        res.should.have.status(401);
        done();
      });
  });
  
  
  it('Should verify invalid token',(done)=>{
    const wrongToken='ciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoicHJvZG8iLCJsYXN0TmFtZSI6Imtha2EiLCJlbWFpbCI6InBAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkVFcyYmxUWnYzZ1FiNldNRXJZSmtULi5YSUhrendnZW5GWm1NTVlXVjZwaFRFd1dGUjhqbk8iLCJhZGRyZXNzIjoiYWRkcmVzcyIsImJpbyI6ImJpbyIsIm9jY3VwYXRpb24iOiJvY2N1cCIsImV4cGVydGlzZSI6ImV4cHJ0IiwidHlwZSI6Im5vcm1hbCIsImlhdCI6MTU2NjQ2NjQyNiwiZXhwIjoxNTY2ODEyMDI2fQ.hBkHlelgfCp1qnRVhgvCPFcm16camwv0mZNxFGhHkmw';
    request(server).get('/api/v1/mentors')
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
    request(server).get('/api/v1/mentors')
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