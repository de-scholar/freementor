
import { should, use, request } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../index';
import data from './mockData';


should();
use(chaiHttp);
let {
  user1,
  user2,
  wrong_user_info,
  wrong_login_email,
  wrong_login_password,
} = data.users;


describe('AuthController', ()=> {
  it(('Should signup a user'), (done)=> {
    request(server).post('/api/v2/auth/signup')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(user1)
      .end((err, res)=> {
        res.should.have.status(201);
        res.body.data.should.be.an('object');
        res.body.data.should.have.property('token');
        res.body.should.have.property('message').eql('User created successfully');
        done();
      });
  });

  it(('Should return a status code 400 when user with email already exist'), (done)=> {
    request(server).post('/api/v2/auth/signup')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(user1)
      .end((err, res)=> {
        res.should.have.status(409);
        res.body.error.should.be.a('string').eql('Email already exist');
        done();
      });
  });


  it('Should remove unexpected input data before storing them then return status code 201', (done)=> {
    request(server).post('/api/v2/auth/signup')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(user2)
      .end((err, res)=> {
        res.should.have.status(201);
        res.body.data.should.be.an('object');
        done();
      });
  });


  it(('Should return an object with status 400 when a user signs up without required credentials'), (done)=> {
    request(server).post('/api/v2/auth/signup')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(wrong_user_info)
      .end((err, res)=> {
        res.should.have.status(400);
        res.body.message.should.be.a('string').eql('Invalid input value');
        res.body.error.should.be.an('object');
        done();
      });
  });


  it(('Should login a user and return an object with user token'), (done)=> {
    request(server).post('/api/v2/auth/signin')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(user1)
      .end((err, res)=> {
        const { token } = res.body.data;

        user1 = { ...user1, token };
        res.should.have.status(200);
        res.body.data.should.be.an('object');
        res.body.data.should.have.property('token');
        done();
      });
  });


  it(('Should return an error with status 401 for a user login with wrong email'), (done)=> {
    request(server).post('/api/v2/auth/signin')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(wrong_login_email)
      .end((err, res)=> {
        res.should.have.status(401);
        res.body.should.have.property('error');
        res.body.error.should.be.a('string').eql('Invalid Credentials');
        done();
      });
  });


  it(('Should return an error with status 401 for a user login with wrong password'), (done)=> {
    request(server).post('/api/v2/auth/signin')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(wrong_login_password)
      .end((err, res)=> {
        res.should.have.status(401);
        res.body.should.have.property('error');
        res.body.error.should.be.a('string').eql('Invalid Credentials');
        done();
      });
  });
});
