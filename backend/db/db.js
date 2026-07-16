import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

//mysql://root:oaFExlipBexBLdhFiPGCUtVDwChWhyvj@tokaido.proxy.rlwy.net:23109/team1_db
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'tokaido.proxy.rlwy.net',
  user: process.env.DB_USER || 'root',
  port: process.env.DB_PORT || '23109',
  password: process.env.DB_PASSWORD || 'oaFExlipBexBLdhFiPGCUtVDwChWhyvj',
  database: process.env.DB_NAME || 'team1_db',
  timezone: '+02:00',
  dateStrings: true
});

pool.query('SELECT 1')
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Database connection failed:', err.message));

export default pool;
