const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const sessionStore = new MySQLStore({
    host: "localhost",
    user: "root",
    password: "",
    database: "modern-web"
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(session({
    secret: "rahasiaku123",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }
}));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "modern-web"
});

db.connect((err) => {
    if(err){
        console.log(err);
    } else {
        console.log("Database connect 🔥");
    }
});

function requireLogin(req, res, next){
    if(req.session.user){
        next();
    } else {
        res.redirect("/login.html");
    }
}

// Halaman proteksi
app.get("/dashboard.html", requireLogin, (req, res) => {
    res.sendFile(__dirname + "/public/dashboard.html");
});

app.get("/portfolio.html", requireLogin, (req, res) => {
    res.sendFile(__dirname + "/public/portfolio.html");
});

app.get("/profil.html", requireLogin, (req, res) => {
    res.sendFile(__dirname + "/public/profil.html");
});

app.get("/feed.html", requireLogin, (req, res) => {
    res.sendFile(__dirname + "/public/feed.html");
});

app.use(express.static("public", { index: false }));

// REGISTER
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.query(sql, [username, email, hashedPassword], (err, result) => {
        if(err){
            console.log(err);
            res.send("Register gagal");
        } else {
            res.send("Register berhasil 🔥");
        }
    });
});

// LOGIN
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], async (err, result) => {
        if(err){ res.send("Login gagal"); return; }
        if(result.length === 0){ res.send("Username atau password salah"); return; }
        const user = result[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(passwordMatch){
            req.session.user = { id: user.id, username: user.username, email: user.email };
            res.send("Login berhasil 🔥");
        } else {
            res.send("Username atau password salah");
        }
    });
});

// LOGOUT
app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login.html");
});

// Cek login
app.get("/cek-login", (req, res) => {
    if(req.session.user){
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

// SIMPAN / UPDATE BIO
app.post("/simpan-bio", requireLogin, (req, res) => {
    const { bio, theme_color, theme_gradient } = req.body;
    const user_id = req.session.user.id;
    const color = theme_color || '#3b82f6';
    const gradient = theme_gradient || `linear-gradient(45deg, ${color}, #9333ea)`;
    const sql = "INSERT INTO portfolios (user_id, bio, theme_color, theme_gradient) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE bio = ?, theme_color = ?, theme_gradient = ?";
    db.query(sql, [user_id, bio, color, gradient, bio, color, gradient], (err) => {
        if(err){ console.log(err); res.send("Gagal"); return; }
        res.send("Tersimpan 🔥");
    });
});

// AMBIL DATA PORTFOLIO
app.get("/ambil-portfolio", requireLogin, (req, res) => {
    const user_id = req.session.user.id;

    const data = {};

    db.query("SELECT * FROM portfolios WHERE user_id = ?", [user_id], (err, result) => {
        data.portfolio = result[0] || {};

        db.query("SELECT * FROM skills WHERE user_id = ?", [user_id], (err, result) => {
            data.skills = result;

            db.query("SELECT * FROM projects WHERE user_id = ?", [user_id], (err, result) => {
                data.projects = result;

                db.query("SELECT * FROM social_links WHERE user_id = ?", [user_id], (err, result) => {
                    data.socials = result;
                    res.json(data);
                });
            });
        });
    });
});

// TAMBAH SKILL
app.post("/tambah-skill", requireLogin, (req, res) => {
    const { skill_name } = req.body;
    const user_id = req.session.user.id;
    db.query("INSERT INTO skills (user_id, skill_name) VALUES (?, ?)", [user_id, skill_name], (err) => {
        if(err){ res.send("Gagal"); return; }
        res.send("Skill ditambahkan 🔥");
    });
});

// HAPUS SKILL
app.delete("/hapus-skill/:id", requireLogin, (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM skills WHERE id = ? AND user_id = ?", [id, req.session.user.id], (err) => {
        if(err){ res.send("Gagal"); return; }
        res.send("Skill dihapus");
    });
});

// TAMBAH PROJECT
app.post("/tambah-project", requireLogin, (req, res) => {
    const { project_name, project_desc, project_image } = req.body;
    const user_id = req.session.user.id;
    db.query("INSERT INTO projects (user_id, project_name, project_desc, project_image) VALUES (?, ?, ?, ?)",
        [user_id, project_name, project_desc, project_image], (err) => {
        if(err){ console.log(err); res.send("Gagal"); return; }
        res.send("Project ditambahkan 🔥");
    });
});

// HAPUS PROJECT
app.delete("/hapus-project/:id", requireLogin, (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM projects WHERE id = ? AND user_id = ?", [id, req.session.user.id], (err) => {
        if(err){ res.send("Gagal"); return; }
        res.send("Project dihapus");
    });
});

// TAMBAH SOSIAL
app.post("/tambah-sosial", requireLogin, (req, res) => {
    const { social_name, social_link } = req.body;
    const user_id = req.session.user.id;
    db.query("INSERT INTO social_links (user_id, social_name, social_link) VALUES (?, ?, ?)",
        [user_id, social_name, social_link], (err) => {
        if(err){ res.send("Gagal"); return; }
        res.send("Sosial ditambahkan 🔥");
    });
});

