import re
import os

with open("server.js", "r") as f:
    content = f.read()

# 1. Replace SQLite imports and initialization with Mongoose
import_target = """const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_vogue_key_2026';
const PORT = process.env.PORT || 500;
const DB_PATH = path.join(__dirname, 'store.db');"""

import_replacement = """const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_vogue_key_2026';
const PORT = process.env.PORT || 500;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/urban-vogue';"""

content = content.replace(import_target, import_replacement)

# 2. Replace db init and createTables
db_init_target = """// Initialize Database
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        createTables();
    }
});

function createTables() {
    db.serialize(() => {
        // Products Table
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            price INTEGER NOT NULL,
            comparePrice INTEGER,
            category TEXT NOT NULL,
            image TEXT NOT NULL,
            badge TEXT,
            sizes TEXT NOT NULL,
            colors TEXT NOT NULL,
            isNew INTEGER DEFAULT 0,
            isBestSeller INTEGER DEFAULT 0,
            isTrending INTEGER DEFAULT 0,
            stock INTEGER DEFAULT 10,
            rating REAL DEFAULT 4.5,
            reviewsCount INTEGER DEFAULT 0,
            description TEXT NOT NULL,
            specs TEXT NOT NULL,
            benefits TEXT NOT NULL,
            features TEXT NOT NULL
        )`, (err) => {
            if (err) console.error('Error creating products table:', err.message);
            else seedProducts();
        });

        // Orders Table
        db.run(`CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            email TEXT NOT NULL,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            address TEXT NOT NULL,
            city TEXT NOT NULL,
            pincode TEXT NOT NULL,
            paymentMethod TEXT NOT NULL,
            upiId TEXT,
            cardNum TEXT,
            cardExpiry TEXT,
            cardCvv TEXT,
            items TEXT NOT NULL,
            subtotal INTEGER NOT NULL,
            discount INTEGER NOT NULL,
            total INTEGER NOT NULL,
            status TEXT NOT NULL DEFAULT 'Pending',
            createdAt TEXT NOT NULL
        )`, (err) => {
            if (err) console.error('Error creating orders table:', err.message);
        });

        // Contact Messages Table
        db.run(`CREATE TABLE IF NOT EXISTS contact_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            createdAt TEXT NOT NULL
        )`, (err) => {
            if (err) console.error('Error creating contact messages table:', err.message);
        });

        // Newsletter Subscribers Table
        db.run(`CREATE TABLE IF NOT EXISTS newsletter_subscribers (
            email TEXT PRIMARY KEY,
            createdAt TEXT NOT NULL
        )`, (err) => {
            if (err) console.error('Error creating newsletter subscribers table:', err.message);
        });

        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            createdAt TEXT NOT NULL
        )`, (err) => {
            if (err) console.error('Error creating users table:', err.message);
        });
    });
}"""

db_init_replacement = """// Mongoose Models
const productSchema = new mongoose.Schema({
    id: Number,
    name: String,
    price: Number,
    comparePrice: Number,
    category: String,
    image: String,
    badge: String,
    sizes: [String],
    colors: [mongoose.Schema.Types.Mixed],
    isNewProduct: Boolean,
    isBestSeller: Boolean,
    isTrending: Boolean,
    stock: Number,
    rating: Number,
    reviewsCount: Number,
    description: String,
    specs: mongoose.Schema.Types.Mixed,
    benefits: [String],
    features: [String]
});
const Product = mongoose.model('Product', productSchema);

const orderSchema = new mongoose.Schema({
    id: String,
    email: String,
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    pincode: String,
    paymentMethod: String,
    upiId: String,
    cardNum: String,
    cardExpiry: String,
    cardCvv: String,
    items: [mongoose.Schema.Types.Mixed],
    subtotal: Number,
    discount: Number,
    total: Number,
    status: { type: String, default: 'Pending' },
    createdAt: String
});
const Order = mongoose.model('Order', orderSchema);

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    createdAt: String
});
const ContactMessage = mongoose.model('ContactMessage', contactSchema);

const newsletterSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    createdAt: String
});
const NewsletterSubscriber = mongoose.model('NewsletterSubscriber', newsletterSchema);

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    createdAt: String
});
const User = mongoose.model('User', userSchema);

// Initialize Database
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB database.');
        seedProducts();
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err.message);
    });"""

content = content.replace(db_init_target, db_init_replacement)

