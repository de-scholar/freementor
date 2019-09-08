import pg, { Pool } from 'pg';
import config from '../config/config';

const db = new Pool(config.dbConfig);

export default db;