// HAPUS SOSIAL
app.delete("/hapus-sosial/:id", requireLogin, (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM social_links WHERE id = ? AND user_id = ?", [id, req.session.user.id], (err) => {
        if(err){ res.send("Gagal"); return; }
        res.send("Sosial dihapus");
    });
});


// Halaman profil publik
app.get("/user/:username", async (req, res) => {
    const { username } = req.params;

    db.query("SELECT * FROM users WHERE username = ?", [username], (err, result) => {
        if(err || result.length === 0){
            res.send("User tidak ditemukan");
            return;
        }

        const user = result[0];
        const user_id = user.id;

        const data = { username: user.username };

        db.query("SELECT * FROM portfolios WHERE user_id = ?", [user_id], (err, result) => {
            data.portfolio = result[0] || {};

            db.query("SELECT * FROM skills WHERE user_id = ?", [user_id], (err, result) => {
                data.skills = result;

                db.query("SELECT * FROM projects WHERE user_id = ?", [user_id], (err, result) => {
                    data.projects = result;

                    db.query("SELECT * FROM social_links WHERE user_id = ?", [user_id], (err, result) => {
                        data.socials = result;
                        res.json(data);
                    });
                });
            });
        });
    });
});

// Pencarian portofolio
app.get("/cari", (req, res) => {
    const { keyword } = req.query;

    if(!keyword){
        res.json([]);
        return;
    }

    const sql = `
        SELECT DISTINCT users.id, users.username, portfolios.bio
        FROM users
        LEFT JOIN portfolios ON users.id = portfolios.user_id
        LEFT JOIN skills ON users.id = skills.user_id
        WHERE users.username LIKE ?
        OR skills.skill_name LIKE ?
    `;

    const keyword_like = `%${keyword}%`;

    db.query(sql, [keyword_like, keyword_like], (err, result) => {
        if(err){ console.log(err); res.json([]); return; }
        res.json(result);
    });
});

// Simpan foto profil
app.post("/simpan-foto", requireLogin, (req, res) => {
    const { profile_image } = req.body;
    const user_id = req.session.user.id;
    const sql = "INSERT INTO portfolios (user_id, profile_image) VALUES (?, ?) ON DUPLICATE KEY UPDATE profile_image = ?";
    db.query(sql, [user_id, profile_image, profile_image], (err) => {
        if(err){ console.log(err); res.send("Gagal"); return; }
        res.send("Foto tersimpan 🔥");
    });
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/landing.html");
});

// Edit project
app.put("/edit-project/:id", requireLogin, (req, res) => {
    const { id } = req.params;
    const { project_name, project_desc } = req.body;
    db.query(
        "UPDATE projects SET project_name = ?, project_desc = ? WHERE id = ? AND user_id = ?",
        [project_name, project_desc, id, req.session.user.id],
        (err) => {
            if(err){ console.log(err); res.send("Gagal"); return; }
            res.send("Project diupdate 🔥");
        }
    );
});

// Ambil data profil user
app.get("/ambil-profil", requireLogin, (req, res) => {
    const user_id = req.session.user.id;
    db.query("SELECT id, username, email, full_name, phone, location, website, birthdate, tagline FROM users WHERE id = ?", [user_id], (err, result) => {
        if(err){ res.json({}); return; }
        res.json(result[0]);
    });
});

// Update profil user
app.post("/update-profil", requireLogin, async (req, res) => {
    const { username, email, full_name, phone, location, website, birthdate, tagline, password_lama, password_baru } = req.body;
    const user_id = req.session.user.id;

    // Cek apakah username sudah dipakai orang lain
    db.query("SELECT id FROM users WHERE username = ? AND id != ?", [username, user_id], async (err, result) => {
        if(result.length > 0){
            res.send("Username sudah dipakai orang lain!");
            return;
        }

        // Kalau mau ganti password
        if(password_baru && password_baru.trim() !== ""){
            const userResult = await new Promise(resolve => {
                db.query("SELECT password FROM users WHERE id = ?", [user_id], (err, result) => resolve(result));
            });

            const passwordMatch = await bcrypt.compare(password_lama, userResult[0].password);
            if(!passwordMatch){
                res.send("Password lama salah!");
                return;
            }

            const hashedPassword = await bcrypt.hash(password_baru, 10);
            db.query("UPDATE users SET username=?, email=?, full_name=?, phone=?, location=?, website=?, birthdate=?, tagline=?, password=? WHERE id=?",
                [username, email, full_name, phone, location, website, birthdate || null, tagline, hashedPassword, user_id], (err) => {
                if(err){ console.log(err); res.send("Gagal update profil"); return; }
                req.session.user.username = username;
                res.send("Profil berhasil diupdate 🔥");
            });
        } else {
            db.query("UPDATE users SET username=?, email=?, full_name=?, phone=?, location=?, website=?, birthdate=?, tagline=? WHERE id=?",
                [username, email, full_name, phone, location, website, birthdate || null, tagline, user_id], (err) => {
                if(err){ console.log(err); res.send("Gagal update profil"); return; }
                req.session.user.username = username;
                res.send("Profil berhasil diupdate 🔥");
            });
        }
    });
});