# 3. Replace seedProducts count check
seed_check_target = """function seedProducts() {
    db.get("SELECT COUNT(*) AS count FROM products", (err, row) => {
        if (err) {
            console.error('Error checking products count:', err.message);
            return;
        }

        if (row.count > 0) {
            console.log('Database already contains products. Seeding skipped.');
            return;
        }

        console.log('Seeding products table...');"""

seed_check_replacement = """async function seedProducts() {
    try {
        const count = await Product.countDocuments();
        if (count > 0) {
            console.log('Database already contains products. Seeding skipped.');
            return;
        }

        console.log('Seeding products table...');"""

content = content.replace(seed_check_target, seed_check_replacement)

# 4. Replace insert products
insert_target = """        let completed = 0;
        PRODUCTS.forEach((prod) => {
            db.run(`INSERT INTO products (
                id, name, price, comparePrice, category, image, badge, sizes, colors,
                isNew, isBestSeller, isTrending, stock, rating, reviewsCount, description,
                specs, benefits, features
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                prod.id,
                prod.name,
                prod.price,
                prod.comparePrice || null,
                prod.category,
                prod.image,
                prod.badge || null,
                JSON.stringify(prod.sizes),
                JSON.stringify(prod.colors),
                prod.isNew ? 1 : 0,
                prod.isBestSeller ? 1 : 0,
                prod.isTrending ? 1 : 0,
                prod.stock,
                prod.rating,
                prod.reviewsCount,
                prod.description,
                JSON.stringify(prod.specs),
                JSON.stringify(prod.benefits),
                JSON.stringify(prod.features)
            ], (err) => {
                if (err) console.error(`Error inserting product ${prod.id}:`, err.message);
                completed++;
                if (completed === PRODUCTS.length) {
                    console.log('Seeding products table complete.');
                }
            });
        });
    });
}"""

insert_replacement = """        const productsToInsert = PRODUCTS.map(prod => ({
            ...prod,
            isNewProduct: prod.isNew
        }));
        await Product.insertMany(productsToInsert);
        console.log('Seeding products table complete.');
    } catch (err) {
        console.error('Error seeding products:', err.message);
    }
}"""

content = content.replace(insert_target, insert_replacement)

