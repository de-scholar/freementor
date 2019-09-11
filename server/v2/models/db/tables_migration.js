import db from '../db';

const usersTable = `
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(254) NOT NULL,
    firstname VARCHAR(20) NOT NULL,
    lastname VARCHAR(20) NOT NULL,
    address VARCHAR(100) DEFAULT NULL,
    bio TEXT DEFAULT NULL,
    occupation VARCHAR(250) DEFAULT NULL,
    expertise VARCHAR(250) DEFAULT NULL,
    is_admin BOOLEAN DEFAULT false,
    type VARCHAR(250) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at DATE DEFAULT NOW()
);
`;

const sessionsTable = `
DROP TABLE IF EXISTS sessions CASCADE;
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    mentor_id INTEGER NOT NULL,
    mentee_id INTEGER NOT NULL,
    questions TEXT NOT NULL,
    date  VARCHAR(250) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at DATE DEFAULT NOW()
);
`;

const reviewsTable = `
DROP TABLE IF EXISTS reviews CASCADE;
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    remark TEXT NOT NULL,
    created_at DATE DEFAULT NOW()
);
`;


const query_create_table =
 `
  ${usersTable}
  ${sessionsTable}
  ${reviewsTable}
`;

const migrate_tables= async (isDone)=>{
  try {
    console.log('Start Generating');
    await db.query(query_create_table);
    if(isDone){isDone()}

    console.log('Tables well generated');
    process.exit(0);
    return;
  } catch (error) {
    
        console.log('======??????  ERROR OCCURED ????=========');
        console.log(error);
        console.log('======??????  ERROR ????=========');
   
  }
}

export default migrate_tables;



