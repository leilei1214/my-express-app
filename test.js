const { Pool } = require('pg');

// 配置 PostgreSQL 连接
const pool = new Pool({
  user: 'uaeb82e6is2sus',
  host: 'ec2-35-169-98-228.compute-1.amazonaws.com',
  database: 'd2vk99krc82blt',
  password: 'p2309a9479355793bfada794ca6d8c67fbd6aeb6e8f3dbbacdaae6182c0e70a88',
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function fetchUsers() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM public.users ORDER BY userid ASC');
    console.log('Fetched users:', result.rows);  // result.rows 包含查询结果
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    client.release();
  }
}

fetchUsers();
