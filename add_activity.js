// const { Pool } = require('pg');

// const pool = new Pool({
//     user: 'neondb_owner',
//     host: 'ep-damp-rain-a85ghmem-pooler.eastus2.azure.neon.tech',
//     database: 'neondb',
//     password: 'npg_BORmjcDE8l1P',
//     port: 5432,
//     ssl: {
//         rejectUnauthorized: false,
//     },
// });
const mysql = require('mysql2');
const util = require('util');
const pool = mysql.createPool({
  host: 'dzl.9a1.mytemp.website', // 通常 GoDaddy 提供的，不是 localhost
  user: 'football',
  password: '@Aa0918625729',
  database: 'football'
});
const MS_query = util.promisify(pool.query).bind(pool);

const formatArrayForPostgres = (arr) => `{${arr.join(',')}}`;  

const handleActivitySubmission = async (req, res) => {
    const eventData = req.body;
    console.log('Event Data:', eventData);

  

    let client;
    const query = `
    INSERT INTO activities (
        activity_level, 
        time, 
        activity_notice, 
        activity_intro, 
        max_participants, 
        phone, 
        amount, 
        location
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    RETURNING *;
    `;

    const values = [
        formatArrayForPostgres(eventData.activity_level), // 轉換成 '{新手,復健}'
        eventData.date || null,
        eventData.activity_notice || null,
        eventData.activity_intro || null,
        eventData.max_participants || null,
        eventData.phone || null,
        eventData.amount || null,
        eventData.address || null
    ];

    try {
        // const client = await pool.connect();
        const result = await MS_query(query, values);
        console.log('Insert success:', result[0]); // 檢查插入結果
        res.status(200).json({ status: 200, data: result.rows[0] });
        // res.status(200).json({ status: 200 });

    } catch (err) {
        console.error('資料庫插入失敗:', err);
        res.status(500).json({ status: 500, message: '資料庫插入錯誤' });
    } 
};


module.exports = { handleActivitySubmission };