# 5. Replace routes
routes_target = """// --- Auth Routes ---
app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Please provide all fields' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (row) return res.status(400).json({ error: 'Email already in use' });

        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const createdAt = new Date().toISOString();

            db.run('INSERT INTO users (name, email, password, createdAt) VALUES (?, ?, ?, ?)',
                [name, email, hashedPassword, createdAt],
                function (err) {
                    if (err) return res.status(500).json({ error: 'Failed to create user' });

                    const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET, { expiresIn: '7d' });
                    res.json({ token, user: { id: this.lastID, name, email } });
                }
            );
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    });
});

app.get('/api/me', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });

        db.get('SELECT id, name, email, createdAt FROM users WHERE id = ?', [decoded.id], (err, user) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json({ user });
        });
    });
});


// 1. GET /api/products - Get all products
app.get('/api/products', (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
            console.error('Error fetching products:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Parse JSON fields
        const products = rows.map(r => ({
            ...r,
            sizes: JSON.parse(r.sizes),
            colors: JSON.parse(r.colors),
            isNew: !!r.isNew,
            isBestSeller: !!r.isBestSeller,
            isTrending: !!r.isTrending,
            specs: JSON.parse(r.specs),
            benefits: JSON.parse(r.benefits),
            features: JSON.parse(r.features)
        }));

        res.json(products);
    });
});

// 2. GET /api/products/:id - Get product details
app.get('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    db.get("SELECT * FROM products WHERE id = ?", [id], (err, row) => {
        if (err) {
            console.error(`Error fetching product ${id}:`, err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Parse JSON fields
        const product = {
            ...row,
            sizes: JSON.parse(row.sizes),
            colors: JSON.parse(row.colors),
            isNew: !!row.isNew,
            isBestSeller: !!row.isBestSeller,
            isTrending: !!row.isTrending,
            specs: JSON.parse(row.specs),
            benefits: JSON.parse(row.benefits),
            features: JSON.parse(row.features)
        };

        res.json(product);
    });
});

// 3. POST /api/orders - Place a new order
app.post('/api/orders', (req, res) => {
    const {
        email, firstName, lastName, address, city, pincode,
        paymentMethod, upiId, cardNum, cardExpiry, cardCvv,
        items, subtotal, discount, total
    } = req.body;

    if (!email || !firstName || !lastName || !address || !city || !pincode || !paymentMethod || !items || items.length === 0) {
        return res.status(400).json({ error: 'Missing required checkout fields' });
    }

    if (pincode.length !== 6 || isNaN(pincode)) {
        return res.status(400).json({ error: 'Invalid Indian PIN Code. Must be exactly 6 digits.' });
    }

    // Check payment method requirements
    if (paymentMethod === 'upi' && !upiId) {
        return res.status(400).json({ error: 'UPI ID is required' });
    }
    if (paymentMethod === 'card' && (!cardNum || !cardExpiry || !cardCvv)) {
        return res.status(400).json({ error: 'Card details are required' });
    }

    // Generate UV order number
    const orderNumber = `UV-${Math.floor(100000 + Math.random() * 900000)}`;
    const createdAt = new Date().toISOString();
    const status = 'Pending';

    db.run(`INSERT INTO orders (
        id, email, firstName, lastName, address, city, pincode, paymentMethod,
        upiId, cardNum, cardExpiry, cardCvv, items, subtotal, discount, total, status, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
        orderNumber,
        email,
        firstName,
        lastName,
        address,
        city,
        pincode,
        paymentMethod,
        upiId || null,
        cardNum || null,
        cardExpiry || null,
        cardCvv || null,
        JSON.stringify(items),
        subtotal,
        discount,
        total,
        status,
        createdAt
    ], function (err) {
        if (err) {
            console.error('Error saving order:', err.message);
            return res.status(500).json({ error: 'Failed to place order' });
        }

        // Successfully placed order! Let's update the stock of the items purchased
        items.forEach(item => {
            db.run(`UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?`, [item.quantity, item.product.id], (err) => {
                if (err) {
                    console.error(`Error updating stock for product ${item.product.id}:`, err.message);
                }
            });
        });

        res.status(201).json({
            id: orderNumber,
            email,
            firstName,
            lastName,
            items,
            subtotal,
            discount,
            total,
            status,
            createdAt
        });
    });
});

// 4. GET /api/orders/:orderId - Track order
app.get('/api/orders/:orderId', (req, res) => {
    const orderId = req.params.orderId.toUpperCase().trim();
    const email = req.query.email ? req.query.email.toLowerCase().trim() : null;

    if (!email) {
        return res.status(400).json({ error: 'Billing email is required to track the order.' });
    }

    db.get("SELECT * FROM orders WHERE id = ? AND LOWER(email) = ?", [orderId, email], (err, row) => {
        if (err) {
            console.error(`Error tracking order ${orderId}:`, err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (!row) {
            return res.status(404).json({ error: 'No matching order found with that ID and email address.' });
        }

        // Return order status details
        res.json({
            id: row.id,
            email: row.email,
            status: row.status,
            createdAt: row.createdAt,
            items: JSON.parse(row.items),
            total: row.total,
            firstName: row.firstName,
            lastName: row.lastName
        });
    });
});

// 5. POST /api/contact - Submit contact form inquiry
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const createdAt = new Date().toISOString();

    db.run("INSERT INTO contact_messages (name, email, message, createdAt) VALUES (?, ?, ?, ?)", [
        name, email, message, createdAt
    ], function (err) {
        if (err) {
            console.error('Error saving contact message:', err.message);
            return res.status(500).json({ error: 'Failed to save contact inquiry' });
        }
        res.json({ success: true, message: 'Inquiry saved successfully.' });
    });
});

// 6. POST /api/newsletter - Join newsletter
app.post('/api/newsletter', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email address is required.' });
    }

    const createdAt = new Date().toISOString();

    db.run("INSERT OR IGNORE INTO newsletter_subscribers (email, createdAt) VALUES (?, ?)", [
        email, createdAt
    ], function (err) {
        if (err) {
            console.error('Error saving newsletter subscriber:', err.message);
            return res.status(500).json({ error: 'Failed to register subscription' });
        }
        res.json({ success: true, message: 'Subscription successful.' });
    });
});"""

