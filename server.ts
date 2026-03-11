import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'violet_fitness_secret_key';

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
    is_paid BOOLEAN DEFAULT 0
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

// Seed images
const imgCount = db.prepare('SELECT COUNT(*) as count FROM images').get() as any;
if (imgCount.count === 0) {
  const insertImg = db.prepare('INSERT INTO images (id, section, title, url) VALUES (?, ?, ?, ?)');
  const defaultImages = [
    { id: 'home-hero', section: 'home', title: 'Hero Background', url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop' },
    { id: 'home-gal-1', section: 'home', title: 'Gallery 1', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop' },
    { id: 'home-gal-2', section: 'home', title: 'Gallery 2', url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1470&auto=format&fit=crop' },
    { id: 'home-gal-3', section: 'home', title: 'Gallery 3', url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1470&auto=format&fit=crop' },
    { id: 'home-gal-4', section: 'home', title: 'Gallery 4', url: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=1374&auto=format&fit=crop' },
    { id: 'workout-aerobic', section: 'workouts', title: 'Aerobic', url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1470&auto=format&fit=crop' },
    { id: 'workout-anaerobic', section: 'workouts', title: 'Anaerobic', url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1469&auto=format&fit=crop' },
    { id: 'workout-lite', section: 'workouts', title: 'Lite Apparatus', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop' },
    { id: 'workout-zumba', section: 'workouts', title: 'Zumba', url: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?q=80&w=1470&auto=format&fit=crop' },
    { id: 'workout-own', section: 'workouts', title: 'Own Body Workout', url: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1470&auto=format&fit=crop' },
    { id: 'nutri-weight-loss', section: 'nutrition', title: 'Weight Loss', url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1453&auto=format&fit=crop' },
    { id: 'nutri-weight-gain', section: 'nutrition', title: 'Weight Gain', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1480&auto=format&fit=crop' },
    { id: 'nutri-health', section: 'nutrition', title: 'Health Conscious', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1470&auto=format&fit=crop' },
    { id: 'nutri-wellness', section: 'nutrition', title: 'Wellness & Recovery', url: 'https://images.unsplash.com/photo-1478144592103-25e218a04891?q=80&w=1375&auto=format&fit=crop' }
  ];
  const insertMany = db.transaction((imgs) => {
    for (const img of imgs) insertImg.run(img.id, img.section, img.title, img.url);
  });
  insertMany(defaultImages);
}

// Insert default admin if not exists
const adminExists = db.prepare('SELECT * FROM users WHERE role = ?').get('admin');
if (!adminExists) {
  const hashedAdminPassword = bcrypt.hashSync('admin123', 10);
  db.prepare(`
    INSERT INTO users (name, age, phone, email, password, role, is_paid)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run('Admin', 30, '0000000000', 'admin@violet.com', hashedAdminPassword, 'admin', 1);
}

// Auth Middleware
const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const isAdmin = (req: any, res: any, next: any) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden. Admin access required.' });
  }
  next();
};

// API Routes

app.get('/api/images', (req, res) => {
  const images = db.prepare('SELECT * FROM images').all();
  res.json(images);
});

app.post('/api/auth/register', (req, res) => {
  const { name, age, phone, email, password } = req.body;
  if (!name || !age || !phone || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare(`
      INSERT INTO users (name, age, phone, email, password)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(name, age, phone, email, hashedPassword);
    
    const token = jwt.sign({ id: info.lastInsertRowid, role: 'user' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: info.lastInsertRowid, name, phone, role: 'user' } });
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).json({ error: 'Phone number or email already registered' });
    } else {
      res.status(500).json({ error: 'Database error' });
    }
  }
});

app.post('/api/auth/login', (req, res) => {
  const { identifier, password } = req.body; // identifier can be phone or email
  if (!identifier || !password) {
    return res.status(400).json({ error: 'Identifier and password required' });
  }

  const user: any = db.prepare('SELECT * FROM users WHERE phone = ? OR email = ?').get(identifier, identifier);
  
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, name: user.name, phone: user.phone, role: user.role, is_paid: user.is_paid } });
});

app.get('/api/auth/me', authenticate, (req: any, res) => {
  const user = db.prepare('SELECT id, name, age, phone, email, role, is_paid FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Admin Routes
app.get('/api/admin/users', authenticate, isAdmin, (req, res) => {
  const users = db.prepare('SELECT id, name, age, phone, email, role, is_paid FROM users').all();
  res.json(users);
});

app.put('/api/admin/users/:id/payment', authenticate, isAdmin, (req, res) => {
  const { is_paid } = req.body;
  db.prepare('UPDATE users SET is_paid = ? WHERE id = ?').run(is_paid ? 1 : 0, req.params.id);
  res.json({ success: true });
});

app.put('/api/admin/images/:id', authenticate, isAdmin, (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });
  db.prepare('UPDATE images SET url = ? WHERE id = ?').run(url, req.params.id);
  res.json({ success: true });
});

app.get('/api/admin/export', authenticate, isAdmin, async (req, res) => {
  try {
    const users = db.prepare('SELECT id, name, age, phone, email, role, is_paid FROM users').all();
    
    // Dynamic import for xlsx since it's a commonjs module and we are in ESM context potentially
    const XLSX = await import('xlsx');
    
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Disposition', 'attachment; filename="violet_users.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ error: 'Failed to export users' });
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
