import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const db = new Database("nextlevel.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'client', -- 'admin', 'employee', 'client'
    name TEXT,
    status TEXT DEFAULT 'active', -- 'active', 'busy', 'offline'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    assigned_to INTEGER, -- employee_id
    service_id TEXT,
    package_name TEXT,
    price_usd REAL,
    price_htg REAL,
    options TEXT, -- JSON
    brief TEXT, -- JSON
    status TEXT DEFAULT 'pending_validation', -- 'pending_validation', 'paid', 'production', 'completed'
    payment_status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'refused'
    payment_method TEXT,
    payment_id TEXT,
    payment_proof TEXT,
    delivery_files TEXT, -- JSON array of file objects
    feedback TEXT, -- JSON { rating, comment }
    priority TEXT DEFAULT 'normal', -- 'normal', 'urgent'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(assigned_to) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    sender_id INTEGER,
    content TEXT,
    type TEXT DEFAULT 'text', -- 'text', 'file'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(sender_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

// Seed some employees if none exist
const employees = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'employee'").get() as any;
if (employees.count === 0) {
  db.prepare("INSERT INTO users (email, password, role, name) VALUES (?, ?, ?, ?)").run('staff1@nextlevel.ht', 'staff123', 'employee', 'Jean Designer');
  db.prepare("INSERT INTO users (email, password, role, name) VALUES (?, ?, ?, ?)").run('staff2@nextlevel.ht', 'staff123', 'employee', 'Marie Video');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // Helper for audit logs
  const logAction = (userId: number, action: string, details: string) => {
    db.prepare("INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)").run(userId, action, details);
  };

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Auth
  app.post("/api/auth/register", (req, res) => {
    const { email, password, name } = req.body;
    try {
      const result = db.prepare("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)").run(email, password, name, 'client');
      const user = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid) as any;
      const { password: _, ...userWithoutPassword } = user;
      logAction(user.id, 'REGISTER', 'New user registered');
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ error: "Email already exists" });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (user && user.password === password) {
      const { password, ...userWithoutPassword } = user;
      logAction(user.id, 'LOGIN', 'User logged in');
      res.json(userWithoutPassword);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Advanced Stats for Admin
  app.get("/api/admin/stats/advanced", (req, res) => {
    const totalRevenue = db.prepare("SELECT SUM(price_usd) as usd, SUM(price_htg) as htg FROM orders WHERE payment_status = 'paid'").get() as any;
    const ordersByStatus = db.prepare("SELECT status, COUNT(*) as count FROM orders GROUP BY status").all();
    const ordersByService = db.prepare("SELECT service_id, COUNT(*) as count, SUM(price_usd) as revenue FROM orders WHERE payment_status = 'paid' GROUP BY service_id").all();
    
    // Revenue over time (last 30 days)
    const revenueOverTime = db.prepare(`
      SELECT date(created_at) as date, SUM(price_usd) as revenue 
      FROM orders 
      WHERE payment_status = 'paid' AND created_at >= date('now', '-30 days')
      GROUP BY date(created_at)
      ORDER BY date(created_at)
    `).all();

    const clientStats = db.prepare(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'client') as total_clients,
        (SELECT COUNT(*) FROM (SELECT user_id FROM orders GROUP BY user_id HAVING COUNT(*) > 1)) as recurring_clients
    `).get() as any;

    res.json({
      summary: {
        totalRevenue,
        totalOrders: db.prepare("SELECT COUNT(*) as count FROM orders").get() as any,
        newClients: db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'client' AND created_at >= date('now', '-30 days')").get() as any,
      },
      ordersByStatus,
      ordersByService,
      revenueOverTime,
      clientStats
    });
  });

  // Workspace: Employees
  app.get("/api/workspace/employees", (req, res) => {
    const employees = db.prepare("SELECT id, name, email, role, status FROM users WHERE role = 'employee' OR role = 'admin'").all();
    res.json(employees);
  });

  // Orders Management
  app.post("/api/orders", (req, res) => {
    const { user_id, service_id, package_name, price_usd, price_htg, options, brief, payment_method, payment_id, payment_proof, priority } = req.body;
    const result = db.prepare(`
      INSERT INTO orders (user_id, service_id, package_name, price_usd, price_htg, options, brief, payment_method, payment_id, payment_proof, priority)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(user_id, service_id, package_name, price_usd, price_htg, options, brief, payment_method, payment_id, payment_proof, priority || 'normal');
    
    logAction(user_id, 'ORDER_CREATED', `New order #${result.lastInsertRowid} created`);
    res.json({ id: result.lastInsertRowid });
  });

  app.get("/api/orders", (req, res) => {
    const { status, assigned_to } = req.query;
    let query = "SELECT orders.*, u1.name as client_name, u2.name as employee_name FROM orders JOIN users u1 ON orders.user_id = u1.id LEFT JOIN users u2 ON orders.assigned_to = u2.id WHERE 1=1";
    const params: any[] = [];
    
    if (status) {
      query += " AND orders.status = ?";
      params.push(status);
    }
    if (assigned_to) {
      query += " AND orders.assigned_to = ?";
      params.push(assigned_to);
    }
    
    query += " ORDER BY created_at DESC";
    const orders = db.prepare(query).all(...params);
    res.json(orders);
  });

  app.get("/api/orders/user/:id", (req, res) => {
    const orders = db.prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC").all(req.params.id);
    res.json(orders);
  });

  app.patch("/api/orders/:id", (req, res) => {
    const { status, assigned_to, payment_status, priority, delivery_files, feedback } = req.body;
    const updates: string[] = [];
    const params: any[] = [];

    if (status) { updates.push("status = ?"); params.push(status); }
    if (assigned_to) { updates.push("assigned_to = ?"); params.push(assigned_to); }
    if (payment_status) { updates.push("payment_status = ?"); params.push(payment_status); }
    if (priority) { updates.push("priority = ?"); params.push(priority); }
    if (delivery_files) { updates.push("delivery_files = ?"); params.push(JSON.stringify(delivery_files)); }
    if (feedback) { updates.push("feedback = ?"); params.push(JSON.stringify(feedback)); }

    if (updates.length > 0) {
      updates.push("updated_at = CURRENT_TIMESTAMP");
      const query = `UPDATE orders SET ${updates.join(", ")} WHERE id = ?`;
      params.push(req.params.id);
      db.prepare(query).run(...params);
      res.json({ success: true });
    } else {
      res.status(400).json({ error: "No updates provided" });
    }
  });

  // Internal Chat
  app.get("/api/orders/:id/messages", (req, res) => {
    const messages = db.prepare(`
      SELECT messages.*, users.name as sender_name, users.role as sender_role 
      FROM messages 
      JOIN users ON messages.sender_id = users.id 
      WHERE order_id = ? 
      ORDER BY created_at ASC
    `).all(req.params.id);
    res.json(messages);
  });

  app.post("/api/orders/:id/messages", (req, res) => {
    const { sender_id, content, type } = req.body;
    db.prepare("INSERT INTO messages (order_id, sender_id, content, type) VALUES (?, ?, ?, ?)").run(req.params.id, sender_id, content, type || 'text');
    res.json({ success: true });
  });

  // Audit Logs
  app.get("/api/admin/audit-logs", (req, res) => {
    const logs = db.prepare(`
      SELECT audit_logs.*, users.name as user_name 
      FROM audit_logs 
      JOIN users ON audit_logs.user_id = users.id 
      ORDER BY created_at DESC LIMIT 100
    `).all();
    res.json(logs);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve("dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
