import pg, { Pool } from 'pg';
import config from '../config/config';
const { NODE_ENV, DATABASE_URL } = process.env;
console.log(NODE_ENV, DATABASE_URL);
const db = new Pool(NODE_ENV === 'production'?DATABASE_URL:config.dbConfig);

export default db;
