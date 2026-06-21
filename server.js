require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_vogue_key_2026';
const PORT = process.env.PORT || 8082;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from project root
app.use(express.static(__dirname));

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB database.');
    seedProducts();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
  });

// --- Mongoose Models ---

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

const productSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    comparePrice: { type: Number },
    category: { type: String, required: true },
    image: { type: String, required: true },
    badge: { type: String },
    sizes: { type: [String], required: true },
    colors: { type: [mongoose.Schema.Types.Mixed], required: true },
    isNewProduct: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    stock: { type: Number, default: 10 },
    rating: { type: Number, default: 4.5 },
    reviewsCount: { type: Number, default: 0 },
    description: { type: String, required: true },
    specs: { type: mongoose.Schema.Types.Mixed, required: true },
    benefits: { type: [String], required: true },
    features: { type: [String], required: true }
});
const Product = mongoose.model('Product', productSchema);

const orderSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    upiId: { type: String },
    cardNum: { type: String },
    cardExpiry: { type: String },
    cardCvv: { type: String },
    items: { type: [mongoose.Schema.Types.Mixed], required: true },
    subtotal: { type: Number, required: true },
    discount: { type: Number, required: true },
    total: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

const contactMessageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

const newsletterSubscriberSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});
const NewsletterSubscriber = mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);

async function seedProducts() {
    try {
        const count = await Product.countDocuments();
        if (count > 0) {
            console.log('Database already contains products. Seeding skipped.');
            return;
        }

        console.log('Seeding products collection...');
        
        const PRODUCTS = [];

        const mappedProducts = PRODUCTS.map(p => {
            const newP = { ...p, isNewProduct: p.isNew };
            delete newP.isNew;
            return newP;
        });

        await Product.insertMany(mappedProducts);
        console.log('Seeding products collection complete.');
    } catch (err) {
        console.error('Error seeding products:', err.message);
    }
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// --- Auth Routes ---
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

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: newUser._id, name: newUser.name, email: newUser.email } });
    } catch (error) {
        console.error('Signup error:', error);
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
    } catch (err) {
        console.error('Login error:', err);
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
        } catch (err) {
            console.error('Me error:', err);
            res.status(500).json({ error: 'Database error' });
        }
    });
});

// 1. GET /api/products - Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find({});
        const formatted = products.map(p => {
            const obj = p.toObject();
            obj.isNew = obj.isNewProduct;
            delete obj.isNewProduct;
            return obj;
        });
        res.json(formatted);
    } catch (err) {
        console.error('Error fetching products:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 2. GET /api/products/:id - Get product details
app.get('/api/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const product = await Product.findOne({ id });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        const obj = product.toObject();
        obj.isNew = obj.isNewProduct;
        delete obj.isNewProduct;
        
        res.json(obj);
    } catch (err) {
        console.error('Error fetching product ' + req.params.id + ':', err.message);
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

    try {
        const orderNumber = 'UV-' + Math.floor(100000 + Math.random() * 900000);
        
        const newOrder = await Order.create({
            id: orderNumber,
            email, firstName, lastName, address, city, pincode, paymentMethod,
            upiId: upiId || null,
            cardNum: cardNum || null,
            cardExpiry: cardExpiry || null,
            cardCvv: cardCvv || null,
            items, subtotal, discount, total,
            status: 'Pending'
        });

        for (const item of items) {
            await Product.updateOne(
                { id: item.product.id },
                { $inc: { stock: -item.quantity } }
            );
            await Product.updateOne(
                { id: item.product.id, stock: { $lt: 0 } },
                { $set: { stock: 0 } }
            );
        }

        res.status(201).json({
            id: newOrder.id,
            email: newOrder.email,
            firstName: newOrder.firstName,
            lastName: newOrder.lastName,
            items: newOrder.items,
            subtotal: newOrder.subtotal,
            discount: newOrder.discount,
            total: newOrder.total,
            status: newOrder.status,
            createdAt: newOrder.createdAt
        });
    } catch (err) {
        console.error('Error saving order:', err.message);
        res.status(500).json({ error: 'Failed to place order' });
    }
});

// 4. GET /api/orders/:orderId - Track order
app.get('/api/orders/:orderId', async (req, res) => {
    const orderId = req.params.orderId.toUpperCase().trim();
    const email = req.query.email ? req.query.email.trim() : null;

    if (!email) {
        return res.status(400).json({ error: 'Billing email is required to track the order.' });
    }

    try {
        const order = await Order.findOne({ 
            id: orderId, 
            email: { $regex: new RegExp('^' + email + '$', 'i') } 
        });
        
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
        console.error('Error tracking order ' + orderId + ':', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 5. POST /api/contact - Submit contact form inquiry
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        await ContactMessage.create({ name, email, message });
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

    try {
        await NewsletterSubscriber.findOneAndUpdate(
            { email },
            { email },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        res.json({ success: true, message: 'Subscription successful.' });
    } catch (err) {
        console.error('Error saving newsletter subscriber:', err.message);
        res.status(500).json({ error: 'Failed to register subscription' });
    }
});

// Start Server
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Urban Vogue Server running on http://localhost:${PORT}`);
    });
}

// Export for Vercel serverless function
module.exports = app;
