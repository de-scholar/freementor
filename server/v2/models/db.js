import pg, { Pool } from 'pg';
import config from '../config/config';


const { NODE_ENV, DATABASE_URL } = process.env;
const production_url = { connectionString: DATABASE_URL };
let connection = NODE_ENV === 'production'? production_url :config.dbConfig;

const db = new Pool(connection);


export default db;
