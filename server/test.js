const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Tducanh263@',
  database: 'lms',
});

async function testConnection() {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    console.log("✅ MySQL Connected, Test Result:", rows);
  } catch (err) {
    console.error("❌ MySQL connection error:", err);
  }
}

testConnection();
