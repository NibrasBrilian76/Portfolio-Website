const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "modern-web"
});

db.connect((err) => {
    if(err){
        console.log("Koneksi gagal:", err);
        return;
    }
    console.log("Database connect 🔥");
});

const queries = [
    `CREATE TABLE IF NOT EXISTS portfolios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        bio TEXT,
        theme_color VARCHAR(20) DEFAULT '#3b82f6'
    )`,
    `CREATE TABLE IF NOT EXISTS skills (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        skill_name VARCHAR(100) NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        project_name VARCHAR(200) NOT NULL,
        project_desc TEXT,
        project_image LONGTEXT
    )`,
    `CREATE TABLE IF NOT EXISTS social_links (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        social_name VARCHAR(100) NOT NULL,
        social_link VARCHAR(500) NOT NULL
    )`
];

queries.forEach((sql, i) => {
    db.query(sql, (err) => {
        if(err){
            console.log(`Query ${i+1} gagal:`, err);
        } else {
            console.log(`Tabel ${i+1} berhasil dibuat ✅`);
        }
    });
});