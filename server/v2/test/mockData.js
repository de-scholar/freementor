export default {

  users: {
    user1: {
      id: 1,
      firstname: 'user1',
      lastname: 'kaka',
      email: 'user1@gmail.com',
      password: 'Aa@12345',
      bio: 'his bio',
      expertise: 'web development',
      occupation: 'software developer',
      address: 'kigali',
    },
    user2: {
      id: 2,
      firstname: 'user2',
      lastname: 'bro',
      email: 'user2@gmail.com',
      password: 'Aa@12345',
      bio: 'his bio',
      expertise: 'web development',
      occupation: 'software developer',
      address: 'kigali',
      unexpected1: 'unexpected1',
      unexpected2: 'unexpected2',
    },
    user3: {
      id: 3,
      firstname: 'user3',
      lastname: 'amakuru',
      email: 'user3@gmail.com',
      password: 'Aa@12345',
      bio: 'his bio',
      expertise: 'web development',
      occupation: 'software developer',
      address: 'kigali',
    },
    user4: {
      id: 4,
      firstname: 'user4',
      lastname: 'amakuru',
      email: 'user4@gmail.com',
      password: 'Aa@12345',
      bio: 'his bio',
      expertise: 'web development',
      occupation: 'software developer',
      address: 'kigali',
    },
    user5: {
      id: 5,
      firstname: 'user5',
      lastname: 'doctor',
      email: 'user5@gmail.com',
      password: 'Aa@12345',
      bio: 'his bio',
      expertise: 'web development',
      occupation: 'software developer',
      address: 'kigali',
    },
    wrong_user_info: {
      firstname: 'werongUser',
      lastname: 'doctor',
      email: 'wrong@gmail.com',
      password: '12345678',
      bio: 'his bio',
      expertise: 'web development',
      occupation: 'software developer',
      address: 'kigali',
    },
    wrong_login_email: {
      email: 'ko45o@gmail.com',
      password: '12345678',
    },
    wrong_login_password: {
      email: 'd1@gmail.com',
      password: '45678',
    },
  },
  review_auth: {

    score_info: {
      score: 3,
      remark: 'Every thing was good, but and then ,so i conclude',
    },
    wrong_score_info: {
      score: 36,
      remark: 'Every thing was good, but and then ,so i conclude',

    },
  },
  other_token: {
    wrong_token: 'ciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoicHJvZG8iLCJsYXN0TmFtZSI6Imtha2EiLCJlbWFpbCI6InBAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkVFcyYmxUWnYzZ1FiNldNRXJZSmtULi5YSUhrendnZW5GWm1NTVlXVjZwaFRFd1dGUjhqbk8iLCJhZGRyZXNzIjoiYWRkcmVzcyIsImJpbyI6ImJpbyIsIm9jY3VwYXRpb24iOiJvY2N1cCIsImV4cGVydGlzZSI6ImV4cHJ0IiwidHlwZSI6Im5vcm1hbCIsImlhdCI6MTU2NjQ2NjQyNiwiZXhwIjoxNTY2ODEyMDI2fQ.hBkHlelgfCp1qnRVhgvCPFcm16camwv0mZNxFGhHkmw',
  },
  sessions: {
    data:(mentor_id)=>{
      return {
        questions: 'questions here',
        mentor_id,
        start_date: '12/12/2019',
        end_date: '20/03/2020',
      };
    },
    invalid_datadata:(mentor_id)=>{
      return {
        question: 'questions here',
        mentor_id,
        start_date: '12/12/2019',
        end_date: '20/03/2020',
      };
    },
    reject_session: (mentor_id)=> {
      return {
        questions: 'questions2 here',
        mentor_id,
        start_date: '12/12/2019',
        end_date: '20/03/2020',
      };
    }
  }


};
