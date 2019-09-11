
import { should, use, request } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../index';
import data from './mockData';

const { other_token: { wrong_token }, reviews, sessions } = data;

should();
use(chaiHttp);

let {
  user2, // admin
  user3, // mentor
  user1, // normal user

} = data.users;

let user_mentee;
let user_mentor;
let created_session;
let user_admin;


describe('ReviewController /POST review', ()=> {
  before((done)=> {
    request(server).post('/api/v2/auth/signin')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(user1)
      .then((res)=> {
        user_mentee = { ...user1, ...res.body.data };
        created_session = sessions.data(user3.id);
      });

    request(server).post('/api/v2/auth/signin')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(user3)
      .then((res)=> {
        user_mentor = { ...user3, ...res.body.data };
      });
    request(server).post('/api/v2/auth/signin')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(user2)
      .then((res)=> {
        user_admin = { ...user2, ...res.body.data };

        done();
      });
  });


  it('Should create a mentorship session review', (done)=> {
    request(server).post(`/api/v2/sessions/${created_session.id}/review`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_mentee.token)
      .send(reviews.score_info)
      .end((err, res)=> {
        res.should.have.status(200);
        res.body.should.have.property('message').eql('Review successfully created');
        res.body.data.should.have.property('menteeFullName');
        done();
      });
  });

  it('Should return a status code 400 when when input data are invalid', (done)=> {
    request(server).post(`/api/v2/sessions/${created_session.id}/review`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_mentee.token)
      .send(reviews.wrong_score_info)
      .end((err, res)=> {
        res.should.have.status(400);
        res.body.should.have.property('message').eql('Invalid input value');
        res.body.error.should.be.an('object');
        done();
      });
  });


  it('Should return code status 400 when mentee want to create more than one review', (done)=> {
    request(server).post(`/api/v2/sessions/${created_session.id}/review`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_mentee.token)
      .send(reviews.score_info)
      .end((err, res)=> {
        res.should.have.status(400);
        res.should.have.status(400);
        res.body.should.have.property('error').eql('Session has another review');
        done();
      });
  });


  it('Should return status code 400 when the corresponding session info of the sent sessionId was not found', (done)=> {
    request(server).post('/api/v2/sessions/10000/review')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_mentee.token)
      .send(reviews.score_info)
      .end((err, res)=> {
        res.should.have.status(400);
        res.body.should.have.property('error').eql('Session to review is not found');

        done();
      });
  });


  it('Should return status 401 if the token has been not sent', (done)=> {
    request(server).post(`/api/v2/sessions/${created_session.id}/review`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .end((err, res)=> {
        res.should.have.status(401);
        res.body.should.have.property('error').eql('Anauthorized,please login first');
        done();
      });
  });


  it('Should verify invalid token', (done)=> {
    request(server).post(`/api/v2/sessions/${created_session.id}/review`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', wrong_token)
      .end((err, res)=> {
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('invalid token');
        done();
      });
  });


  it('Should verify malformed token', (done)=> {
    request(server).post(`/api/v2/sessions/${created_session.id}/review`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', 'badToken')
      .end((err, res)=> {
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('jwt malformed');
        done();
      });
  });
});


describe('ReviewController /DELETE review', ()=> {
  it('Should return a code status 200 when an admin delete a session review', (done)=> {
    request(server).delete(`/api/v2/sessions/${created_session.id}/review`)

      .set('token', user_admin.token)
      .end((err, res)=> {
        res.should.have.status(200);
        res.body.should.have.property('message').eql('Review successfully deleted');

        done();
      });
  });


  it('Should return status code 403 when the auth user is not an admin', (done)=> {
    request(server).delete(`/api/v2/sessions/${created_session.id}/review`)

      .set('token', user_mentee.token)
      .end((err, res)=> {
        res.should.have.status(403);
        res.body.should.have.property('error').eql('Access forbiden,reserved for admin');

        done();
      });
  });


  it('Should return status code 400 when the mentorship session does not have a review', (done)=> {
    request(server).delete('/api/v2/sessions/100000/review')

      .set('token', user_admin.token)
      .end((err, res)=> {
        res.should.have.status(400);
        res.body.should.have.property('error').eql('Review of the session not found');

        done();
      });
  });


  it('Should return status 401 if the token has been not sent', (done)=> {
    request(server).delete(`/api/v2/sessions/${created_session.id}/review`)

      .end((err, res)=> {
        res.should.have.status(401);
        res.body.error.should.be.a('string').eql('Anauthorized,please login first');
        done();
      });
  });


  it('Should verify invalid token', (done)=> {
    request(server).delete(`/api/v2/sessions/${created_session.id}/review`)

      .set('token', wrong_token)
      .end((err, res)=> {
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('invalid token');
        done();
      });
  });


  it('Should verify malformed token', (done)=> {
    request(server).delete(`/api/v2/sessions/${created_session.id}/review`)

      .set('token', 'badToken')
      .end((err, res)=> {
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('jwt malformed');
        done();
      });
  });
});
