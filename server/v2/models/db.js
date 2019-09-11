import pg, { Pool } from 'pg';
import config from '../config/config';

let connection = config.dbConfig;
const { NODE_ENV, DATABASE_URL } = process.env;

if (NODE_ENV === 'production') {
  connection = { connectionString: DATABASE_URL };
}

const db = new Pool(connection);


export default db;