routes_replacement = """// --- Auth Routes ---
app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Please provide all fields' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'Email already in use' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const createdAt = new Date().toISOString();

        const newUser = await User.create({
            name, email, password: hashedPassword, createdAt
        });

        const token = jwt.sign({ id: newUser._id, email }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: newUser._id, name, email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/api/me', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });

        try {
            const user = await User.findById(decoded.id).select('-password');
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json({ user });
        } catch (error) {
            res.status(500).json({ error: 'Database error' });
        }
    });
});


// 1. GET /api/products - Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find({});
        // Map isNewProduct back to isNew for frontend
        const mappedProducts = products.map(p => {
            const obj = p.toObject();
            obj.isNew = obj.isNewProduct;
            return obj;
        });
        res.json(mappedProducts);
    } catch (err) {
        console.error('Error fetching products:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 2. GET /api/products/:id - Get product details
app.get('/api/products/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const product = await Product.findOne({ id });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const obj = product.toObject();
        obj.isNew = obj.isNewProduct;
        res.json(obj);
    } catch (err) {
        console.error(`Error fetching product ${id}:`, err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 3. POST /api/orders - Place a new order
app.post('/api/orders', async (req, res) => {
    const {
        email, firstName, lastName, address, city, pincode,
        paymentMethod, upiId, cardNum, cardExpiry, cardCvv,
        items, subtotal, discount, total
    } = req.body;

    if (!email || !firstName || !lastName || !address || !city || !pincode || !paymentMethod || !items || items.length === 0) {
        return res.status(400).json({ error: 'Missing required checkout fields' });
    }

    if (pincode.length !== 6 || isNaN(pincode)) {
        return res.status(400).json({ error: 'Invalid Indian PIN Code. Must be exactly 6 digits.' });
    }

    if (paymentMethod === 'upi' && !upiId) {
        return res.status(400).json({ error: 'UPI ID is required' });
    }
    if (paymentMethod === 'card' && (!cardNum || !cardExpiry || !cardCvv)) {
        return res.status(400).json({ error: 'Card details are required' });
    }

    const orderNumber = `UV-${Math.floor(100000 + Math.random() * 900000)}`;
    const createdAt = new Date().toISOString();
    const status = 'Pending';

    try {
        const newOrder = await Order.create({
            id: orderNumber,
            email,
            firstName,
            lastName,
            address,
            city,
            pincode,
            paymentMethod,
            upiId: upiId || null,
            cardNum: cardNum || null,
            cardExpiry: cardExpiry || null,
            cardCvv: cardCvv || null,
            items,
            subtotal,
            discount,
            total,
            status,
            createdAt
        });

        // Update stock
        for (const item of items) {
            await Product.updateOne(
                { id: item.product.id },
                { $inc: { stock: -item.quantity } }
            );
        }

        res.status(201).json({
            id: orderNumber,
            email,
            firstName,
            lastName,
            items,
            subtotal,
            discount,
            total,
            status,
            createdAt
        });
    } catch (err) {
        console.error('Error saving order:', err.message);
        res.status(500).json({ error: 'Failed to place order' });
    }
});

// 4. GET /api/orders/:orderId - Track order
app.get('/api/orders/:orderId', async (req, res) => {
    const orderId = req.params.orderId.toUpperCase().trim();
    const email = req.query.email ? req.query.email.toLowerCase().trim() : null;

    if (!email) {
        return res.status(400).json({ error: 'Billing email is required to track the order.' });
    }

    try {
        // Find using regular expression for case-insensitive email match
        const order = await Order.findOne({ id: orderId, email: new RegExp(`^${email}$`, 'i') });
        if (!order) {
            return res.status(404).json({ error: 'No matching order found with that ID and email address.' });
        }

        res.json({
            id: order.id,
            email: order.email,
            status: order.status,
            createdAt: order.createdAt,
            items: order.items,
            total: order.total,
            firstName: order.firstName,
            lastName: order.lastName
        });
    } catch (err) {
        console.error(`Error tracking order ${orderId}:`, err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 5. POST /api/contact - Submit contact form inquiry
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const createdAt = new Date().toISOString();

    try {
        await ContactMessage.create({ name, email, message, createdAt });
        res.json({ success: true, message: 'Inquiry saved successfully.' });
    } catch (err) {
        console.error('Error saving contact message:', err.message);
        res.status(500).json({ error: 'Failed to save contact inquiry' });
    }
});

// 6. POST /api/newsletter - Join newsletter
app.post('/api/newsletter', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email address is required.' });
    }

    const createdAt = new Date().toISOString();

    try {
        // Upsert to ignore duplicates easily
        await NewsletterSubscriber.updateOne(
            { email },
            { $setOnInsert: { email, createdAt } },
            { upsert: true }
        );
        res.json({ success: true, message: 'Subscription successful.' });
    } catch (err) {
        console.error('Error saving newsletter subscriber:', err.message);
        res.status(500).json({ error: 'Failed to register subscription' });
    }
});"""

content = content.replace(routes_target, routes_replacement)

with open("server.js", "w") as f:
    f.write(content)
print("Rewrite complete")
