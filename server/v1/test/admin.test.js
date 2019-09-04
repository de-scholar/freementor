/* eslint-disable no-undef */
import { should,use,request } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../index';
import data from './data';


should();
use(chaiHttp);

let user_admin1;
let user_admin2;
let user_normal;
let notAdmin_user;
let created_mentor;



describe('AdminController /PATCH user to admin',()=>{

  
  before((done) => {
    
    
    
     
    request(server).post('/api/v1/auth/signup')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(data.admin_test.user1)
      .then((res) => {
        user_admin1=res.body.data;
       
      });

    request(server).post('/api/v1/auth/signup')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(data.admin_test.user4)
      .then((res) => {
        user_admin2=res.body.data;
       
      });

    request(server).post('/api/v1/auth/signup')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(data.admin_test.user2)
      .then((res) => {
        user_normal=res.body.data;
       
      });

    request(server).post('/api/v1/auth/signup')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(data.admin_test.user3)
      .then((res) => {
        
        notAdmin_user=res.body.data;
        done();
      });


  });

  //eslint-disable-next-line no-undef
  it('Should change a normal user to admin',(done)=>{
    
    const {id:normal_user_id,token:user_admin_token}=user_admin1;
    request(server).patch(`/api/v1/admin/${normal_user_id}`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_admin_token)
      .end((err,res)=>{
        
        Object.assign(user_admin1,res.body.data);
        res.should.have.status(200);
        res.body.data.should.have.property('role').eql('admin');
        res.body.data.should.have.property('message').eql('​User account changed to admin');
        done();
      });
  });

 

  
  it(('Should login the new admin user to update his payload in jwt'), (done) => {
    const user_admin_credential = {
      email: user_admin1.email,
      password: '12345678'
    };
          
    request(server).post('/api/v1/auth/signin')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(user_admin_credential)
      .end((err, res) => {
        
        Object.assign(user_admin1,res.body.data);
        res.should.have.status(200);
        res.body.message.should.be.a('string').eql('User is successfully logged in');
        done();

      });
  });

  
  it('Should return a code status 400 if corresponding user of the  sent user id is not found',(done)=>{
    
    const {token:user_admin_token}=user_admin1;
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
    const {id:admin_user_id}=user_admin1;
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
    const {id:admin_user_id}=user_admin1;

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
    const {id:admin_user_id}=user_admin1;
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

//USER ADMIN TO NORMAL USER

describe('AdminController /PATCH admin to user',()=>{
 

  before((done)=>{
    //change another user to admin2
    const {id:admin2_user_id}=user_admin2;
    const {token:admin1_token}=user_admin1;
    request(server).patch(`/api/v1/admin/${admin2_user_id}`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', admin1_token)
      .then((res)=>{
        Object.assign(user_admin2,res.body.data);
        done();
      });
    
  });

 

  
  it(('Should login the new admin user to update his payload in jwt'), (done) => {
    const user_admin_credential = {
      email: user_admin2.email,
      password: '12345678'
    };
          
    request(server).post('/api/v1/auth/signin')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(user_admin_credential)
      .end((err, res) => {
        
        Object.assign(user_admin2,res.body.data);
        res.should.have.status(200);
        res.body.message.should.be.a('string').eql('User is successfully logged in');
          
        done();
      });
  });

  //eslint-disable-next-line no-undef
  it('Should change an admin user to a normal user',(done)=>{

    const {token:admin1_token}=user_admin1;
    const {id:admin2_id}=user_admin2;
    request(server).patch(`/api/v1/admin-to/${admin2_id}`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', admin1_token)
      .end((err,res)=>{
          
        Object.assign(user_admin1,res.body.data);
        res.should.have.status(200);
        res.body.data.should.have.property('role').eql('user');
        res.body.data.should.have.property('message').eql('​Admin account changed to normal user');
        done();
      });
  });
  
  it('Should return a code status 400 if corresponding user of the  sent user id is not found',(done)=>{
  
    const {token:admin1_token}=user_admin1;
    const wrong_admin2_id=1001;
    request(server).patch(`/api/v1/admin-to/${wrong_admin2_id}`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', admin1_token)
      .end((err,res)=>{
        res.should.have.status(400);
        res.body.error.should.be.a('string').eql('Admin with the sent id not found');
        done();
      });
  });

  it('Should return a code status 403 if the user who is doing the action is not an admin',(done)=>{
  
    const {token:No_admin_token}=notAdmin_user;
    const {id:admin2_id}=user_admin2;
    request(server).patch(`/api/v1/admin-to/${admin2_id}`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', No_admin_token)
      .end((err,res)=>{
        res.should.have.status(403);
        res.body.error.should.be.a('string').eql('Access forbiden,reserved for admin');
        done();
      });
  });


  //eslint-disable-next-line no-undef
  it('Should return status 401 if the token has been not sent',(done)=>{
   
    const {id:admin2_id}=user_admin2;
    request(server).patch(`/api/v1/admin-to/${admin2_id}`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .end((err,res)=>{
        res.should.have.status(401);
        res.body.should.have.property('error').eql('Anauthorized,please login first');
        done();
      });
  });

  //eslint-disable-next-line no-undef
  it('Should verify invalid token',(done)=>{
    
    const wrongToken='ciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoicHJvZG8iLCJsYXN0TmFtZSI6Imtha2EiLCJlbWFpbCI6InBAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkVFcyYmxUWnYzZ1FiNldNRXJZSmtULi5YSUhrendnZW5GWm1NTVlXVjZwaFRFd1dGUjhqbk8iLCJhZGRyZXNzIjoiYWRkcmVzcyIsImJpbyI6ImJpbyIsIm9jY3VwYXRpb24iOiJvY2N1cCIsImV4cGVydGlzZSI6ImV4cHJ0IiwidHlwZSI6Im5vcm1hbCIsImlhdCI6MTU2NjQ2NjQyNiwiZXhwIjoxNTY2ODEyMDI2fQ.hBkHlelgfCp1qnRVhgvCPFcm16camwv0mZNxFGhHkmw';
    const {id:admin2_user_id}=user_admin2;

    request(server).patch(`/api/v1/admin-to/${admin2_user_id}`)
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
    const {id:admin2_user_id}=user_admin2;
    request(server).patch(`/api/v1/admin-to/${admin2_user_id}`)
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
    const {token:user_admin_token}=user_admin1;
    request(server).patch(`/api/v1/user/${normal_user_id}`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_admin_token)
      .end((err,res)=>{
        created_mentor=res.body.data;
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
        res.body.should.have.property('error').eql('Anauthorized,please login first');
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
    const {token:user_admin_token}=user_admin1;
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
    const {token:user_admin_token}=user_admin1;
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



//MENTOR TO USER


describe('AdminController /PATCH mentor to user',()=>{

  //eslint-disable-next-line no-undef
  it('Should change a mentor to normal user',(done)=>{
    const {id:mentor_user_id}=created_mentor;
    const {token:user_admin_token}=user_admin1;
    request(server).patch(`/api/v1/mentor/${mentor_user_id}`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_admin_token)
      .end((err,res)=>{
        
        res.should.have.status(200);
        res.body.data.should.have.property('type').eql('user');
        done();
      });
  });

  //eslint-disable-next-line no-undef
  it('Should return status 401 if the token has been not sent',(done)=>{
    const {id:normal_user_id}=user_normal;
    
    request(server).patch(`/api/v1/mentor/${normal_user_id}`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .end((err,res)=>{
        
        res.should.have.status(401);
        res.body.should.have.property('error').eql('Anauthorized,please login first');
        done();
      });
  });

  //eslint-disable-next-line no-undef
  it('Should verify invalid token',(done)=>{
    const {id:normal_user_id}=user_normal;

    const wrongToken='ciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoicHJvZG8iLCJsYXN0TmFtZSI6Imtha2EiLCJlbWFpbCI6InBAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkVFcyYmxUWnYzZ1FiNldNRXJZSmtULi5YSUhrendnZW5GWm1NTVlXVjZwaFRFd1dGUjhqbk8iLCJhZGRyZXNzIjoiYWRkcmVzcyIsImJpbyI6ImJpbyIsIm9jY3VwYXRpb24iOiJvY2N1cCIsImV4cGVydGlzZSI6ImV4cHJ0IiwidHlwZSI6Im5vcm1hbCIsImlhdCI6MTU2NjQ2NjQyNiwiZXhwIjoxNTY2ODEyMDI2fQ.hBkHlelgfCp1qnRVhgvCPFcm16camwv0mZNxFGhHkmw';


    request(server).patch(`/api/v1/mentor/${normal_user_id}`)
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
    request(server).patch(`/api/v1/mentor/${normal_user_id}`)
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
  it('Should return an access forbiden if the user who changes is not an admin or does not have email:p@gmail.com',(done)=>{
    const {id:normal_user_id}=user_normal;
    const {token:user_noAdmin_token}=notAdmin_user;
    request(server).patch(`/api/v1/mentor/${normal_user_id}`)
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
  it('Should return status:400 if the id of the mentor to be changed was not found',(done)=>{
    const wrongId=450;
    const {token:user_admin_token}=user_admin1;
    request(server).patch(`/api/v1/mentor/${wrongId}`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_admin_token)
      .end((err,res)=>{
         
        res.should.have.status(400);
        res.body.error.should.be.a('string').eql('Mentor not found');
        done();
      });
  });



});