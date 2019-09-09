import dotenv from 'dotenv';

dotenv.config();
const {
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
} = process.env;

const { NODE_ENV }=process.env;

export default {
  dbConfig: {
    user: DB_USERNAME,
    host: DB_HOST,
    database: NODE_ENV==="test"?"test_freementors":DB_NAME,
    password: DB_PASSWORD,
    port: DB_PORT,
  },
  
};
