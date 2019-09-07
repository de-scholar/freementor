
import { should, use, request } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../index';
import data from './data';


should();
use(chaiHttp);


let user_mentee;
let user_mentor;
let created_session;
let user_admin;


describe('Review ,init dependencies', ()=> {
  before((done)=> {
    request(server).post('/api/v1/auth/signup')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(data.review_auth.user1)
      .then((res)=> {
        user_mentee = res.body.data;
      });

    request(server).post('/api/v1/auth/signup')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(data.review_auth.user2)
      .then((res)=> {
        user_mentor = res.body.data;
      });
    request(server).post('/api/v1/auth/signup')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(data.review_auth.user3)
      .then((res)=> {
        user_admin = res.body.data;

        done();
      });
  });


  it('Should change a normal user to admin ', (done)=> {
    const { id: normal_user_id, token: user_admin_token } = user_admin;

    request(server).patch(`/api/v1/admin/${normal_user_id}`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_admin_token)
      .end((err, res)=> {
        Object.assign(user_admin, res.body.data);
        res.should.have.status(200);
        res.body.data.should.have.property('role').eql('admin');
        res.body.should.have.property('message').eql('Account changed to admin');
        done();
      });
  });


  it(('login the new admin user to update his payload in jwt'), (done)=> {
    const user_admin_credential = {
      email: user_admin.email,
      password: '12345678',
    };

    request(server).post('/api/v1/auth/signin')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(user_admin_credential)
      .end((err, res)=> {
        Object.assign(user_admin, res.body.data);
        res.should.have.status(200);
        res.body.message.should.be.a('string').eql('User is successfully logged in');

        done();
      });
  });


  it('change normal user to mentor first', (done)=> {
    const { id: normal_user_id } = user_mentor;
    const { token: user_admin_token } = user_admin;

    request(server).patch(`/api/v1/user/${normal_user_id}`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_admin_token)
      .then((res)=> {
        Object.assign(user_mentor, res.body.data);
        res.should.have.status(200);
        res.body.data.type.should.be.eql('mentor');
        done();
      });
  });


  it('create a mentorship session first', (done)=> {
    const { id: mentorId } = user_mentor;
    const { token: mentee_token } = user_mentee;
    const defaultSession = {
      questions: 'questions here',
      mentorId,
      start_date: '12/12/2019',
      end_date: '20/03/2020',

    };

    request(server).post('/api/v1/sessions')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', mentee_token)
      .send(defaultSession)
      .then((res)=> {
        created_session = res.body.data;

        res.should.have.status(200);
        res.body.data.should.be.an('object');
        done();
      });
  });
});