// Buat postingan dari project
app.post("/buat-post", requireLogin, (req, res) => {
    const { caption, project_id } = req.body;
    const user_id = req.session.user.id;
    db.query("INSERT INTO posts (user_id, caption, project_id) VALUES (?, ?, ?)",
        [user_id, caption, project_id], (err) => {
            if(err){ console.log(err); res.send("Gagal"); return; }
            res.send("Post berhasil dibuat 🔥");
        });
});

// Ambil project milik user untuk dipilih saat posting
app.get("/project-saya", requireLogin, (req, res) => {
    const user_id = req.session.user.id;
    db.query("SELECT * FROM projects WHERE user_id = ?", [user_id], (err, result) => {
        if(err){ res.json([]); return; }
        res.json(result);
    });
});

app.get("/feed", requireLogin, (req, res) => {
    const user_id = req.session.user.id;
    const sql = `
        SELECT posts.*, users.username, users.tagline,
        portfolios.profile_image as avatar, portfolios.bio,
        projects.project_name, projects.project_desc, projects.project_image,
        (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) as like_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) as comment_count,
        (SELECT COUNT(*) FROM likes WHERE post_id = posts.id AND user_id = ${user_id}) as sudah_like,
        (SELECT COUNT(*) FROM follows WHERE follower_id = ${user_id} AND following_id = posts.user_id) as is_following
        FROM posts
        JOIN users ON posts.user_id = users.id
        LEFT JOIN portfolios ON posts.user_id = portfolios.user_id
        LEFT JOIN projects ON posts.project_id = projects.id
        ORDER BY is_following DESC, posts.created_at DESC
    `;
    db.query(sql, (err, result) => {
        if(err){ console.log(err); res.json([]); return; }

        // Ambil skills tiap user
        const promises = result.map(post => {
            return new Promise(resolve => {
                db.query("SELECT skill_name FROM skills WHERE user_id = ?", [post.user_id], (err, skills) => {
                    post.skills = skills ? skills.map(s => s.skill_name) : [];
                    resolve(post);
                });
            });
        });

        Promise.all(promises).then(posts => res.json(posts));
    });
});

// Like / unlike
app.post("/like/:post_id", requireLogin, (req, res) => {
    const { post_id } = req.params;
    const user_id = req.session.user.id;
    db.query("SELECT * FROM likes WHERE user_id = ? AND post_id = ?", [user_id, post_id], (err, result) => {
        if(result.length > 0){
            db.query("DELETE FROM likes WHERE user_id = ? AND post_id = ?", [user_id, post_id], () => {
                res.json({ liked: false });
            });
        } else {
            db.query("INSERT INTO likes (user_id, post_id) VALUES (?, ?)", [user_id, post_id], () => {
                res.json({ liked: true });
            });
        }
    });
});

// Ambil komentar
app.get("/komentar/:post_id", requireLogin, (req, res) => {
    const { post_id } = req.params;
    db.query(`SELECT comments.*, users.username, portfolios.profile_image as avatar
        FROM comments
        JOIN users ON comments.user_id = users.id
        LEFT JOIN portfolios ON comments.user_id = portfolios.user_id
        WHERE comments.post_id = ?
        ORDER BY comments.created_at ASC`,
        [post_id], (err, result) => {
            if(err){ res.json([]); return; }
            res.json(result);
        });
});

// Tambah komentar
app.post("/komentar/:post_id", requireLogin, (req, res) => {
    const { post_id } = req.params;
    const { comment } = req.body;
    const user_id = req.session.user.id;
    db.query("INSERT INTO comments (user_id, post_id, comment) VALUES (?, ?, ?)",
        [user_id, post_id, comment], (err) => {
            if(err){ res.send("Gagal"); return; }
            res.send("Komentar ditambahkan 🔥");
        });
});

// Follow / unfollow
app.post("/follow/:target_id", requireLogin, (req, res) => {
    const { target_id } = req.params;
    const user_id = req.session.user.id;
    db.query("SELECT * FROM follows WHERE follower_id = ? AND following_id = ?", [user_id, target_id], (err, result) => {
        if(result.length > 0){
            db.query("DELETE FROM follows WHERE follower_id = ? AND following_id = ?", [user_id, target_id], () => {
                res.json({ following: false });
            });
        } else {
            db.query("INSERT INTO follows (follower_id, following_id) VALUES (?, ?)", [user_id, target_id], () => {
                res.json({ following: true });
            });
        }
    });
});

// Hapus postingan
app.delete("/hapus-post/:id", requireLogin, (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM posts WHERE id = ? AND user_id = ?", [id, req.session.user.id], (err) => {
        if(err){ res.send("Gagal"); return; }
        res.send("Post dihapus");
    });
});

app.listen(3000, () => {
    console.log("Server berjalan di http://localhost:3000");
});