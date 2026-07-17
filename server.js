const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_vogue_key_2026';
const PORT = process.env.PORT || 500;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/urban-vogue';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from project root
app.use(express.static(__dirname));

// Mongoose Models
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
    resetPasswordToken: String,
    resetPasswordExpires: Date,
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
    });

async function seedProducts() {
    try {
        const count = await Product.countDocuments();
        if (count > 0) {
            console.log('Database already contains products. Seeding skipped.');
            return;
        }

        console.log('Seeding products table...');

        const PRODUCTS = [
            {
                id: 1,
                name: "Premium Graphic T-Shirt",
                price: 1499,
                comparePrice: 2199,
                category: "Men",
                image: "./assets/mens_graphic_tee.png",
                badge: "BEST SELLER",
                sizes: ["XS", "S", "M", "L", "XL", "XXL"],
                colors: [
                    { name: "Charcoal Black", hex: "#1F2937" },
                    { name: "Off-White", hex: "#F8F4EE" },
                    { name: "Sage Green", hex: "#7D8C7C" }
                ],
                isNew: false,
                isBestSeller: true,
                isTrending: true,
                stock: 12,
                rating: 4.8,
                reviewsCount: 142,
                description: "Elevate your street aesthetic with the Urban Vogue Premium Graphic T-Shirt. Made from 280 GSM heavyweight combed cotton, it offers a thick structured fit, dropped shoulders, and a bold screen-printed graphic on the chest. Designed to stay boxy and soft wash after wash.",
                specs: {
                    "Material": "100% Combed Organic Cotton, 280 GSM",
                    "Fit": "Boxy, dropped shoulder oversized fit",
                    "Origin": "Proudly designed & manufactured in India",
                    "Care Instructions": "Machine wash cold inside out, tumble dry low"
                },
                benefits: ["Ultra-soft combed organic cotton comfort", "Heavyweight structured drape", "Resists fading and shrinking"],
                features: ["280 GSM combed cotton", "Dropped shoulder street silhouette", "High-density graphic print"]
            },
            {
                id: 2,
                name: "Casual Oversized Hoodie",
                price: 3499,
                comparePrice: 4999,
                category: "Men",
                image: "./assets/mens_oversized_hoodie.png",
                badge: "MUST HAVE",
                sizes: ["XS", "S", "M", "L", "XL", "XXL"],
                colors: [
                    { name: "Midnight Black", hex: "#111111" },
                    { name: "Coral Red", hex: "#FF6B6B" },
                    { name: "Soft Ivory", hex: "#F8F4EE" }
                ],
                isNew: true,
                isBestSeller: true,
                isTrending: true,
                stock: 5,
                rating: 4.9,
                reviewsCount: 96,
                description: "The cornerstone of streetwear. Our Casual Oversized Hoodie is engineered from ultra-dense 420 GSM French Terry cotton. Features a double-lined hood (drawstring-free for a clean profile), heavy kangaroo pocket, and secure ribbed cuffs.",
                specs: {
                    "Material": "100% French Terry Cotton, 420 GSM",
                    "Fit": "Heavy oversized streetwear silhouette",
                    "Hardware": "Custom logo gold tip accents",
                    "Care": "Dry clean recommended or gentle cold wash"
                },
                benefits: ["Exceptional warmth & plush softness", "Double-lined hood retains perfect shape", "Heavyweight pocket utility"],
                features: ["Dense organic fleece/French Terry", "Clean drawstring-free design", "Secure snug ribbing"]
            },
            {
                id: 3,
                name: "Oversized Fashion Tee",
                price: 1499,
                comparePrice: 1999,
                category: "Women",
                image: "./assets/womens_fashion_tee.png",
                badge: "ESSENTIALS",
                sizes: ["XS", "S", "M", "L", "XL", "XXL"],
                colors: [
                    { name: "Soft Ivory", hex: "#F8F4EE" },
                    { name: "Sunset Peach", hex: "#FBCFE8" },
                    { name: "Sage Green", hex: "#7D8C7C" }
                ],
                isNew: false,
                isBestSeller: false,
                isTrending: true,
                stock: 8,
                rating: 4.7,
                reviewsCount: 88,
                description: "A perfect blend of luxury comfort and relaxed style. This Women's Oversized Fashion Tee is crafted from 240 GSM organic cotton with dropped shoulders and a wider neck rib. A premium streetwear basic for everyday wear.",
                specs: {
                    "Material": "100% Organic Cotton, 240 GSM",
                    "Fit": "Relaxed oversized crop styling",
                    "Origin": "Designed and tailored in India",
                    "Care": "Machine wash cold with like colors"
                },
                benefits: ["Ultra-soft combed organic cotton comfort", "Heavyweight structured drape", "Resists fading and shrinking"],
                features: ["280 GSM combed cotton", "Dropped shoulder street silhouette", "High-density graphic print"]
            },
            {
                id: 4,
                name: "Summer Co-Ord Set",
                price: 2999,
                comparePrice: 4499,
                category: "Women",
                image: "./assets/womens_coord_set.png",
                badge: "LIMIT RUN",
                sizes: ["XS", "S", "M", "L", "XL", "XXL"],
                colors: [
                    { name: "Coral Red", hex: "#FF6B6B" },
                    { name: "Soft Ivory", hex: "#F8F4EE" },
                    { name: "Sage Green", hex: "#7D8C7C" }
                ],
                isNew: true,
                isBestSeller: true,
                isTrending: false,
                stock: 4,
                rating: 5.0,
                reviewsCount: 34,
                description: "Effortless summer coordination. This Summer Co-Ord Set includes a relaxed crop shirt and matching high-waisted shorts made from a premium breathable linen-cotton blend. Perfect for beach strolls or casual cafe outings.",
                specs: {
                    "Material": "55% Linen, 45% Organic Cotton",
                    "Details": "High-waist shorts, button-down relaxed shirt",
                    "Fit": "Comfortable relaxed casual fit",
                    "Care": "Hand wash cold, line dry"
                },
                benefits: ["Coordinated effortless look", "Breathable natural fabric movement", "Soft natural fabric texture"],
                features: ["Matching two-piece combo", "Relaxed fit casual styling", "Adjustable elastic waist drawcords"]
            },
            {
                id: 5,
                name: "Relaxed Fit Sweatshirt",
                price: 2499,
                comparePrice: 3499,
                category: "Women",
                image: "./assets/womens_sweatshirt.png",
                badge: "SALE",
                sizes: ["XS", "S", "M", "L", "XL", "XXL"],
                colors: [
                    { name: "Charcoal Black", hex: "#1F2937" },
                    { name: "Soft Ivory", hex: "#F8F4EE" },
                    { name: "Sunset Peach", hex: "#FBCFE8" }
                ],
                isNew: false,
                isBestSeller: false,
                isTrending: false,
                stock: 9,
                rating: 4.6,
                reviewsCount: 72,
                description: "A cozy, minimalist wardrobe essential. Features a loose drop-shoulder silhouette, heavyweight French Terry fabric, and double-stitched seam details. Cozy comfort meets high streetwear aesthetics.",
                specs: {
                    "Material": "100% French Terry Cotton, 380 GSM",
                    "Fit": "Dropped shoulder loose active fit",
                    "Details": "Tonal brand logo embroidery on back collar",
                    "Care": "Machine wash warm, iron inside out"
                },
                benefits: ["Ultimate everyday layering", "Cozy loops interior comfort", "Long lasting ribbed shape"],
                features: ["380 GSM loopback cotton Terry", "Loose drop shoulder style", "Tonal logo embroidery detail"]
            },
            {
                id: 6,
                name: "Kids Printed T-Shirt",
                price: 899,
                comparePrice: 1299,
                category: "Kids",
                image: "./assets/kids_printed_tee.png",
                badge: "KIDS PLAY",
                sizes: ["XS", "S", "M", "L", "XL", "XXL"],
                colors: [
                    { name: "Soft Ivory", hex: "#F8F4EE" },
                    { name: "Sunset Peach", hex: "#FBCFE8" },
                    { name: "Sage Green", hex: "#7D8C7C" }
                ],
                isNew: true,
                isBestSeller: false,
                isTrending: false,
                stock: 14,
                rating: 4.8,
                reviewsCount: 29,
                description: "Add a playful pop to their wardrobe with the Kids Printed Tee. Made from 100% hypoallergenic organic cotton (180 GSM), this tee is incredibly soft on children's skin while remaining highly durable for active play. Features a vibrant water-based print.",
                specs: {
                    "Material": "100% Organic Hypoallergenic Cotton",
                    "Print Type": "Non-toxic water-based screenprint",
                    "Weight": "180 GSM breathable knit",
                    "Care": "Tumble dry low, do not iron print"
                },
                benefits: ["Ultra-soft combed organic cotton comfort", "Heavyweight structured drape", "Resists fading and shrinking"],
                features: ["180 GSM organic cotton", "Dropped shoulder street silhouette", "High-density graphic print"]
            },
            {
                id: 7,
                name: "Kids Casual Hoodie",
                price: 1799,
                comparePrice: 2499,
                category: "Kids",
                image: "./assets/kids_casual_hoodie.png",
                badge: "MINI STYLE",
                sizes: ["XS", "S", "M", "L", "XL", "XXL"],
                colors: [
                    { name: "Coral Red", hex: "#FF6B6B" },
                    { name: "Midnight Black", hex: "#111111" },
                    { name: "Soft Ivory", hex: "#F8F4EE" }
                ],
                isNew: false,
                isBestSeller: true,
                isTrending: true,
                stock: 6,
                rating: 4.9,
                reviewsCount: 43,
                description: "Keep your little ones cozy and stylish. This Kids Casual Hoodie is built from a soft-brushed organic cotton fleece blend. Features a comfortable hood, spacious front pockets, and elastic cuffs that offer ease of movement.",
                specs: {
                    "Material": "80% Organic Cotton, 20% Recycled Polyester fleece",
                    "Weight": "300 GSM brushed fleece",
                    "Features": "Cozy kangaroo pocket, tagless neck print",
                    "Care": "Machine wash cold, tumble dry medium"
                },
                benefits: ["Exceptional warmth & plush softness", "Double-lined hood retains perfect shape", "Heavyweight pocket utility"],
                features: ["Dense organic fleece/French Terry", "Clean drawstring-free design", "Secure snug ribbing"]
            },
            {
                id: 8,
                name: "Kids Matching Set",
                price: 1999,
                comparePrice: 2999,
                category: "Kids",
                image: "./assets/kids_matching_set.png",
                badge: "COMBO SAVE",
                sizes: ["XS", "S", "M", "L", "XL", "XXL"],
                colors: [
                    { name: "Charcoal Black", hex: "#1F2937" },
                    { name: "Soft Ivory", hex: "#F8F4EE" },
                    { name: "Sunset Peach", hex: "#FBCFE8" }
                ],
                isNew: true,
                isBestSeller: false,
                isTrending: false,
                stock: 7,
                rating: 4.7,
                reviewsCount: 51,
                description: "The ultimate lounge and play combo. This set features a matching crewneck sweatshirt and joggers, crafted from breathable organic loopback cotton. Includes an elastic waistband with drawcords and side pockets.",
                specs: {
                    "Material": "100% Organic Loopback Cotton, 280 GSM",
                    "Inclusions": "Crewneck Sweatshirt + Joggers",
                    "Details": "Elastic waist drawcords, secure side pockets",
                    "Care": "Wash cold inside out, warm iron"
                },
                benefits: ["Coordinated effortless look", "Breathable natural fabric movement", "Soft natural fabric texture"],
                features: ["Matching two-piece combo", "Relaxed fit casual styling", "Adjustable elastic waist drawcords"]
            },
            {
                id: 9,
                name: "Modern Silk Saree",
                price: 4999,
                comparePrice: 6999,
                category: "Women",
                image: "./assets/womens_silk_saree.png",
                badge: "EXCLUSIVE",
                sizes: ["Free Size"],
                colors: [
                    { name: "Coral Red", hex: "#FF6B6B" },
                    { name: "Soft Ivory", hex: "#F8F4EE" },
                    { name: "Midnight Black", hex: "#111111" }
                ],
                isNew: true,
                isBestSeller: true,
                isTrending: false,
                stock: 5,
                rating: 4.9,
                reviewsCount: 38,
                description: "A contemporary re-imagination of classic Indian drape. Crafted from premium organic linen-silk blend, this Modern Silk Saree features clean minimal borders and a modern geometric texture. Heavy, structured, and drapes like liquid metal.",
                specs: {
                    "Material": "70% Organic Silk, 30% Linen",
                    "Details": "5.5 meters length, comes with unstitched blouse fabric",
                    "Origin": "Hand-woven by artisans in Varanasi, India",
                    "Care Instructions": "Dry clean only"
                },
                benefits: ["Ultimate everyday layering", "Cozy loops interior comfort", "Long lasting ribbed shape"],
                features: ["380 GSM loopback cotton Terry", "Loose drop shoulder style", "Tonal logo embroidery detail"]
            },
            {
                id: 10,
                name: "Designer Linen Kurti",
                price: 1899,
                comparePrice: 2799,
                category: "Women",
                image: "./assets/womens_linen_kurti.png",
                badge: "NEW DROP",
                sizes: ["XS", "S", "M", "L", "XL", "XXL"],
                colors: [
                    { name: "Soft Ivory", hex: "#F8F4EE" },
                    { name: "Sage Green", hex: "#7D8C7C" },
                    { name: "Coral Red", hex: "#FF6B6B" }
                ],
                isNew: true,
                isBestSeller: false,
                isTrending: true,
                stock: 12,
                rating: 4.8,
                reviewsCount: 46,
                description: "Minimalist streetwear meets ethnic aesthetics. The Designer Linen Kurti is made from high-density 220 GSM breathable linen. Features a modern band collar, concealed front button placket, drop-shoulder comfort, and side slit pockets for functional utility.",
                specs: {
                    "Material": "100% Breathable Organic Linen, 220 GSM",
                    "Details": "Minimal band collar, concealed placket, side pockets",
                    "Fit": "Relaxed boxy silhouette kurti",
                    "Care Instructions": "Hand wash cold, warm iron"
                },
                benefits: ["Ultimate everyday layering", "Cozy loops interior comfort", "Long lasting ribbed shape"],
                features: ["220 GSM breathable linen", "Dropped shoulder street silhouette", "Side slit pockets for functional utility"]
            },
            {
                id: 11,
                name: "Streetwear Shirt-Pant Set",
                price: 3999,
                comparePrice: 5499,
                category: "Men",
                image: "./assets/mens_shirt_pant.png",
                badge: "ESSENTIALS",
                sizes: ["S", "M", "L", "XL", "XXL"],
                colors: [
                    { name: "Charcoal Black", hex: "#1F2937" },
                    { name: "Sage Green", hex: "#7D8C7C" },
                    { name: "Soft Ivory", hex: "#F8F4EE" }
                ],
                isNew: false,
                isBestSeller: true,
                isTrending: true,
                stock: 8,
                rating: 4.9,
                reviewsCount: 52,
                description: "The ultimate modern uniform. This Shirt Pant Set consists of a structured camp-collar button-down shirt and matching straight-leg trousers with an elasticized waistband. Crafted from a heavy canvas-cotton blend for a robust streetwear drape.",
                specs: {
                    "Material": "80% Canvas Cotton, 20% Linen",
                    "Inclusions": "Camp-Collar Shirt + Straight-Leg Trousers",
                    "Fit": "Relaxed streetwear silhouette",
                    "Care Instructions": "Machine wash cold, tumble dry low"
                },
                benefits: ["Coordinated effortless look", "Breathable natural fabric movement", "Soft natural fabric texture"],
                features: ["Matching two-piece combo", "Relaxed fit casual styling", "Adjustable elastic waist drawcords"]
            },
            {
                id: 12,
                name: "Contemporary Velvet Lehnga",
                price: 8999,
                comparePrice: 12999,
                category: "Women",
                image: "./assets/womens_velvet_lehnga.png",
                badge: "LUXURY DROP",
                sizes: ["S", "M", "L", "XL"],
                colors: [
                    { name: "Midnight Black", hex: "#111111" },
                    { name: "Coral Red", hex: "#FF6B6B" },
                    { name: "Soft Ivory", hex: "#F8F4EE" }
                ],
                isNew: true,
                isBestSeller: false,
                isTrending: false,
                stock: 4,
                rating: 5.0,
                reviewsCount: 15,
                description: "Designed for high-impact presence. This Contemporary Velvet Lehnga consists of a heavyweight micro-velvet flared skirt, matching cropped top, and a lightweight organza dupatta. Features a modern geometric tonal embroidery that redefines luxury ethnic wear.",
                specs: {
                    "Material": "Premium Micro-Velvet, Organza dupatta",
                    "Details": "Heavy 12-kali flared skirt, geometric tonal embroidery",
                    "Weight": "Heavy structured drape",
                    "Care Instructions": "Professional dry clean only"
                },
                benefits: ["Ultimate everyday layering", "Cozy loops interior comfort", "Long lasting ribbed shape"],
                features: ["Premium Micro-Velvet", "Flared skirt with geometric tonal embroidery", "Organza dupatta"]
            },
            {
                id: 13,
                name: "Men's Linen Casual Shirt",
                price: 1999,
                comparePrice: 2999,
                category: "Men",
                image: "./assets/mens_linen_shirt.png",
                badge: "SUMMER CUT",
                sizes: ["S", "M", "L", "XL", "XXL"],
                colors: [
                    { name: "Soft Ivory", hex: "#F8F4EE" },
                    { name: "Sage Green", hex: "#7D8C7C" },
                    { name: "Midnight Black", hex: "#111111" }
                ],
                isNew: true,
                isBestSeller: false,
                isTrending: false,
                stock: 14,
                rating: 4.7,
                reviewsCount: 31,
                description: "Premium, lightweight summer linen shirt with an open camp collar, split hem, and dropped shoulders. Tailored for relaxed streetwear coordination.",
                specs: {
                    "Material": "60% Organic Linen, 40% Long-Staple Cotton",
                    "Fit": "Relaxed utility silhouette",
                    "Details": "Concealed front chest pocket, split hem",
                    "Care Instructions": "Hand wash cold, air dry recommended"
                },
                benefits: ["Coordinated effortless look", "Breathable natural fabric movement", "Soft natural fabric texture"],
                features: ["60% Organic Linen, 40% Cotton", "Open camp collar design", "Split hem & dropped shoulders"]
            },
            {
                id: 14,
                name: "Men's Cargo Pant",
                price: 2499,
                comparePrice: 3499,
                category: "Men",
                image: "./assets/mens_cargo_pant.png",
                badge: "STREETWEAR",
                sizes: ["S", "M", "L", "XL", "XXL"],
                colors: [
                    { name: "Charcoal Black", hex: "#1F2937" },
                    { name: "Sage Green", hex: "#7D8C7C" }
                ],
                isNew: false,
                isBestSeller: true,
                isTrending: true,
                stock: 9,
                rating: 4.8,
                reviewsCount: 64,
                description: "Tough ripstop canvas cargo trousers with adjustable ankle strap buckles, 6-pocket utility, and double-reinforced seat panel.",
                specs: {
                    "Material": "100% Cotton Ripstop Canvas, 320 GSM",
                    "Fit": "Loose baggy utility fit",
                    "Hardware": "Heavy-duty custom buckles and snaps",
                    "Care Instructions": "Machine wash cold with similar colors"
                },
                benefits: ["Ultimate everyday layering", "Cozy loops interior comfort", "Long lasting ribbed shape"],
                features: ["320 GSM ripstop canvas", "Adjustable ankle strap buckles", "6-pocket utility layout"]
            },
            {
                id: 15,
                name: "Men's Chino Trouser",
                price: 2299,
                comparePrice: 3199,
                category: "Men",
                image: "./assets/mens_chino_trouser.png",
                badge: "PREMIUM",
                sizes: ["S", "M", "L", "XL", "XXL"],
                colors: [
                    { name: "Charcoal Black", hex: "#1F2937" },
                    { name: "Soft Ivory", hex: "#F8F4EE" }
                ],
                isNew: false,
                isBestSeller: false,
                isTrending: false,
                stock: 11,
                rating: 4.6,
                reviewsCount: 22,
                description: "Smart-casual streetwear trousers made from premium double-brushed cotton twill. Features structured front pleats and clean back welt pockets.",
                specs: {
                    "Material": "98% Combed Cotton, 2% Elastane twill",
                    "Fit": "Tapered straight-leg chinos",
                    "Pocketing": "Deep front cotton-lined side pockets",
                    "Care Instructions": "Machine wash warm, iron inside out"
                },
                benefits: ["Ultimate everyday layering", "Cozy loops interior comfort", "Long lasting ribbed shape"],
                features: ["Double-brushed cotton twill", "Structured front pleats", "Tapered straight-leg styling"]
            },
            {
                id: 16,
                name: "Women's Floral Organza Saree",
                price: 3999,
                comparePrice: 5499,
                category: "Women",
                image: "./assets/womens_organza_saree.png",
                badge: "EXCLUSIVE",
                sizes: ["Free Size"],
                colors: [
                    { name: "Soft Ivory", hex: "#F8F4EE" },
                    { name: "Sunset Peach", hex: "#FBCFE8" }
                ],
                isNew: true,
                isBestSeller: false,
                isTrending: true,
                stock: 6,
                rating: 4.9,
                reviewsCount: 19,
                description: "An ethereal organza saree featuring hand-painted botanical prints and minimal embroidered borders. Includes a contrast raw-silk blouse fabric.",
                specs: {
                    "Material": "100% Pure Silk Organza",
                    "Details": "5.5 meters length, hand-painted artwork",
                    "Blouse": "80cm unstitched raw silk blouse piece",
                    "Care Instructions": "Dry clean only, do not steam iron"
                },
                benefits: ["Ultimate everyday layering", "Cozy loops interior comfort", "Long lasting ribbed shape"],
                features: ["100% Pure Silk Organza", "Hand-painted floral motifs", "Contrast raw-silk blouse fabric"]
            },
            {
                id: 17,
                name: "Women's Hand-Block Kurti",
                price: 1499,
                comparePrice: 2199,
                category: "Women",
                image: "./assets/womens_block_kurti.png",
                badge: "NEW DROP",
                sizes: ["XS", "S", "M", "L", "XL", "XXL"],
                colors: [
                    { name: "Coral Red", hex: "#FF6B6B" },
                    { name: "Soft Ivory", hex: "#F8F4EE" },
                    { name: "Sage Green", hex: "#7D8C7C" }
                ],
                isNew: false,
                isBestSeller: true,
                isTrending: false,
                stock: 15,
                rating: 4.7,
                reviewsCount: 39,
                description: "Premium organic cotton kurti adorned with traditional hand-block indigo and rust prints. Tailored with dropped shoulders and split utility cuffs.",
                specs: {
                    "Material": "100% Cotton, 200 GSM breathable weave",
                    "Dyes": "All-natural non-toxic vegetable dyes",
                    "Fit": "Relaxed straight A-line silhouette",
                    "Care Instructions": "Hand wash separately in cold water"
                },
                benefits: ["Ultimate everyday layering", "Cozy loops interior comfort", "Long lasting ribbed shape"],
                features: ["100% Organic Cotton", "Traditional block print design", "Dropped shoulders & split utility cuffs"]
            },
            {
                id: 18,
                name: "Women's Georgette Lehnga",
                price: 7999,
                comparePrice: 10999,
                category: "Women",
                image: "./assets/womens_georgette_lehnga.png",
                badge: "LUXURY DROP",
                sizes: ["S", "M", "L", "XL"],
                colors: [
                    { name: "Soft Ivory", hex: "#F8F4EE" },
                    { name: "Sunset Peach", hex: "#FBCFE8" },
                    { name: "Coral Red", hex: "#FF6B6B" }
                ],
                isNew: true,
                isBestSeller: true,
                isTrending: false,
                stock: 5,
                rating: 4.8,
                reviewsCount: 14,
                description: "A lightweight flowing georgette lehnga featuring delicate gold foil printing, a fully lined panelled skirt, crop blouse, and matching sheer dupatta.",
                specs: {
                    "Material": "Premium Faux Georgette, Santoon lining",
                    "Skirt Flair": "4.5 meters flared bottom circle",
                    "Blouse": "Fully padded crop halter top blouse",
                    "Care Instructions": "Dry clean recommended"
                },
                benefits: ["Ultimate everyday layering", "Cozy loops interior comfort", "Long lasting ribbed shape"],
                features: ["Premium Georgette", "Flared bottom panelled skirt", "Fully padded crop top blouse"]
            },
            {
                id: 19,
                name: "Kids' Cotton Summer Frock",
                price: 1299,
                comparePrice: 1799,
                category: "Kids",
                image: "./assets/kids_summer_frock.png",
                badge: "COZY FIT",
                sizes: ["XS", "S", "M", "L", "XL", "XXL"],
                colors: [
                    { name: "Sunset Peach", hex: "#FBCFE8" },
                    { name: "Soft Ivory", hex: "#F8F4EE" }
                ],
                isNew: true,
                isBestSeller: false,
                isTrending: false,
                stock: 10,
                rating: 4.8,
                reviewsCount: 18,
                description: "A lightweight, breathable organic cotton tiered summer frock. Tagless collar design and non-toxic soft-brushed elastic for all-day play comfort.",
                specs: {
                    "Material": "100% Hypoallergenic Cotton Muslin",
                    "Lining": "Soft cotton cambric inner lining",
                    "Fit": "Loose gathered flare dress",
                    "Care Instructions": "Tumble dry low, warm iron if needed"
                },
                benefits: ["Ultra-soft combed organic cotton comfort", "Heavyweight structured drape", "Resists fading and shrinking"],
                features: ["100% Organic Muslin Cotton", "Hypoallergenic tagless design", "Soft elastic fitments"]
            },
            {
                id: 20,
                name: "Kids' Denim Shirt & Pant Set",
                price: 1799,
                comparePrice: 2499,
                category: "Kids",
                image: "./assets/kids_denim_set.png",
                badge: "MINI DROP",
                sizes: ["XS", "S", "M", "L", "XL", "XXL"],
                colors: [
                    { name: "Charcoal Black", hex: "#1F2937" },
                    { name: "Soft Ivory", hex: "#F8F4EE" }
                ],
                isNew: false,
                isBestSeller: true,
                isTrending: true,
                stock: 8,
                rating: 4.9,
                reviewsCount: 25,
                description: "A double-stitched cotton denim utility shirt paired with relaxed stretch denim pants. Features snap buttons and an adjustable inner waistband.",
                specs: {
                    "Material": "98% Cotton Denim, 2% Spandex stretch",
                    "Set Contains": "Denim Over-shirt + Stretch Denim Jeans",
                    "Hardware": "Child-safe nickel-free snaps",
                    "Care Instructions": "Wash inside out, machine wash cold"
                },
                benefits: ["Coordinated effortless look", "Breathable natural fabric movement", "Soft natural fabric texture"],
                features: ["98% Cotton Denim, 2% Spandex", "Adjustable inner waistband", "Double-stitched utility pockets"]
            },
            {
                id: 21,
                name: "Kids' Fleece Co-Ord Set",
                price: 1499,
                comparePrice: 1999,
                category: "Kids",
                image: "./assets/kids_fleece_coord.png",
                badge: "DAILY PLAY",
                sizes: ["XS", "S", "M", "L", "XL", "XXL"],
                colors: [
                    { name: "Midnight Black", hex: "#111111" },
                    { name: "Coral Red", hex: "#FF6B6B" },
                    { name: "Soft Ivory", hex: "#F8F4EE" }
                ],
                isNew: true,
                isBestSeller: false,
                isTrending: false,
                stock: 12,
                rating: 4.7,
                reviewsCount: 30,
                description: "A cozy two-piece co-ord set made from soft-brushed organic cotton fleece. Features a crewneck sweatshirt and matching joggers with secure cuffs.",
                specs: {
                    "Material": "100% Organic Cotton fleece, 280 GSM",
                    "Inclusions": "Crewneck Sweatshirt + Joggers",
                    "Details": "Tagless printed labels, flatlock seams",
                    "Care Instructions": "Machine wash cold, air dry to retain softness"
                },
                benefits: ["Coordinated effortless look", "Breathable natural fabric movement", "Soft natural fabric texture"],
                features: ["280 GSM organic cotton fleece", "Tagless printed labels", "Secure ribbed cuffs"]
            }
        ];

        const productsToInsert = PRODUCTS.map(prod => ({
            ...prod,
            isNewProduct: prod.isNew
        }));
        await Product.insertMany(productsToInsert);
        console.log('Seeding products table complete.');
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

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', // Standard fallback, user can customize via env
    auth: {
        user: process.env.EMAIL_USER || 'test@gmail.com',
        pass: process.env.EMAIL_PASS || 'dummy_password'
    }
});

