const { Pool } = require('pg');

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
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
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
        const client = await pool.connect();
        const result = await client.query(query, values);
        console.log('Insert success:', result.rows[0]); // 檢查插入結果
        res.status(200).json({ status: 200, data: result.rows[0] });
    } catch (err) {
        console.error('資料庫插入失敗:', err);
        res.status(500).json({ status: 500, message: '資料庫插入錯誤' });
    } finally {
        if (client) client.release();
    }
};


module.exports = { handleActivitySubmission };
