import pg, { Pool } from 'pg';
import config from '../config/config';
const { NODE_ENV, DATABASE_URL } = process.env;
let connection = config.dbConfig;

if(NODE_ENV === 'production'){
	const  connection = {connectionString: DATABASE_URL};
}
const db = new Pool(connection);

export default db;
