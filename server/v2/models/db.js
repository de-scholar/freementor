import pg, { Pool } from 'pg';
import config from '../config/config';

let connection = config.dbConfig;

if(NODE_ENV === 'production'){
	const  connection = {connectionString: DATABASE_URL};
}
const db = new Pool(connection);


export default db;
