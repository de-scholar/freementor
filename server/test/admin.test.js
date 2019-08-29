/* eslint-disable no-undef */
import { should,use,request } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../index';



should();
use(chaiHttp);

let user_admin;
let user_normal;
let notAdmin_user;




describe('AdminController /PATCH user to admin',()=>{

  
  before((done) => {
    
    
    const defaultUser1={
      firstName:'prodo',
      lastName:'kaka',
      email:'p2@gmail.com',
      password:'12345678',
      bio:'his bio',
      expertise:'web development',
      occupation:'software developer',
      address:'kigali',
    };


    const defaultUser2={
      firstName:'ged',
      lastName:'bro',
      email:'g2@gmail.com',
      password:'12345678',
      bio:'his bio',
      expertise:'web development',
      occupation:'software developer',
      address:'kigali',
    };

    const defaultUser3={
      firstName:'lol',
      lastName:'amakuru',
      email:'ama1@gmail.com',
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
        user_normal=res.body.data;
       
      });

    request(server).post('/api/v1/auth/signup')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(defaultUser3)
      .then((res) => {
        
        notAdmin_user=res.body.data;
        done();
      });


  });

  //eslint-disable-next-line no-undef
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

  
  it('Should return a code status 400 if corresponding user of the  sent user id is not found',(done)=>{
    
    const {token:user_admin_token}=user_admin;
    const wrong_user_id=1001;
    request(server).patch(`/api/v1/admin/${wrong_user_id}`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_admin_token)
      .end((err,res)=>{
        res.should.have.status(400);
        res.body.error.should.be.a('string').eql('User with the sent id not found');
        done();
      });
  });


  //eslint-disable-next-line no-undef
  it('Should return status 401 if the token has been not sent',(done)=>{
    const {id:admin_user_id}=user_admin;
    request(server).patch(`/api/v1/admin/${admin_user_id}`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .end((err,res)=>{
        
        res.should.have.status(401);
        done();
      });
  });

  //eslint-disable-next-line no-undef
  it('Should verify invalid token',(done)=>{
    
    const wrongToken='ciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoicHJvZG8iLCJsYXN0TmFtZSI6Imtha2EiLCJlbWFpbCI6InBAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkVFcyYmxUWnYzZ1FiNldNRXJZSmtULi5YSUhrendnZW5GWm1NTVlXVjZwaFRFd1dGUjhqbk8iLCJhZGRyZXNzIjoiYWRkcmVzcyIsImJpbyI6ImJpbyIsIm9jY3VwYXRpb24iOiJvY2N1cCIsImV4cGVydGlzZSI6ImV4cHJ0IiwidHlwZSI6Im5vcm1hbCIsImlhdCI6MTU2NjQ2NjQyNiwiZXhwIjoxNTY2ODEyMDI2fQ.hBkHlelgfCp1qnRVhgvCPFcm16camwv0mZNxFGhHkmw';
    const {id:admin_user_id}=user_admin;

    request(server).patch(`/api/v1/admin/${admin_user_id}`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token',wrongToken)
      .end((err,res)=>{
        
        res.should.have.status(200);
        res.body.error.should.be.a('string').eql('invalid token');
        done();
      });
  });

  //eslint-disable-next-line no-undef
  it('Should verify malformed token',(done)=>{
    
    const malformed_token='badToken';
    const {id:admin_user_id}=user_admin;
    request(server).patch(`/api/v1/admin/${admin_user_id}`)
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


describe('AdminController /PATCH user to mentor',()=>{

  //eslint-disable-next-line no-undef
  it('Should change a normal user to mentor',(done)=>{
    const {id:normal_user_id}=user_normal;
    const {token:user_admin_token}=user_admin;
    request(server).patch(`/api/v1/user/${normal_user_id}`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_admin_token)
      .end((err,res)=>{
        
        res.should.have.status(200);
        res.body.data.should.have.property('type').eql('mentor');
        res.body.data.should.have.property('message').eql('​User account changed to mentor');
        done();
      });
  });

  //eslint-disable-next-line no-undef
  it('Should return status 401 if the token has been not sent',(done)=>{
    const {id:normal_user_id}=user_normal;
    
    request(server).patch(`/api/v1/user/${normal_user_id}`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .end((err,res)=>{
        
        res.should.have.status(401);
        done();
      });
  });

  //eslint-disable-next-line no-undef
  it('Should verify invalid token',(done)=>{
    const {id:normal_user_id}=user_normal;

    const wrongToken='ciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoicHJvZG8iLCJsYXN0TmFtZSI6Imtha2EiLCJlbWFpbCI6InBAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkVFcyYmxUWnYzZ1FiNldNRXJZSmtULi5YSUhrendnZW5GWm1NTVlXVjZwaFRFd1dGUjhqbk8iLCJhZGRyZXNzIjoiYWRkcmVzcyIsImJpbyI6ImJpbyIsIm9jY3VwYXRpb24iOiJvY2N1cCIsImV4cGVydGlzZSI6ImV4cHJ0IiwidHlwZSI6Im5vcm1hbCIsImlhdCI6MTU2NjQ2NjQyNiwiZXhwIjoxNTY2ODEyMDI2fQ.hBkHlelgfCp1qnRVhgvCPFcm16camwv0mZNxFGhHkmw';


    request(server).patch(`/api/v1/user/${normal_user_id}`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token',wrongToken)
      .end((err,res)=>{
        
        res.should.have.status(200);
        res.body.error.should.be.a('string').eql('invalid token');
        done();
      });
  });

  //eslint-disable-next-line no-undef
  it('Should verify malformed token',(done)=>{
    const {id:normal_user_id}=user_normal;
    const malformed_token='badToken';
    request(server).patch(`/api/v1/user/${normal_user_id}`)
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
  
  //eslint-disable-next-line no-undef
  it('Should return status:400 if the user is already a mentor',(done)=>{
    const {id:normal_user_id}=user_normal;
    const {token:user_admin_token}=user_admin;
    request(server).patch(`/api/v1/user/${normal_user_id}`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_admin_token)
      .end((err,res)=>{
         
        res.should.have.status(400);
        res.body.error.should.be.a('string').eql('​User is already a mentor');
        done();
      });
  });
  
  
  //eslint-disable-next-line no-undef
  it('Should return an access forbiden if the user who changes is not an admin or does not have email:p@gmail.com',(done)=>{
    const {id:normal_user_id}=user_normal;
    const {token:user_noAdmin_token}=notAdmin_user;
    request(server).patch(`/api/v1/user/${normal_user_id}`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_noAdmin_token)
      .end((err,res)=>{
           
        res.should.have.status(403);
        res.body.error.should.be.a('string').eql('Access forbiden,reserved for admin');
        done();
      });
  });
  
  //eslint-disable-next-line no-undef
  it('Should return status:400 if the id of the user to be changed was not found',(done)=>{
    const wrongId=450;
    const {token:user_admin_token}=user_admin;
    request(server).patch(`/api/v1/user/${wrongId}`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_admin_token)
      .end((err,res)=>{
         
        res.should.have.status(400);
        res.body.error.should.be.a('string').eql('User not found,check his id');
        done();
      });
  });



});