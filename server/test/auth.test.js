/* eslint-disable no-undef */
import { should,use,request } from 'chai';
import chaiHttp from 'chai-http';
import server from '../bin/www';



should();
use(chaiHttp);


describe('AuthController',()=>{

  
  

  const defaultUser={
    firstName:'dany',
    lastName:'umela',
    email:'d1@gmail.com',
    password:'12345678',
    bio:'his bio',
    expertise:'web development',
    occupation:'software developer',
    address:'kigali',
  };
 
  
  it(('Should signup a user'), (done) => {


    request(server).post('/api/v1/auth/signup')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(defaultUser)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.data.should.be.an('object');
        res.body.data.should.have.property('token');
        res.body.should.have.property('message').eql('User created successfully');
        done();
      });
  });


  
  it('Should remove unexpected input data before storing them then return status code 201',(done)=>{

    const input_over_load={
      ...defaultUser,
      ...{
        email:'another_email@gmail.com',
        unexpected1:'unexpected1',
        unexpected2:'unexpected2',   
      }
    };
    request(server).post('/api/v1/auth/signup')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(input_over_load)
      .end((err, res) => {
       
        res.should.have.status(201);
        done();
      });
  });
  

  
  it(('Should return an object with status 400 when a user signs up without required credentials'), (done) => {
    const defaultUser={
      firstName:'prodo',
      lastName:'kaka',
      email:'pgmail.com',
      password:'12345678',
      bio:'his bio',
      address:'kigali',
    };
    
    request(server).post('/api/v1/auth/signup')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(defaultUser)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.message.should.be.a('string').eql('Invalid input value');
        res.body.error.should.be.an('object');
        res.body.message.should.be.a('string').eql('Invalid input value');
        done();
      });
  });

 
  
  it(('Should login a user and return an object with user token'), (done) => {
    const existingUser = {
      email: 'd1@gmail.com',
      password: '12345678'
    };
    
    request(server).post('/api/v1/auth/signin')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(existingUser)
      .end((err, res) => {
        
        res.should.have.status(200);
        res.body.data.should.be.an('object');
        res.body.data.should.have.property('token');
        res.body.message.should.be.a('string').eql('User is successfully logged in');
        done();
      });
  });

  
  it(('Should return an error with status 401 for a user login with wrong email'), (done) => {
    const user_with_WrongEmail = {
      email: 'ko45o@gmail.com',
      password: '12345678'
    };
    
    request(server).post('/api/v1/auth/signin')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(user_with_WrongEmail)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property('error');
        res.body.error.should.be.a('string').eql('Invalid Email');
        done();
      });
  });

  
  it(('Should return an error with status 401 for a user login with wrong password'), (done) => {
    const user_with_WrongEmail = {
      email: 'd1@gmail.com',
      password: '45678'
    };
    
    request(server).post('/api/v1/auth/signin')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(user_with_WrongEmail)
      .end((err, res) => {
       
        res.should.have.status(401);
        res.body.should.have.property('error');
        res.body.error.should.be.a('string').eql('Invalid Password');
        done();
      });
  });


});