app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Please provide an email address' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            // Return success regardless of whether user exists for security
            return res.json({ message: 'If an account exists, a password reset link will be sent.' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Set token to expire in 1 hour
        user.resetPasswordToken = tokenHash;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        const resetUrl = `http://localhost:5174/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@urbanvogue.com',
            to: user.email,
            subject: 'Urban Vogue - Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                  `Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n` +
                  `${resetUrl}\n\n` +
                  `If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Error sending email: ', err);
                // We don't fail the request to not leak user existence, but we log the error
            } else {
                console.log('Reset email sent: ' + info.response);
            }
        });

        res.json({ message: 'If an account exists, a password reset link will be sent.' });
    } catch (error) {
        console.error('Forgot password error: ', error);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
        return res.status(400).json({ error: 'Token and new password are required' });
    }

    try {
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: tokenHash,
            resetPasswordExpires: { $gt: Date.now() } // Ensure token hasn't expired
        });

        if (!user) {
            return res.status(400).json({ error: 'Password reset token is invalid or has expired.' });
        }

        // Set new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        // Clear reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password has been successfully reset. You can now log in.' });
    } catch (error) {
        console.error('Reset password error: ', error);
        res.status(500).json({ error: 'Server error' });
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

app.get('/api/my-orders', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });

        try {
            const user = await User.findById(decoded.id);
            if (!user) return res.status(404).json({ error: 'User not found' });
            
            // Find orders by user's email
            // We use case-insensitive regex in case of capitalization differences
            const orders = await Order.find({ email: new RegExp(`^${user.email}$`, 'i') }).sort({ createdAt: -1 });
            res.json(orders);
        } catch (error) {
            console.error('Error fetching my orders: ', error);
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
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const createdAt = new Date().toISOString();

    try {
        await ContactMessage.create({ name, email, message, createdAt });
        
        // Send email via NodeMailer
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // sending to ourselves
            subject: `New Contact Inquiry: ${subject || 'No Subject'}`,
            html: `
                <h3>New message from Urban Vogue Contact Form</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };
        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Inquiry saved and email sent successfully.' });
    } catch (err) {
        console.error('Error saving contact message or sending email:', err.message);
        res.status(500).json({ error: 'Failed to save contact inquiry or send email.' });
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
});

// Start Server
app.listen(PORT, () => {
    console.log(`Urban Vogue Server running on http://localhost:${PORT}`);
});
