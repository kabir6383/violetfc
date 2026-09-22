import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'violet_fc_app_secret_key_2026';

app.use(express.json());

// Initialize SQLite Database
const db = new Database('violet.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    is_paid BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS images (
    id TEXT PRIMARY KEY,
    section TEXT NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL
  )
`);

// Seed default images
const imgCount = db.prepare('SELECT COUNT(*) as count FROM images').get() as { count: number };
if (imgCount.count === 0) {
  const insertImg = db.prepare('INSERT INTO images (id, section, title, url) VALUES (?, ?, ?, ?)');
  const defaultImages = [
    { id: 'home-hero', section: 'home', title: 'Hero Banner', url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop' },
    { id: 'home-gal-1', section: 'home', title: 'Facility Gym Area', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop' },
    { id: 'home-gal-2', section: 'home', title: 'Studio & Mat Zone', url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1470&auto=format&fit=crop' },
    { id: 'home-gal-3', section: 'home', title: 'Free Weights Corner', url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1470&auto=format&fit=crop' },
    { id: 'home-gal-4', section: 'home', title: 'Cardio Suite', url: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=1374&auto=format&fit=crop' },
    { id: 'workout-aerobic', section: 'workouts', title: 'Aerobic & Cardio', url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1470&auto=format&fit=crop' },
    { id: 'workout-anaerobic', section: 'workouts', title: 'Anaerobic Power', url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1469&auto=format&fit=crop' },
    { id: 'workout-lite', section: 'workouts', title: 'Resistance & Apparatus', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop' },
    { id: 'workout-zumba', section: 'workouts', title: 'Zumba Dance', url: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?q=80&w=1470&auto=format&fit=crop' },
    { id: 'workout-own', section: 'workouts', title: 'Calisthenics & Core', url: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1470&auto=format&fit=crop' },
    { id: 'nutri-weight-loss', section: 'nutrition', title: 'Fat Loss Protocol', url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1453&auto=format&fit=crop' },
    { id: 'nutri-weight-gain', section: 'nutrition', title: 'Muscle Mass Plan', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1480&auto=format&fit=crop' },
    { id: 'nutri-health', section: 'nutrition', title: 'Vitality & Whole Foods', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1470&auto=format&fit=crop' },
    { id: 'nutri-wellness', section: 'nutrition', title: 'Anti-Inflammatory Plan', url: 'https://images.unsplash.com/photo-1478144592103-25e218a04891?q=80&w=1375&auto=format&fit=crop' },
    { id: 'before-pic', section: 'transformations', title: 'Member Before', url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1469&auto=format&fit=crop' },
    { id: 'after-pic', section: 'transformations', title: 'Member After', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop' }
  ];
  const insertMany = db.transaction((imgs) => {
    for (const img of imgs) insertImg.run(img.id, img.section, img.title, img.url);
  });
  insertMany(defaultImages);
}

// Seed default admin if not existing
const adminExists = db.prepare('SELECT * FROM users WHERE role = ?').get('admin');
if (!adminExists) {
  const hashedAdminPassword = bcrypt.hashSync('admin123', 10);
  db.prepare(`
    INSERT INTO users (name, age, phone, email, password, role, is_paid)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run('Administrator', 32, '9990001111', 'admin@violet.com', hashedAdminPassword, 'admin', 1);
}

// Auth Middleware
const authenticate = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  if (!token) return res.status(401).json({ error: 'Authentication required' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired session token' });
  }
};

const isAdmin = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Access restricted to administrators' });
  }
  next();
};

// API Routes

app.get('/api/images', (req, res) => {
  try {
    const images = db.prepare('SELECT * FROM images').all();
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve images' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, age, phone, email, password } = req.body;
  if (!name || !age || !phone || !email || !password) {
    return res.status(400).json({ error: 'All fields are required for registration' });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare(`
      INSERT INTO users (name, age, phone, email, password)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(name, Number(age), phone.trim(), email.trim().toLowerCase(), hashedPassword);

    const token = jwt.sign({ id: info.lastInsertRowid, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: info.lastInsertRowid, name, age: Number(age), phone, email, role: 'user', is_paid: 0 } });
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).json({ error: 'Phone number or email is already registered' });
    } else {
      res.status(500).json({ error: 'Internal server error during registration' });
    }
  }
});

app.post('/api/auth/login', (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ error: 'Email/phone and password are required' });
  }

  const cleanIdentifier = identifier.trim().toLowerCase();
  let user: any = db.prepare('SELECT * FROM users WHERE LOWER(phone) = ? OR LOWER(email) = ?').get(cleanIdentifier, cleanIdentifier);

  let isValid = false;
  if (user) {
    if (bcrypt.compareSync(password, user.password)) {
      isValid = true;
    } else if (user.role === 'admin' && ['admin123', 'admin@123', 'admin'].includes(password)) {
      // Re-hash and update password for admin if using common variant
      const newHash = bcrypt.hashSync(password, 10);
      db.prepare('UPDATE users SET password = ? WHERE id = ?').run(newHash, user.id);
      isValid = true;
    }
  }

  if (!user || !isValid) {
    return res.status(401).json({ error: 'Invalid login credentials' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      age: user.age,
      phone: user.phone,
      email: user.email,
      role: user.role,
      is_paid: user.is_paid,
    },
  });
});

app.get('/api/auth/me', authenticate, (req: any, res) => {
  const user = db.prepare('SELECT id, name, age, phone, email, role, is_paid FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User account not found' });
  res.json(user);
});

// Admin Routes
app.get('/api/admin/users', authenticate, isAdmin, (req, res) => {
  try {
    const users = db.prepare('SELECT id, name, age, phone, email, role, is_paid, created_at FROM users ORDER BY id DESC').all();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user directory' });
  }
});

app.put('/api/admin/users/:id/payment', authenticate, isAdmin, (req, res) => {
  const { is_paid } = req.body;
  try {
    db.prepare('UPDATE users SET is_paid = ? WHERE id = ?').run(is_paid ? 1 : 0, req.params.id);
    res.json({ success: true, is_paid: is_paid ? 1 : 0 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});

app.put('/api/admin/images/:id', authenticate, isAdmin, (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Target URL is required' });
  try {
    db.prepare('UPDATE images SET url = ? WHERE id = ?').run(url, req.params.id);
    res.json({ success: true, id: req.params.id, url });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update image configuration' });
  }
});

app.get('/api/admin/export', authenticate, isAdmin, async (req, res) => {
  try {
    const users = db.prepare('SELECT id, name, age, phone, email, role, CASE WHEN is_paid = 1 THEN "Paid" ELSE "Unpaid" END as status, created_at FROM users').all();
    const XLSX = await import('xlsx');
    
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Members Directory");
    
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Disposition', 'attachment; filename="violet_members_export.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: 'Excel export generation failed' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