describe('ReviewController /POST review', ()=> {
  it('Should create a mentorship session review', (done)=> {
    const { id: sessionId } = created_session;
    const { token: mentee_token } = user_mentee;
    const defaultReview = data.review_auth.score_info;

    request(server).post(`/api/v1/sessions/${sessionId}/review`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', mentee_token)
      .send(defaultReview)
      .end((err, res)=> {
        res.should.have.status(200);
        res.body.should.have.property('message').eql('Review successfully created');
        res.body.data.should.have.property('menteeFullName');
        done();
      });
  });

  it('Should return a status code 400 when the score is not between 0 and 5', (done)=> {
    const { id: sessionId } = created_session;
    const { token: mentee_token } = user_mentee;
    const defaultReview = data.review_auth.wrong_score_info;

    request(server).post(`/api/v1/sessions/${sessionId}/review`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', mentee_token)
      .send(defaultReview)
      .end((err, res)=> {
        res.should.have.status(400);
        res.body.should.have.property('message').eql('Invalid input value');
        res.body.error.should.be.an('object');
        done();
      });
  });


  it('Should return code status 400 when mentee want to create more than one review', (done)=> {
    const { id: sessionId } = created_session;
    const { token: mentee_token } = user_mentee;
    const defaultReview = data.review_auth.score_info;

    request(server).post(`/api/v1/sessions/${sessionId}/review`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', mentee_token)
      .send(defaultReview)
      .end((err, res)=> {
        res.should.have.status(400);
        res.should.have.status(400);
        res.body.should.have.property('error').eql('Session has another review');
        done();
      });
  });


  it('Should return status code 400 when input data are invalid', (done)=> {
    const { id: sessionId } = created_session;
    const { token: mentee_token } = user_mentee;
    const defaultReview = {
      score: 3,
      remark: '',

    };

    request(server).post(`/api/v1/sessions/${sessionId}/review`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', mentee_token)
      .send(defaultReview)
      .end((err, res)=> {
        res.should.have.status(400);
        res.body.should.have.property('message').eql('Invalid input value');
        res.body.error.should.be.a('object');
        done();
      });
  });


  it('Should return status code 400 when the corresponding session info of the sent sessionId was not found', (done)=> {
    const wrongSessionId = 10000;
    const { token: mentee_token } = user_mentee;
    const defaultReview = {
      score: 3,
      remark: 'ndksd dsflkdsflkdsj ndsklfklsd',

    };

    request(server).post(`/api/v1/sessions/${wrongSessionId}/review`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', mentee_token)
      .send(defaultReview)
      .end((err, res)=> {
        res.should.have.status(400);
        res.body.should.have.property('error').eql('Session to review is not found');

        done();
      });
  });


  it('Should return status 401 if the token has been not sent', (done)=> {
    const { id: sessionId } = created_session;

    request(server).post(`/api/v1/sessions/${sessionId}/review`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .end((err, res)=> {
        res.should.have.status(401);
        res.body.should.have.property('error').eql('Anauthorized,please login first');
        done();
      });
  });


  it('Should verify invalid token', (done)=> {
    const wrongToken = 'ciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoicHJvZG8iLCJsYXN0TmFtZSI6Imtha2EiLCJlbWFpbCI6InBAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkVFcyYmxUWnYzZ1FiNldNRXJZSmtULi5YSUhrendnZW5GWm1NTVlXVjZwaFRFd1dGUjhqbk8iLCJhZGRyZXNzIjoiYWRkcmVzcyIsImJpbyI6ImJpbyIsIm9jY3VwYXRpb24iOiJvY2N1cCIsImV4cGVydGlzZSI6ImV4cHJ0IiwidHlwZSI6Im5vcm1hbCIsImlhdCI6MTU2NjQ2NjQyNiwiZXhwIjoxNTY2ODEyMDI2fQ.hBkHlelgfCp1qnRVhgvCPFcm16camwv0mZNxFGhHkmw';
    const { id: sessionId } = created_session;

    request(server).post(`/api/v1/sessions/${sessionId}/review`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', wrongToken)
      .end((err, res)=> {
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('invalid token');
        done();
      });
  });


  it('Should verify malformed token', (done)=> {
    const malformed_token = 'badToken';
    const { id: sessionId } = created_session;

    request(server).post(`/api/v1/sessions/${sessionId}/review`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', malformed_token)
      .end((err, res)=> {
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('jwt malformed');
        done();
      });
  });
});


describe('ReviewController /DELETE review', ()=> {
  it('Should return a code status 200 when an admin delete a session review', (done)=> {
    const { id: sessionId } = created_session;
    const { token: admin_token } = user_admin;


    request(server).delete(`/api/v1/sessions/${sessionId}/review`)
      .set('Content-type', 'application/json')
      .set('token', admin_token)
      .end((err, res)=> {
        res.should.have.status(200);
        res.body.should.have.property('message').eql('Review successfully deleted');

        done();
      });
  });


  it('Should return status code 403 when the auth user is not an admin', (done)=> {
    const wrongSessionId = 10000;
    const { token: mentee_token } = user_mentee;

    request(server).delete(`/api/v1/sessions/${wrongSessionId}/review`)
      .set('Content-type', 'application/json')
      .set('token', mentee_token)
      .end((err, res)=> {
        res.should.have.status(403);
        res.body.should.have.property('error').eql('Access forbiden,reserved for admin');

        done();
      });
  });


  it('Should return status code 400 when the mentorship session does not have a review', (done)=> {
    const wrongSessionId = 10000;
    const { token: admin_token } = user_admin;

    request(server).delete(`/api/v1/sessions/${wrongSessionId}/review`)
      .set('Content-type', 'application/json')
      .set('token', admin_token)
      .end((err, res)=> {
        res.should.have.status(400);
        res.body.should.have.property('error').eql('Review of the session not found');

        done();
      });
  });


  it('Should return status 401 if the token has been not sent', (done)=> {
    const { id: sessionId } = created_session;

    request(server).delete(`/api/v1/sessions/${sessionId}/review`)
      .set('Content-type', 'application/json')
      .end((err, res)=> {
        res.should.have.status(401);
        res.body.error.should.be.a('string').eql('Anauthorized,please login first');
        done();
      });
  });


  it('Should verify invalid token', (done)=> {
    const wrongToken = 'ciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoicHJvZG8iLCJsYXN0TmFtZSI6Imtha2EiLCJlbWFpbCI6InBAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkVFcyYmxUWnYzZ1FiNldNRXJZSmtULi5YSUhrendnZW5GWm1NTVlXVjZwaFRFd1dGUjhqbk8iLCJhZGRyZXNzIjoiYWRkcmVzcyIsImJpbyI6ImJpbyIsIm9jY3VwYXRpb24iOiJvY2N1cCIsImV4cGVydGlzZSI6ImV4cHJ0IiwidHlwZSI6Im5vcm1hbCIsImlhdCI6MTU2NjQ2NjQyNiwiZXhwIjoxNTY2ODEyMDI2fQ.hBkHlelgfCp1qnRVhgvCPFcm16camwv0mZNxFGhHkmw';
    const { id: sessionId } = created_session;

    request(server).delete(`/api/v1/sessions/${sessionId}/review`)
      .set('Content-type', 'application/json')
      .set('token', wrongToken)
      .end((err, res)=> {
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('invalid token');
        done();
      });
  });


  it('Should verify malformed token', (done)=> {
    const malformed_token = 'badToken';
    const { id: sessionId } = created_session;

    request(server).delete(`/api/v1/sessions/${sessionId}/review`)
      .set('Content-type', 'application/json')
      .set('token', malformed_token)
      .end((err, res)=> {
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('jwt malformed');
        done();
      });
  });
});
