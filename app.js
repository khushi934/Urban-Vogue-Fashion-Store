/* ==========================================================================
   URBAN VOGUE - APPLICATION CONTROLLER (SPA ROUTING, STATE & CRO ENGINE)
   ========================================================================== */

// Safe Storage utility to prevent SecurityError in iframe environments
const SafeStorage = {
    _memorySession: {},
    _memoryLocal: {},
    isSupported(type) {
        try {
            const storage = window[type];
            const x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch (e) {
            return false;
        }
    },
    getItem(type, key, fallback = null) {
        if (this.isSupported(type)) {
            try {
                const val = window[type].getItem(key);
                return val !== null ? val : fallback;
            } catch (e) {
                // fallback
            }
        }
        const mem = type === 'sessionStorage' ? this._memorySession : this._memoryLocal;
        return mem[key] !== undefined ? mem[key] : fallback;
    },
    setItem(type, key, value) {
        if (this.isSupported(type)) {
            try {
                window[type].setItem(key, value);
                return;
            } catch (e) {
                // fallback
            }
        }
        const mem = type === 'sessionStorage' ? this._memorySession : this._memoryLocal;
        mem[key] = String(value);
    },
    removeItem(type, key) {
        if (this.isSupported(type)) {
            try {
                window[type].removeItem(key);
                return;
            } catch (e) {
                // fallback
            }
        }
        const mem = type === 'sessionStorage' ? this._memorySession : this._memoryLocal;
        delete mem[key];
    }
};

// 1. PRODUCT CATALOG DATABASE
// Products are loaded from the backend API on startup.
let PRODUCTS = [];

async function loadProductsFromAPI() {
    try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        PRODUCTS = await response.json();
        console.log('Loaded ' + PRODUCTS.length + ' products from database.');
    } catch (err) {
        console.warn('Backend API unavailable. Falling back to offline product catalog.');
        PRODUCTS = [
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
    }
}



// Products come pre-processed from the database with benefits and features already set.

// 2. MOCK DATASETS (REVIEWS, FAQS, TESTIMONIALS)
const REVIEWS_MOCK = [
    { name: "Kabir S.", rating: 5, verified: true, date: "12 June 2026", title: "Phenomenal Heavyweight Fit", body: "Absolutely love the thickness of the material. It fits exactly how premium streetwear should. The gold details on the hoodie tip feel very heavy and premium." },
    { name: "Ananya M.", rating: 5, verified: true, date: "05 June 2026", title: "Stunning minimalist design", body: "Ordered the leather sneakers. The packaging was beautiful and they look extremely sleek. Best sneakers I own now, fits true to size." },
    { name: "Rohan D.", rating: 4, verified: true, date: "28 May 2026", title: "Worth every rupee", body: "Excellent fabric quality. The oversized tee feels hefty and robust. Took 4 days to deliver in Mumbai, packaging was clean." },
    { name: "Meera K.", rating: 5, verified: true, date: "15 May 2026", title: "Top tier styling", body: "Best utility cargo pants out there. The ripstop material is high grade, and you can adjust the ankles to tighten up for sneakers. Highly recommend." }
];

const FAQS_MOCK = [
    { question: "What makes Urban Vogue fabric different?", answer: "We custom engineer our fabrics. Our tees are made of 280 GSM heavyweight combed cotton, and our hoodies are 420 GSM double-brushed French Terry. This ensures structure, ultimate comfort, and longevity." },
    { question: "How long does shipping take within India?", answer: "We offer complimentary express shipping across India. Standard orders are dispatched within 24 hours and reach metro cities in 3 days, and other regions within 5 business days." },
    { question: "Can I exchange for a different size?", answer: "Yes, absolutely! We provide a 14-day hassle-free size exchange policy. If the fit is not perfect, we'll coordinate a reverse pickup from your address at zero extra cost." },
    { question: "What payment options are available?", answer: "We support UPI (GPay, PhonePe, Paytm), Visa, Mastercard, RuPay Cards, NetBanking, and Cash on Delivery (COD) across eligible PIN codes." }
];

// 3. GLOBAL STATE
let state = {
    currentView: 'home',
    activeProductId: null,
    cart: [],
    discountCode: '',
    searchQuery: '',
    directCheckoutItem: null,
    user: null
};

try {
    const savedCart = SafeStorage.getItem('localStorage', 'uv_cart');
    state.cart = savedCart ? JSON.parse(savedCart) : [];
} catch (e) {
    state.cart = [];
}
state.discountCode = SafeStorage.getItem('localStorage', 'uv_discount', '');

// 4. ON CONTEXT LOAD & EVENTS BINDING
async function initApp() {
    // Guard: Warn if opened as a local file instead of via the server.
    // All fetch('/api/...') calls will fail silently if not served from http://.
    if (window.location.protocol === 'file:') {
        console.error('[Urban Vogue] ERROR: App opened as a local file. All API calls (orders, contact, newsletter) will fail. Please visit http://localhost:8082 instead.');
        alert('⚠️ Urban Vogue: Please open the app at http://localhost:8082 — not as a local file. Run "npm run dev" and then visit http://localhost:8082 in your browser.');
        return;
    }

    // Initialise Password Lockout Gateway
    initPasswordGateway();

    // Check Auth State
    await checkAuth();

    // Load products from backend API first
    await loadProductsFromAPI();

    // Initialise UI widgets & rendering
    initCountdownTimer();
    initNewsletterPopup();
    bindHeaderEvents();
    renderBestsellers();
    renderSpotlight();
    renderTestimonials();
    renderFaqPreview();
    updateCartUI();
    
    // Bind Promo & Checkout events safely
    bindPromoEvents();
    bindCheckoutEvents();
    bindFooterNewsletterForm(); // Fix: wire up the footer newsletter form
    bindAuthEvents(); // Bind auth modal events

    // SPA Router Setup
    window.addEventListener('hashchange', router);
    router(); // run once on start
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// 5. SPA ROUTER ENGINE
function router() {
    const hash = window.location.hash || '';
    state.searchQuery = ''; // clear search query on routing
    
    // Close search bar & menus
    document.getElementById('search-dropdown').classList.remove('active');
    document.getElementById('nav-menu').classList.remove('active');

    // Parse route and query params
    let view = 'home';
    let productId = null;
    let queryParams = {};

    if (hash.startsWith('#shop')) {
        view = 'shop';
        const queryIndex = hash.indexOf('?');
        if (queryIndex !== -1) {
            const queryStr = hash.substring(queryIndex + 1);
            queryParams = parseQueryParams(queryStr);
        }
    } else if (hash.startsWith('#product/')) {
        view = 'product';
        const parts = hash.split('/');
        productId = parseInt(parts[1]) || null;
    } else if (hash === '#about') {
        view = 'about';
    } else if (hash === '#faq') {
        view = 'faq';
    } else if (hash === '#contact') {
        view = 'contact';
    } else if (hash === '#shipping-policy') {
        view = 'shipping-policy';
    } else if (hash === '#returns-policy') {
        view = 'returns-policy';
    } else if (hash === '#privacy-policy') {
        view = 'privacy-policy';
    } else if (hash === '#terms-conditions') {
        view = 'terms-conditions';
    } else if (hash === '#track-order') {
        view = 'track-order';
    }

    state.currentView = view;
    state.activeProductId = productId;

    // Reset scroll position
    window.scrollTo(0, 0);

    // Toggle main views display
    const homeViewGroup = document.getElementById('home-view-group');
    const dynamicContentContainer = document.getElementById('dynamic-content-container');
    const mobileStickyBar = document.getElementById('mobile-sticky-atc-bar');

    // Remove active class from sticky mobile atc
    mobileStickyBar.classList.remove('active');

    if (view === 'home') {
        homeViewGroup.style.display = 'block';
        dynamicContentContainer.style.display = 'none';
        updateActiveNavLink('home');
    } else {
        homeViewGroup.style.display = 'none';
        dynamicContentContainer.style.display = 'block';
        
        // Render views dynamically
        if (view === 'shop') {
            renderShopCatalog(queryParams.collection || null);
            if (queryParams.collection === 'Men') updateActiveNavLink('shop-men');
            else if (queryParams.collection === 'Women') updateActiveNavLink('shop-women');
            else if (queryParams.collection === 'Kids') updateActiveNavLink('shop-kids');
            else updateActiveNavLink('shop');
        } else if (view === 'product') {
            renderProductPage(productId);
            updateActiveNavLink('shop'); // keep shop link highlighted
        } else if (view === 'track-order') {
            renderTrackOrderPage();
            updateActiveNavLink('track-order');
        } else {
            renderStaticPage(view);
            updateActiveNavLink(view);
        }
    }
}

function parseQueryParams(str) {
    const params = {};
    const pairs = str.split('&');
    for (const pair of pairs) {
        const parts = pair.split('=');
        if (parts.length === 2) {
            params[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
        }
    }
    return params;
}

function updateActiveNavLink(view) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('data-view') === view) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// 6. VIEW RENDERING UTILITIES

// BEST SELLERS ON HOMEPAGE
function renderBestsellers() {
    const bestsellersGrid = document.getElementById('bestsellers-products-grid');
    if (!bestsellersGrid) return;

    const bestsellers = PRODUCTS.filter(p => p.isBestSeller).slice(0, 4);
    
    bestsellersGrid.innerHTML = bestsellers.map(product => `
        <div class="product-card">
            <div class="product-image-container">
                <a href="#product/${product.id}">
                    <img class="product-card-img" src="${product.image}" alt="${product.name}">
                </a>
                <div class="product-badges">
                    ${product.badge ? `<span class="badge badge-gold">${product.badge}</span>` : ''}
                    ${product.comparePrice > product.price ? `<span class="badge badge-sale">SAVE ${Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%</span>` : ''}
                </div>
                <div class="product-action-overlay">
                    <button class="product-quick-add" onclick="handleQuickAdd(${product.id})">
                        <i class="fa-solid fa-cart-plus"></i> Quick Add
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div>
                    <span class="product-category">${product.category}</span>
                    <a href="#product/${product.id}" class="product-name-link">${product.name}</a>
                    <div class="rating-stars">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <span style="color:var(--color-text-muted); font-size:0.75rem; margin-left:6px;">(${product.reviewsCount})</span>
                    </div>
                </div>
                <div class="product-card-footer">
                    <div class="product-price-wrapper">
                        <span class="product-price">â‚¹${product.price.toLocaleString('en-IN')}</span>
                        ${product.comparePrice ? `<span class="product-compare-price">â‚¹${product.comparePrice.toLocaleString('en-IN')}</span>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// HOMEPAGE SPOTLIGHT FEATURE
function renderSpotlight() {
    const spotlightContainer = document.getElementById('spotlight-product-showcase');
    if (!spotlightContainer) return;

    // Use Hoodie (Product ID 2) for Spotlight
    const product = PRODUCTS.find(p => p.id === 2);
    if (!product) return;

    spotlightContainer.innerHTML = `
        <div class="highlight-img-container">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="highlight-content">
            <div class="highlight-urgency">
                <i class="fa-solid fa-fire"></i> HURRY! SELLING OUT FAST
            </div>
            <h3 class="highlight-title">${product.name}</h3>
            <p class="highlight-desc">${product.description}</p>
            <ul class="highlight-specs">
                <li><i class="fa-solid fa-check"></i> Heavyweight 420 GSM French Terry Cotton</li>
                <li><i class="fa-solid fa-check"></i> Double-Lined Hood (No Drawcords)</li>
                <li><i class="fa-solid fa-check"></i> Custom Gold Accented Hardware detailing</li>
            </ul>
            <div class="highlight-actions">
                <span class="detail-price">â‚¹${product.price.toLocaleString('en-IN')}</span>
                <a href="#product/${product.id}" class="btn btn-primary">Customize & Buy Now</a>
            </div>
        </div>
    `;
}

// TESTIMONIALS CAROUSEL
function renderTestimonials() {
    const container = document.getElementById('testimonials-carousel-list');
    if (!container) return;

    container.innerHTML = REVIEWS_MOCK.map(review => `
        <div class="testimonial-card">
            <div class="testimonial-header">
                <div class="rating-stars">
                    ${Array(review.rating).fill('<i class="fa-solid fa-star"></i>').join('')}
                </div>
                <div class="review-verified">
                    <i class="fa-solid fa-circle-check"></i> Verified Buyer
                </div>
            </div>
            <p class="testimonial-quote">"${review.body}"</p>
            <div class="testimonial-user">
                <div class="testimonial-avatar">${review.name.charAt(0)}</div>
                <div>
                    <h4 class="testimonial-name">${review.name}</h4>
                    <span class="testimonial-role">Verified Customer</span>
                </div>
            </div>
        </div>
    `).join('');
}

// HOMEPAGE FAQ PREVIEW
function renderFaqPreview() {
    const container = document.getElementById('faq-accordion-container');
    if (!container) return;

    container.innerHTML = FAQS_MOCK.map((faq, index) => `
        <div class="faq-item">
            <button class="faq-trigger" onclick="toggleFaqAccordion(this)">
                <span>${faq.question}</span>
                <i class="fa-solid fa-chevron-down"></i>
            </button>
            <div class="faq-content">
                <p>${faq.answer}</p>
            </div>
        </div>
    `).join('');
}

// SHOP CATALOG VIEW
function renderShopCatalog(filterCollection = null) {
    const container = document.getElementById('dynamic-content-container');
    
    // Filter products dynamically
    let filteredProducts = PRODUCTS;
    let catalogTitle = 'All Streetwear Drops';

    if (filterCollection) {
        if (filterCollection === 'Men') {
            filteredProducts = PRODUCTS.filter(p => p.category === 'Men');
            catalogTitle = "Men's Collection";
        } else if (filterCollection === 'Women') {
            filteredProducts = PRODUCTS.filter(p => p.category === 'Women');
            catalogTitle = "Women's Collection";
        } else if (filterCollection === 'Kids') {
            filteredProducts = PRODUCTS.filter(p => p.category === 'Kids');
            catalogTitle = "Kids' Collection";
        } else if (filterCollection === 'New Arrivals') {
            filteredProducts = PRODUCTS.filter(p => p.isNew);
            catalogTitle = "New Arrivals";
        } else if (filterCollection === 'Best Sellers') {
            filteredProducts = PRODUCTS.filter(p => p.isBestSeller);
            catalogTitle = "Best Sellers";
        } else if (filterCollection === 'Trending Now') {
            filteredProducts = PRODUCTS.filter(p => p.isTrending);
            catalogTitle = "Trending Now";
        } else if (filterCollection === 'Sale') {
            filteredProducts = PRODUCTS.filter(p => p.comparePrice > p.price);
            catalogTitle = "Sale Items";
        }
    }

    container.innerHTML = `
        <div class="static-page-header">
            <div class="container">
                <h1 class="static-page-title">${catalogTitle}</h1>
                <p style="color:var(--color-text-muted); margin-top:8px; text-transform:uppercase; letter-spacing:0.1em; font-size:0.85rem;">Showing ${filteredProducts.length} premium pieces</p>
            </div>
        </div>
        <section class="section">
            <div class="container">
                <!-- Filters panel -->
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--color-border-light); padding-bottom:20px; margin-bottom:40px; flex-wrap:wrap; gap:16px;">
                    <div style="display:flex; gap:12px; flex-wrap:wrap;">
                        <a href="#shop" class="btn btn-outline-gold ${!filterCollection ? 'btn-primary' : ''}" style="padding: 8px 16px; font-size:0.75rem;">All</a>
                        <a href="#shop?collection=Men" class="btn btn-outline-gold ${filterCollection === 'Men' ? 'btn-primary' : ''}" style="padding: 8px 16px; font-size:0.75rem;">Men</a>
                        <a href="#shop?collection=Women" class="btn btn-outline-gold ${filterCollection === 'Women' ? 'btn-primary' : ''}" style="padding: 8px 16px; font-size:0.75rem;">Women</a>
                        <a href="#shop?collection=Kids" class="btn btn-outline-gold ${filterCollection === 'Kids' ? 'btn-primary' : ''}" style="padding: 8px 16px; font-size:0.75rem;">Kids</a>
                        <a href="#shop?collection=New%20Arrivals" class="btn btn-outline-gold ${filterCollection === 'New Arrivals' ? 'btn-primary' : ''}" style="padding: 8px 16px; font-size:0.75rem;">New Arrivals</a>
                        <a href="#shop?collection=Best%20Sellers" class="btn btn-outline-gold ${filterCollection === 'Best Sellers' ? 'btn-primary' : ''}" style="padding: 8px 16px; font-size:0.75rem;">Best Sellers</a>
                        <a href="#shop?collection=Trending%20Now" class="btn btn-outline-gold ${filterCollection === 'Trending Now' ? 'btn-primary' : ''}" style="padding: 8px 16px; font-size:0.75rem;">Trending</a>
                        <a href="#shop?collection=Sale" class="btn btn-outline-gold ${filterCollection === 'Sale' ? 'btn-primary' : ''}" style="padding: 8px 16px; font-size:0.75rem;">Sale</a>
                    </div>
                </div>

                ${filteredProducts.length === 0 ? `
                    <div style="text-align:center; padding:60px 0; color:var(--color-text-muted);">
                        <i class="fa-solid fa-magnifying-glass" style="font-size:3rem; margin-bottom:16px; color:var(--color-border-light);"></i>
                        <h3>No pieces found</h3>
                        <p style="margin-top:8px;">Check back later for new limited runs.</p>
                    </div>
                ` : `
                    <div class="products-grid">
                        ${filteredProducts.map(product => `
                            <div class="product-card">
                                <div class="product-image-container">
                                    <a href="#product/${product.id}">
                                        <img class="product-card-img" src="${product.image}" alt="${product.name}">
                                    </a>
                                    <div class="product-badges">
                                        ${product.badge ? `<span class="badge badge-gold">${product.badge}</span>` : ''}
                                        ${product.comparePrice > product.price ? `<span class="badge badge-sale">SAVE ${Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%</span>` : ''}
                                    </div>
                                    <div class="product-action-overlay">
                                        <button class="product-quick-add" onclick="handleQuickAdd(${product.id})">
                                            <i class="fa-solid fa-cart-plus"></i> Quick Add
                                        </button>
                                    </div>
                                </div>
                                <div class="product-info">
                                    <div>
                                        <span class="product-category">${product.category} Collection</span>
                                        <a href="#product/${product.id}" class="product-name-link">${product.name}</a>
                                        <div class="rating-stars">
                                            <i class="fa-solid fa-star"></i>
                                            <i class="fa-solid fa-star"></i>
                                            <i class="fa-solid fa-star"></i>
                                            <i class="fa-solid fa-star"></i>
                                            <i class="fa-solid fa-star"></i>
                                            <span style="color:var(--color-text-muted); font-size:0.75rem; margin-left:6px;">(${product.reviewsCount})</span>
                                        </div>
                                    </div>
                                    <div class="product-card-footer">
                                        <div class="product-price-wrapper">
                                            <span class="product-price">â‚¹${product.price.toLocaleString('en-IN')}</span>
                                            ${product.comparePrice ? `<span class="product-compare-price">â‚¹${product.comparePrice.toLocaleString('en-IN')}</span>` : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        </section>
    `;
}

// HELPER FOR WHAT'S INCLUDED (THERABODY-STYLE)
function getWhatsIncluded(product) {
    const defaultItems = [
        {
            icon: "fa-solid fa-shirt",
            name: product.name,
            desc: "The custom-tailored signature silhouette, finished with flatlock seams."
        },
        {
            icon: "fa-solid fa-box-open",
            name: "Eco-Matte Packaging",
            desc: "Premium recycled magnetic-latch storage box with elegant gold script branding."
        },
        {
            icon: "fa-solid fa-scroll",
            name: "Certificate & Booklet",
            desc: "Collectible register card showing unique capsule serial numbering and wash care tips."
        },
        {
            icon: "fa-solid fa-seedling",
            name: "Organic Garment Bag",
            desc: "Reusable organic protective canvas cover designed for secure, breathable clothing storage."
        }
    ];

    if (product.name.includes("Saree") || product.name.includes("Lehnga")) {
        return [
            {
                icon: "fa-solid fa-scissors",
                name: "Unstitched Fabric Set",
                desc: "5.5m premium hand-woven ethnic textile paired with unstitched raw-silk blouse fabric."
            },
            defaultItems[1],
            defaultItems[2],
            defaultItems[3]
        ];
    }

    if (product.name.includes("Set") || product.name.includes("Co-Ord") || product.name.includes("Shirt-Pant")) {
        return [
            {
                icon: "fa-solid fa-cubes",
                name: "Matching Two-Piece Capsule",
                desc: "Complete double-stitched coordinated top piece and straight-leg trousers."
            },
            defaultItems[1],
            defaultItems[2],
            defaultItems[3]
        ];
    }

    return defaultItems;
}

window.toggleSpecsAccordion = function(button) {
    const item = button.parentElement;
    const isActive = item.classList.contains('active');
    
    // Close other specs items
    const allItems = document.querySelectorAll('.specs-accordion-item');
    allItems.forEach(i => i.classList.remove('active'));

    if (!isActive) {
        item.classList.add('active');
    }
};

window.handleProductPageBuyNow = function(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    // Get selections from UI elements
    const selectedColor = document.getElementById('selected-color-label').textContent;
    const selectedSize = document.getElementById('selected-size-label').textContent;
    const quantity = parseInt(document.getElementById('detail-qty-input').value) || 1;

    // Set temp direct checkout item
    state.directCheckoutItem = { product, size: selectedSize, color: selectedColor, quantity };

    // Close Cart Drawer (just in case)
    document.getElementById('cart-drawer-overlay').classList.remove('active');
    document.getElementById('cart-drawer').classList.remove('active');

    // Populate checkout fields using our custom direct checkout item
    populateCheckoutSummary(state.directCheckoutItem);

    // Reset Success Screen state
    document.getElementById('checkout-success-screen').classList.remove('active');

    // Open Checkout Modal
    const checkoutModal = document.getElementById('checkout-modal-container');
    if (checkoutModal) checkoutModal.classList.add('active');
};

// PRODUCT DETAILS PAGE
function renderProductPage(productId) {
    const container = document.getElementById('dynamic-content-container');
    const product = PRODUCTS.find(p => p.id === productId);

    if (!product) {
        container.innerHTML = `
            <div class="container" style="text-align:center; padding:100px 0;">
                <h2>Product Not Found</h2>
                <a href="#shop" class="btn btn-primary" style="margin-top:20px;">Back to Shop</a>
            </div>
        `;
        return;
    }

    // Set mobile sticky ATC bar elements
    document.getElementById('sticky-bar-thumb').src = product.image;
    document.getElementById('sticky-bar-name').textContent = product.name;
    document.getElementById('sticky-bar-price').textContent = `â‚¹${product.price.toLocaleString('en-IN')}`;
    
    // Bind action button on sticky bar
    const stickyAtcBtn = document.getElementById('sticky-bar-add-btn');
    stickyAtcBtn.onclick = () => handleProductPageATC(product.id);

    const whatsIncludedList = getWhatsIncluded(product);

    // Dynamic rendering of Product details layout
    container.innerHTML = `
        <div class="container" style="padding-top:40px;">
            <div style="font-size:0.8rem; color:var(--color-text-muted); margin-bottom:24px; text-transform:uppercase; letter-spacing:0.05em;">
                <a href="#">Home</a> / <a href="#shop">Shop</a> / <a href="#shop?category=${product.category}">${product.category}</a> / <span style="color:var(--color-secondary);">${product.name}</span>
            </div>
            
            <div class="product-detail-layout">
                <!-- Gallery Column -->
                <div class="product-gallery-column">
                    <div class="product-gallery-main">
                        <img id="main-product-image" src="${product.image}" alt="${product.name}">
                    </div>
                </div>

                <!-- Product Info Column -->
                <div class="product-info-column">
                    <span class="detail-category">${product.category} Drop</span>
                    <h1 class="detail-title">${product.name}</h1>
                    
                    <div class="detail-rating">
                        <div class="rating-stars">
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                        </div>
                        <span class="detail-rating-text">${product.rating} / 5.0 (${product.reviewsCount} verified reviews)</span>
                    </div>

                    <div class="detail-price-box">
                        <span class="detail-price">â‚¹${product.price.toLocaleString('en-IN')}</span>
                        ${product.comparePrice ? `<span class="detail-compare-price">â‚¹${product.comparePrice.toLocaleString('en-IN')}</span>` : ''}
                        <span class="badge badge-sale">SAVE â‚¹${(product.comparePrice - product.price).toLocaleString('en-IN')}</span>
                    </div>

                    <div class="detail-stock-urgency">
                        <div>
                            <i class="fa-solid fa-hourglass-half"></i> <strong>LIMITED PIECES LEFT:</strong> Only <span style="font-weight:700;">${product.stock} items</span> left in stock!
                            <div class="detail-stock-bar">
                                <div class="detail-stock-progress" style="width: ${(product.stock / 15) * 100}%"></div>
                            </div>
                        </div>
                    </div>

                    <form id="product-options-form" onsubmit="event.preventDefault();">
                        <!-- Colors -->
                        <div class="option-group">
                            <div class="option-title">Color: <span id="selected-color-label">${product.colors[0].name}</span></div>
                            <div class="swatch-list">
                                ${product.colors.map((color, i) => `
                                    <div class="color-swatch ${i === 0 ? 'active' : ''}" 
                                         onclick="selectColorSwatch(this, '${color.name}')" 
                                         title="${color.name}">
                                        <span style="background-color: ${color.hex};"></span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Sizes -->
                        <div class="option-group">
                            <div class="option-title">Size: <span id="selected-size-label">${product.sizes[0]}</span></div>
                            <div class="size-selector">
                                ${product.sizes.map((size, i) => `
                                    <div class="size-pill ${i === 0 ? 'active' : ''}" 
                                         onclick="selectSizePill(this, '${size}')">
                                        ${size}
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Quantity and Buy (Therabody Style) -->
                        <div class="qty-buy-box" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
                            <div style="display: flex; gap: 16px; width: 100%;">
                                <div class="qty-selector">
                                    <button type="button" class="qty-btn" onclick="adjustProductPageQty(-1)"><i class="fa-solid fa-minus"></i></button>
                                    <input type="text" class="qty-input" id="detail-qty-input" value="1" readonly>
                                    <button type="button" class="qty-btn" onclick="adjustProductPageQty(1)"><i class="fa-solid fa-plus"></i></button>
                                </div>
                                <div class="buy-btn-wrapper" style="flex-grow: 1;">
                                    <button type="button" class="btn btn-primary btn-full" onclick="handleProductPageATC(${product.id})">
                                        <i class="fa-solid fa-bag-shopping" style="margin-right:10px;"></i> Add to Bag
                                    </button>
                                </div>
                            </div>
                            <button type="button" class="btn btn-buy-now btn-full" onclick="handleProductPageBuyNow(${product.id})">
                                <i class="fa-solid fa-bolt" style="margin-right:10px; color:var(--color-accent);"></i> Buy Now (Express Checkout)
                            </button>
                        </div>
                    </form>

                    <!-- Shipping Snippet -->
                    <div style="margin-top:20px; margin-bottom:20px; padding:16px; background:var(--color-secondary); border:1px solid var(--color-border-light); border-radius:var(--border-radius-md); font-size:0.8rem; display:flex; flex-direction:column; gap:8px; color:var(--color-text-dark); line-height:1.4;">
                        <div style="display:flex; align-items:center; gap:10px;"><i class="fa-solid fa-truck" style="color:var(--color-accent); font-size:1rem; width:18px;"></i> <span><strong>FREE Express Shipping</strong> pan-India (No Minimum)</span></div>
                        <div style="display:flex; align-items:center; gap:10px;"><i class="fa-solid fa-box" style="color:var(--color-accent); font-size:1rem; width:18px;"></i> <span><strong>Processing:</strong> Dispatched within 24 Hours</span></div>
                        <div style="display:flex; align-items:center; gap:10px;"><i class="fa-solid fa-calendar-days" style="color:var(--color-accent); font-size:1rem; width:18px;"></i> <span><strong>Delivery:</strong> 3-5 Business Days across India</span></div>
                    </div>

                    <!-- Trust factors -->
                    <div class="detail-trust" style="margin-bottom:24px;">
                        <div class="detail-trust-list">
                            <div class="detail-trust-item"><i class="fa-solid fa-shield"></i> 100% Secured Payment Gateway</div>
                            <div class="detail-trust-item"><i class="fa-solid fa-arrows-rotate"></i> 14-Day Free Exchange Swaps</div>
                            <div class="detail-trust-item"><i class="fa-solid fa-seedling"></i> Eco Protective Garment Cover</div>
                        </div>
                    </div>

                    <!-- Specifications Accordion (Therabody Style) -->
                    <div class="specs-accordion">
                        <div class="specs-accordion-item active">
                            <button class="specs-accordion-trigger" onclick="toggleSpecsAccordion(this)">
                                <span>Overview & Description</span>
                                <i class="fa-solid fa-chevron-down"></i>
                            </button>
                            <div class="specs-accordion-content" style="max-height: 500px;">
                                <p style="padding: 16px 0; font-size:0.85rem; line-height:1.6; color:var(--color-text-muted);">${product.description}</p>
                            </div>
                        </div>
                        <div class="specs-accordion-item">
                            <button class="specs-accordion-trigger" onclick="toggleSpecsAccordion(this)">
                                <span>Key Benefits</span>
                                <i class="fa-solid fa-chevron-down"></i>
                            </button>
                            <div class="specs-accordion-content">
                                <ul style="padding: 16px 20px; font-size:0.85rem; color:var(--color-text-muted); line-height:1.6; list-style-type: disc;">
                                    ${product.benefits.map(b => `<li style="margin-bottom:8px;">${b}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                        <div class="specs-accordion-item">
                            <button class="specs-accordion-trigger" onclick="toggleSpecsAccordion(this)">
                                <span>Features & Materials</span>
                                <i class="fa-solid fa-chevron-down"></i>
                            </button>
                            <div class="specs-accordion-content">
                                <ul style="padding: 16px 20px; font-size:0.85rem; color:var(--color-text-muted); line-height:1.6; list-style-type: square;">
                                    ${product.features.map(f => `<li style="margin-bottom:8px;">${f}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                        <div class="specs-accordion-item">
                            <button class="specs-accordion-trigger" onclick="toggleSpecsAccordion(this)">
                                <span>Technical Details</span>
                                <i class="fa-solid fa-chevron-down"></i>
                            </button>
                            <div class="specs-accordion-content" style="padding: 12px 16px 0 16px;">
                                <table class="specs-table">
                                    ${Object.entries(product.specs).map(([key, val]) => `
                                        <tr>
                                            <td>${key}</td>
                                            <td>${val}</td>
                                        </tr>
                                    `).join('')}
                                </table>
                            </div>
                        </div>
                        <div class="specs-accordion-item">
                            <button class="specs-accordion-trigger" onclick="toggleSpecsAccordion(this)">
                                <span>Complimentary Logistics</span>
                                <i class="fa-solid fa-chevron-down"></i>
                            </button>
                            <div class="specs-accordion-content" style="padding: 16px 0; font-size:0.85rem; color:var(--color-text-muted); line-height:1.6;">
                                <p><strong>Express Delivery:</strong> Complimentary express logistics pan-India. Dispatched within 24 hours. Transit averages 3-5 business days.</p>
                                <p style="margin-top:12px;"><strong>Swaps & Returns:</strong> Hassle-free 14-day reverse collections for size exchanges or swaps.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- What's Included Section (Therabody Style) -->
            <div class="whats-included-container">
                <h3 class="whats-included-title">What's in the Box</h3>
                <div class="whats-included-grid">
                    ${whatsIncludedList.map(item => `
                        <div class="whats-included-item">
                            <i class="${item.icon} whats-included-icon"></i>
                            <h4 class="whats-included-name">${item.name}</h4>
                            <p class="whats-included-desc">${item.desc}</p>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Product Reviews Section -->
            <div class="reviews-section">
                <h3 style="font-size:1.4rem; color:var(--color-secondary); margin-bottom:30px;">Customer Feedback</h3>
                <div class="reviews-summary-card">
                    <div class="reviews-score">
                        <div class="score-num">${product.rating}</div>
                        <div class="rating-stars" style="justify-content:center; margin:10px 0;">
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                        </div>
                        <span style="color:var(--color-text-muted); font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Based on ${product.reviewsCount} reviews</span>
                    </div>
                    <div class="reviews-breakdown">
                        <div class="breakdown-row">
                            <span style="width:30px;">5â˜…</span>
                            <div class="breakdown-bar"><div class="breakdown-progress" style="width: 85%;"></div></div>
                            <span style="width:30px; text-align:right;">85%</span>
                        </div>
                        <div class="breakdown-row">
                            <span style="width:30px;">4â˜…</span>
                            <div class="breakdown-bar"><div class="breakdown-progress" style="width: 10%;"></div></div>
                            <span style="width:30px; text-align:right;">10%</span>
                        </div>
                        <div class="breakdown-row">
                            <span style="width:30px;">3â˜…</span>
                            <div class="breakdown-bar"><div class="breakdown-progress" style="width: 5%;"></div></div>
                            <span style="width:30px; text-align:right;">5%</span>
                        </div>
                        <div class="breakdown-row">
                            <span style="width:30px;">2â˜…</span>
                            <div class="breakdown-bar"><div class="breakdown-progress" style="width: 0%;"></div></div>
                            <span style="width:30px; text-align:right;">0%</span>
                        </div>
                    </div>
                </div>

                <div class="reviews-list">
                    ${REVIEWS_MOCK.map(review => `
                        <div class="review-item">
                            <div class="review-item-header">
                                <div class="review-user-info">
                                    <span class="review-user-name">${review.name}</span>
                                    ${review.verified ? `<span class="review-verified"><i class="fa-solid fa-circle-check"></i> Verified</span>` : ''}
                                </div>
                                <span class="review-date">${review.date}</span>
                            </div>
                            <div class="rating-stars" style="margin-bottom:8px;">
                                ${Array(review.rating).fill('<i class="fa-solid fa-star"></i>').join('')}
                            </div>
                            <h4 class="review-title">${review.title}</h4>
                            <p class="review-body">${review.body}</p>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Related Products Section -->
            <div style="margin-top:80px; border-top:1px solid var(--color-border-dark); padding-top:60px; padding-bottom:60px;">
                <h3 style="font-size:1.4rem; color:var(--color-secondary); margin-bottom:40px; text-align:center;">Related Drops</h3>
                <div class="products-grid">
                    ${PRODUCTS.filter(p => p.id !== product.id).slice(0, 4).map(relProd => `
                        <div class="product-card">
                            <div class="product-image-container">
                                <a href="#product/${relProd.id}">
                                    <img class="product-card-img" src="${relProd.image}" alt="${relProd.name}">
                                </a>
                                <div class="product-badges">
                                    ${relProd.badge ? `<span class="badge badge-gold">${relProd.badge}</span>` : ''}
                                </div>
                            </div>
                            <div class="product-info">
                                <div>
                                    <span class="product-category">${relProd.category}</span>
                                    <a href="#product/${relProd.id}" class="product-name-link">${relProd.name}</a>
                                </div>
                                <div class="product-card-footer">
                                    <span class="product-price">â‚¹${relProd.price.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    // Active sticky ATC bar toggle on scroll
    window.addEventListener('scroll', handleStickyBarScroll);
}

// STATIC PAGES RENDERING
function renderStaticPage(view) {
    const container = document.getElementById('dynamic-content-container');
    
    let title = '';
    let bodyHtml = '';

    switch(view) {
        case 'about':
            title = 'Our Story';
            bodyHtml = `
                <p>Born out of local street style in 2026, <strong>Urban Vogue</strong> represents the intersection of luxury craftsmanship and modern minimalist streetwear.</p>
                <p>We believe that luxury shouldn't be fragile. Every silhouette we launch is developed from the ground up: selecting ultra-heavyweight cotton knits, testing structured drape lines, and tailoring components right here in India.</p>
                <h3>Meticulous Materials</h3>
                <p>Our focus is entirely on tactile excellence. From 280 GSM preshrunk cotton tees to thick 420 GSM hoodies, our garments are thick, structured, and soft. We source heavy zippers, sturdy drawstring tips, and detailed embroidery threads to ensure that every piece is built like armor.</p>
                <h3>Limited Capsules</h3>
                <p>We reject mass production. We design and manufacture in restricted small batches (drops) to control quality and ensure exclusivity. When a drop sells out, it is rarely brought back in the same configuration.</p>
            `;
            break;
        case 'faq':
            title = 'Frequently Asked Questions';
            bodyHtml = `
                <div class="faq-accordion">
                    ${FAQS_MOCK.map((faq, i) => `
                        <div class="faq-item">
                            <button class="faq-trigger" onclick="toggleFaqAccordion(this)">
                                <span>${faq.question}</span>
                                <i class="fa-solid fa-chevron-down"></i>
                            </button>
                            <div class="faq-content">
                                <p>${faq.answer}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            break;
        case 'contact':
            title = 'Contact Us';
            bodyHtml = `
                <p style="text-align:center; max-width:600px; margin: 0 auto 30px;">Got a question about size fits, custom orders, or shipping timelines? Drop us a line below or reach out directly.</p>
                <div class="contact-grid">
                    <div class="contact-info-card">
                        <h3 style="margin-top:0;">Corporate Showroom</h3>
                        <p style="font-size:0.9rem; color:var(--color-text-muted);">Visitors by appointment only.</p>
                        <ul class="contact-details-list">
                            <li class="contact-detail-row">
                                <i class="fa-solid fa-location-dot"></i>
                                <div>
                                    <div class="contact-detail-title">Address</div>
                                    <div class="contact-detail-val">Urban Vogue Studio, Phase 5, Udyog Vihar, Gurugram, Haryana, India - 122016</div>
                                </div>
                            </li>
                            <li class="contact-detail-row">
                                <i class="fa-solid fa-envelope"></i>
                                <div>
                                    <div class="contact-detail-title">Email support</div>
                                    <div class="contact-detail-val">support@urbanvogue.in</div>
                                </div>
                            </li>
                            <li class="contact-detail-row">
                                <i class="fa-solid fa-phone"></i>
                                <div>
                                    <div class="contact-detail-title">Phone lines</div>
                                    <div class="contact-detail-val">+91 98765 43210 (Mon-Sat, 10 AM to 6 PM)</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <form id="contact-form" onsubmit="handleContactSubmit(event)" style="display:flex; flex-direction:column; gap:16px;">
                            <div>
                                <label class="checkout-label" for="contact-name">Full Name</label>
                                <input type="text" id="contact-name" class="checkout-input" placeholder="Your Name" required>
                            </div>
                            <div>
                                <label class="checkout-label" for="contact-email">Email Address</label>
                                <input type="email" id="contact-email" class="checkout-input" placeholder="name@email.com" required>
                            </div>
                            <div>
                                <label class="checkout-label" for="contact-message">How can we help?</label>
                                <textarea id="contact-message" class="checkout-input" rows="5" style="resize:none;" placeholder="Message details..." required></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">Send Inquiry</button>
                        </form>
                    </div>
                </div>
            `;
            break;
        case 'shipping-policy':
            title = 'Shipping Policy';
            bodyHtml = `
                <p>Urban Vogue provides complimentary express shipping across India on all domestic orders. There are no minimum order requirements for free shipping.</p>
                <h3>Timelines</h3>
                <p>Orders placed before 2 PM IST are dispatched on the same business day. Delivery times average 2-3 business days for major Indian metro cities (Delhi NCR, Mumbai, Bengaluru, Kolkata, Chennai, Hyderabad) and 4-5 business days for other regional pins.</p>
                <h3>Tracking</h3>
                <p>Once your order has been dispatched, a tracking confirmation email and WhatsApp text will be sent to you containing a direct tracking URL to monitor status.</p>
            `;
            break;
        case 'returns-policy':
            title = 'Returns & Refund Policy';
            bodyHtml = `
                <p>We want you to love your fit. Urban Vogue offers a 14-day exchange and return policy for all unworn, unwashed items in their original packaging with tags intact.</p>
                <h3>How to request a size swap?</h3>
                <p>Simply navigate to our support portal or email us at <strong>exchanges@urbanvogue.in</strong> with your Order Number and preferred sizing. We will arrange a reverse courier pick-up from your home within 24-48 hours at zero cost to you.</p>
                <h3>Refunds</h3>
                <p>Once your return is inspected at our Gurugram warehouse, refunds are initiated within 48 hours. Bank account refunds or UPI credit reflections take 3-5 business days depending on banking partners. Store credit codes are issued instantly.</p>
            `;
            break;
        case 'privacy-policy':
            title = 'Privacy Policy';
            bodyHtml = `
                <p>Urban Vogue respects your personal information. This Privacy Policy details how we collect, use, and secure user information when you browse our storefront or complete purchase transitions.</p>
                <h3>Information Collection</h3>
                <p>We collect essential billing inputs (Email, Phone, First/Last Name, Delivery Address) during checkout to process orders. Payments are processed securely via encrypted, PCI-compliant gateways; we do not store CVVs or card credentials on our servers.</p>
                <h3>Cookie policies</h3>
                <p>We utilize browser cookies to track cart items, manage user sessions, and gather analytics data via search configurations to optimize conversion rates.</p>
            `;
            break;
        case 'terms-conditions':
            title = 'Terms & Conditions';
            bodyHtml = `
                <p>Welcome to Urban Vogue. These Terms & Conditions outline the conditions governing browsing activities, orders, product access, and policy bounds of our storefront.</p>
                <h3>Ordering bounds</h3>
                <p>By placing an order, you confirm that you are at least 18 years of age and reside inside eligible shipping locations. We reserve the right to decline orders in cases of security flags, incorrect pricing listings, or supply limitations.</p>
                <h3>Intellectual Property</h3>
                <p>All graphical assets, logo identifiers, typography configurations, page structures, and clothing designs are protected under Indian Copyright and Trademark legislation.</p>
            `;
            break;
    }

    container.innerHTML = `
        <div class="static-page-header">
            <div class="container">
                <h1 class="static-page-title">${title}</h1>
            </div>
        </div>
        <div class="container">
            <div class="static-page-body">
                ${bodyHtml}
            </div>
        </div>
    `;
}

// 7. INTERACTIVE DESIGN TRIGGERS

// URGENCY TIMER FOR ANNOUNCEMENT
function initCountdownTimer() {
    let hours = 2, minutes = 45, seconds = 0;
    const timerSpan = document.getElementById('announcement-timer');
    if (!timerSpan) return;

    setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) {
                if (hours === 0) {
                    // reset timer to keep mockup ticking
                    hours = 2; minutes = 59; seconds = 59;
                } else {
                    hours--; minutes = 59; seconds = 59;
                }
            } else {
                minutes--; seconds = 59;
            }
        } else {
            seconds--;
        }

        const hStr = String(hours).padStart(2, '0');
        const mStr = String(minutes).padStart(2, '0');
        const sStr = String(seconds).padStart(2, '0');

        timerSpan.textContent = `${hStr}h ${mStr}m ${sStr}s`;
    }, 1000);
}

// NEWSLETTER MODAL CAPTURE POPUP
function initNewsletterPopup() {
    const popup = document.getElementById('email-signup-popup');
    const closeBtn = document.getElementById('popup-close-btn');
    const form = document.getElementById('popup-email-form');

    if (!popup) return;

    // Trigger popup after 4 seconds (CRO strategy)
    const isSubscribed = SafeStorage.getItem('localStorage', 'uv_subscribed');
    const isPopupDismissed = SafeStorage.getItem('sessionStorage', 'uv_popup_dismissed');

    if (!isSubscribed && !isPopupDismissed) {
        setTimeout(() => {
            popup.classList.add('active');
        }, 4000);
    }

    closeBtn.onclick = () => {
        popup.classList.remove('active');
        SafeStorage.setItem('sessionStorage', 'uv_popup_dismissed', 'true');
    };

    form.onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('popup-email-input').value;
        try {
            await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
        } catch (err) {
            console.warn('Newsletter API error:', err);
        }
        SafeStorage.setItem('localStorage', 'uv_subscribed', 'true');
        SafeStorage.setItem('localStorage', 'uv_subscriber_email', email);
        popup.classList.remove('active');
        showToast('Success! Check your email for your 10% coupon code.', 'success');
    };

    // Exit intent trigger
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY < 20 && !SafeStorage.getItem('localStorage', 'uv_subscribed') && !SafeStorage.getItem('sessionStorage', 'uv_popup_dismissed')) {
            popup.classList.add('active');
        }
    });
}

// HEADER LOGIC (STICKY SEARCH, MENU TOGGLES)
function bindHeaderEvents() {
    const searchToggle = document.getElementById('search-toggle-btn');
    const searchDropdown = document.getElementById('search-dropdown');
    const searchInput = document.getElementById('search-query-input');
    const searchSubmit = document.getElementById('search-submit-btn');

    const cartToggle = document.getElementById('cart-toggle-btn');
    const cartClose = document.getElementById('cart-close-btn');
    const cartOverlay = document.getElementById('cart-drawer-overlay');
    const cartDrawer = document.getElementById('cart-drawer');

    const mobileToggle = document.getElementById('mobile-nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    // Search Toggle
    searchToggle.onclick = (e) => {
        e.stopPropagation();
        searchDropdown.classList.toggle('active');
        if (searchDropdown.classList.contains('active')) {
            searchInput.focus();
        }
    };

    searchInput.onkeyup = (e) => {
        if (e.key === 'Enter') {
            triggerSearch(searchInput.value);
        }
    };

    searchSubmit.onclick = () => {
        triggerSearch(searchInput.value);
    };

    // Cart Drawer Toggle
    cartToggle.onclick = () => {
        cartOverlay.classList.add('active');
        cartDrawer.classList.add('active');
    };

    const closeCartFn = () => {
        cartOverlay.classList.remove('active');
        cartDrawer.classList.remove('active');
    };

    cartClose.onclick = closeCartFn;
    cartOverlay.onclick = closeCartFn;

    // Mobile Menu Toggle
    mobileToggle.onclick = () => {
        navMenu.classList.toggle('active');
    };

    // Intercept search clicking anywhere to close
    document.addEventListener('click', (e) => {
        if (!searchDropdown.contains(e.target) && e.target !== searchToggle) {
            searchDropdown.classList.remove('active');
        }
    });
}

function triggerSearch(query) {
    if (!query.trim()) return;
    window.location.hash = `#shop`;
    
    // Slight delay to allow catalog page rendering before injection
    setTimeout(() => {
        const container = document.getElementById('dynamic-content-container');
        const queryLower = query.toLowerCase().trim();
        const matches = PRODUCTS.filter(p => 
            p.name.toLowerCase().includes(queryLower) || 
            p.category.toLowerCase().includes(queryLower) ||
            p.description.toLowerCase().includes(queryLower)
        );

        container.innerHTML = `
            <div class="static-page-header">
                <div class="container">
                    <h1 class="static-page-title">Search Results</h1>
                    <p style="color:var(--color-text-muted); margin-top:8px; text-transform:uppercase; letter-spacing:0.1em; font-size:0.85rem;">Showing ${matches.length} matches for "${query}"</p>
                </div>
            </div>
            <section class="section">
                <div class="container">
                    <div style="margin-bottom:40px;">
                        <a href="#shop" class="btn btn-outline-gold" style="padding: 8px 16px; font-size:0.75rem;"><i class="fa-solid fa-arrow-left"></i> View All Drops</a>
                    </div>
                    ${matches.length === 0 ? `
                        <div style="text-align:center; padding:60px 0; color:var(--color-text-muted);">
                            <i class="fa-solid fa-magnifying-glass" style="font-size:3rem; margin-bottom:16px; color:var(--color-border-dark);"></i>
                            <h3>No matches found</h3>
                            <p style="margin-top:8px;">Try searching for "hoodie", "tee", "sneakers", or "cargo".</p>
                        </div>
                    ` : `
                        <div class="products-grid">
                            ${matches.map(product => `
                                <div class="product-card">
                                    <div class="product-image-container">
                                        <a href="#product/${product.id}">
                                            <img class="product-card-img" src="${product.image}" alt="${product.name}">
                                        </a>
                                        <div class="product-badges">
                                            ${product.badge ? `<span class="badge badge-gold">${product.badge}</span>` : ''}
                                        </div>
                                    </div>
                                    <div class="product-info">
                                        <div>
                                            <span class="product-category">${product.category}</span>
                                            <a href="#product/${product.id}" class="product-name-link">${product.name}</a>
                                        </div>
                                        <div class="product-card-footer">
                                            <span class="product-price">â‚¹${product.price.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
            </section>
        `;
    }, 50);
}

// FAQ Accordion Toggle
function toggleFaqAccordion(button) {
    const item = button.parentElement;
    const isActive = item.classList.contains('active');
    
    // Close other FAQ items
    const allItems = document.querySelectorAll('.faq-item');
    allItems.forEach(i => i.classList.remove('active'));

    if (!isActive) {
        item.classList.add('active');
    }
}

// PRODUCT PAGE GALLERY SWITCHER
window.switchProductImage = function(src, thumbElement) {
    document.getElementById('main-product-image').src = src;
    
    const thumbs = document.querySelectorAll('.gallery-thumb');
    thumbs.forEach(t => t.classList.remove('active'));
    thumbElement.classList.add('active');
};

// TAB SWITCHER
window.switchProductTab = function(btn, panelId) {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    const panels = document.querySelectorAll('.tab-panel');
    panels.forEach(p => p.classList.remove('active'));
    document.getElementById(panelId).classList.add('active');
};

// OPTION SWATCH SELECTORS
window.selectColorSwatch = function(swatch, colorName) {
    const swatches = swatch.parentElement.querySelectorAll('.color-swatch');
    swatches.forEach(s => s.classList.remove('active'));
    swatch.classList.add('active');

    document.getElementById('selected-color-label').textContent = colorName;
};

window.selectSizePill = function(pill, sizeName) {
    const pills = pill.parentElement.querySelectorAll('.size-pill');
    pills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    document.getElementById('selected-size-label').textContent = sizeName;
};

// QUANTITY ADJUSTERS
window.adjustProductPageQty = function(amount) {
    const qtyInput = document.getElementById('detail-qty-input');
    let val = parseInt(qtyInput.value) || 1;
    val += amount;
    if (val < 1) val = 1;
    qtyInput.value = val;
};

// STICKY BOTTOM ATC SCROLL BINDING
function handleStickyBarScroll() {
    const productDetailLayout = document.querySelector('.product-detail-layout');
    const stickyBar = document.getElementById('mobile-sticky-atc-bar');
    if (!productDetailLayout || !stickyBar) return;

    const layoutRect = productDetailLayout.getBoundingClientRect();
    const isMobile = window.innerWidth <= 768;

    // Show sticky bar on mobile when the main details buy button scrolls out of view
    if (isMobile && layoutRect.bottom < 150) {
        stickyBar.classList.add('active');
    } else {
        stickyBar.classList.remove('active');
    }
}

// 8. CART DRAWER OPERATIONS ENGINE

function updateCartUI() {
    const listContainer = document.getElementById('cart-items-list-container');
    const badgeCount = document.getElementById('cart-badge-count');
    const upsellContainer = document.getElementById('cart-upsell-container');
    const subtotalText = document.getElementById('cart-subtotal-value');
    const discountRow = document.getElementById('cart-discount-row');
    const discountText = document.getElementById('cart-discount-value');
    const totalText = document.getElementById('cart-total-value');

    // Sync state to local storage
    SafeStorage.setItem('localStorage', 'uv_cart', JSON.stringify(state.cart));

    // Update Badge
    const totalQty = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    badgeCount.textContent = totalQty;
    badgeCount.style.display = totalQty > 0 ? 'flex' : 'none';

    // Render items list
    if (state.cart.length === 0) {
        listContainer.innerHTML = `
            <div class="cart-empty-message">
                <i class="fa-solid fa-bag-shopping"></i>
                <p>Your bag is currently empty.</p>
                <a href="#shop" class="btn btn-outline-gold" style="margin-top:16px; display:inline-block; padding: 10px 20px; font-size:0.75rem;">Shop the Drop</a>
            </div>
        `;
        upsellContainer.style.display = 'none';
        subtotalText.textContent = "â‚¹0";
        discountRow.style.display = 'none';
        totalText.textContent = "â‚¹0";
        updateShippingProgress(0);
        return;
    }

    // Render active cart items
    listContainer.innerHTML = state.cart.map((item, index) => `
        <div class="cart-item">
            <img class="cart-item-img" src="${item.product.image}" alt="${item.product.name}">
            <div class="cart-item-details">
                <div>
                    <h4 class="cart-item-name">${item.product.name}</h4>
                    <div class="cart-item-meta">Size: ${item.size} | Color: ${item.color}</div>
                </div>
                <div class="cart-item-qty-price">
                    <div class="cart-qty-selector">
                        <button class="cart-qty-btn" onclick="adjustCartItemQty(${index}, -1)"><i class="fa-solid fa-minus"></i></button>
                        <span class="cart-qty-val">${item.quantity}</span>
                        <button class="cart-qty-btn" onclick="adjustCartItemQty(${index}, 1)"><i class="fa-solid fa-plus"></i></button>
                    </div>
                    <span class="cart-item-price">â‚¹${(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeCartItem(${index})" aria-label="Remove item"><i class="fa-solid fa-trash-can"></i></button>
        </div>
    `).join('');

    // Compute prices
    const subtotal = state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    subtotalText.textContent = `â‚¹${subtotal.toLocaleString('en-IN')}`;

    // Apply Coupon deductions
    let discount = 0;
    if (state.discountCode === 'VOGUE10') {
        discount = Math.round(subtotal * 0.1);
        discountRow.style.display = 'flex';
        discountText.textContent = `-â‚¹${discount.toLocaleString('en-IN')}`;
    } else {
        discountRow.style.display = 'none';
    }

    const total = subtotal - discount;
    totalText.textContent = `â‚¹${total.toLocaleString('en-IN')}`;

    // Update shipping progress bar towards Free Shipping target of â‚¹1,500
    updateShippingProgress(subtotal);

    // Dynamic cart upsells rendering (CRO Strategy)
    // Find accessory items (ID 5: Cap, 6: Bag) not currently in the cart
    const capInCart = state.cart.some(item => item.product.id === 5);
    const bagInCart = state.cart.some(item => item.product.id === 6);
    
    let upsellProduct = null;
    if (!capInCart) {
        upsellProduct = PRODUCTS.find(p => p.id === 5);
    } else if (!bagInCart) {
        upsellProduct = PRODUCTS.find(p => p.id === 6);
    }

    if (upsellProduct) {
        upsellContainer.style.display = 'block';
        upsellContainer.innerHTML = `
            <div class="upsell-header"><i class="fa-solid fa-percent"></i> Complete your look & save</div>
            <div class="upsell-product">
                <img class="upsell-img" src="${upsellProduct.image}" alt="${upsellProduct.name}">
                <div class="upsell-info">
                    <h4 class="upsell-title">${upsellProduct.name}</h4>
                    <span class="upsell-price">â‚¹${upsellProduct.price.toLocaleString('en-IN')} <span style="text-decoration:line-through; font-size:0.7rem; color:var(--color-text-muted);">â‚¹${upsellProduct.comparePrice.toLocaleString('en-IN')}</span></span>
                </div>
                <button class="upsell-add-btn" onclick="addUpsellToCart(${upsellProduct.id})">Add</button>
            </div>
        `;
    } else {
        upsellContainer.style.display = 'none';
    }
}

function updateShippingProgress(subtotal) {
    const progressText = document.getElementById('cart-progress-text');
    const progressBarFill = document.getElementById('cart-progress-bar-fill');
    const target = 1500;

    if (subtotal >= target) {
        progressText.innerHTML = `ðŸŽ‰ <strong>CONGRATULATIONS!</strong> You've unlocked <strong>FREE Express Shipping</strong>!`;
        progressBarFill.style.width = '100%';
    } else {
        const diff = target - subtotal;
        progressText.innerHTML = `Add <span>â‚¹${diff.toLocaleString('en-IN')}</span> more for <strong>FREE Express Shipping</strong>!`;
        progressBarFill.style.width = `${(subtotal / target) * 100}%`;
    }
}

// 9. DYNAMIC EVENT ACTIONS

window.handleQuickAdd = function(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    // Pick first size and color option by default for quick add
    const selectedSize = product.sizes[0];
    const selectedColor = product.colors[0].name;

    addItemToCart(product, selectedSize, selectedColor, 1);
    
    // Auto slide open the cart drawer
    document.getElementById('cart-drawer-overlay').classList.add('active');
    document.getElementById('cart-drawer').classList.add('active');
};

window.handleProductPageATC = function(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    // Get selections from UI elements
    const selectedColor = document.getElementById('selected-color-label').textContent;
    const selectedSize = document.getElementById('selected-size-label').textContent;
    const quantity = parseInt(document.getElementById('detail-qty-input').value) || 1;

    addItemToCart(product, selectedSize, selectedColor, quantity);
    
    // Reset quantity input to 1
    document.getElementById('detail-qty-input').value = 1;

    // Open Cart Drawer
    document.getElementById('cart-drawer-overlay').classList.add('active');
    document.getElementById('cart-drawer').classList.add('active');
};

window.addUpsellToCart = function(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const size = product.sizes[0];
    const color = product.colors[0].name;

    addItemToCart(product, size, color, 1);
    showToast(`${product.name} added to bag!`, "success");
};

function addItemToCart(product, size, color, qty) {
    // Check if duplicate item exists
    const duplicateIndex = state.cart.findIndex(item => 
        item.product.id === product.id && 
        item.size === size && 
        item.color === color
    );

    if (duplicateIndex !== -1) {
        state.cart[duplicateIndex].quantity += qty;
    } else {
        state.cart.push({ product, size, color, quantity: qty });
    }

    updateCartUI();
    showToast(`Added ${product.name} to bag.`, "success");
}

window.adjustCartItemQty = function(index, amount) {
    if (!state.cart[index]) return;

    state.cart[index].quantity += amount;
    if (state.cart[index].quantity <= 0) {
        state.cart.splice(index, 1);
    }

    updateCartUI();
};

window.removeCartItem = function(index) {
    if (!state.cart[index]) return;
    
    const removedName = state.cart[index].product.name;
    state.cart.splice(index, 1);
    updateCartUI();
    showToast(`Removed ${removedName} from bag.`, "info");
};

// PROMO COUPON LOGIC
function bindPromoEvents() {
    const promoBtn = document.getElementById('cart-promo-apply-btn');
    if (promoBtn) {
        promoBtn.onclick = () => {
            const promoInput = document.getElementById('cart-promo-input');
            if (!promoInput) return;
            const input = promoInput.value.toUpperCase().trim();
            if (input === 'VOGUE10') {
                state.discountCode = 'VOGUE10';
                SafeStorage.setItem('localStorage', 'uv_discount', 'VOGUE10');
                updateCartUI();
                showToast("Coupon VOGUE10 applied successfully! Saved 10%.", "success");
            } else {
                showToast("Invalid Promo Code.", "error");
            }
        };
    }
}

// 10. CHECKOUT MODAL LOGIC & FORM VALIDATIONS
function bindCheckoutEvents() {
    const checkoutModal = document.getElementById('checkout-modal-container');
    const checkoutOpenBtn = document.getElementById('cart-checkout-btn');
    const checkoutCancelBtn = document.getElementById('checkout-cancel-btn');
    const checkoutCloseTop = document.getElementById('checkout-close-top');
    const checkoutForm = document.getElementById('checkout-form-element');
    const successHomeBtn = document.getElementById('success-home-btn');

    if (checkoutOpenBtn) {
        checkoutOpenBtn.onclick = () => {
            // Make sure cart is not empty
            if (state.cart.length === 0) {
                showToast("Please add items to your cart first.", "error");
                return;
            }

            // Close Cart Drawer
            document.getElementById('cart-drawer-overlay').classList.remove('active');
            document.getElementById('cart-drawer').classList.remove('active');

            // Populate checkout fields
            populateCheckoutSummary();

            // Reset Success Screen state
            document.getElementById('checkout-success-screen').classList.remove('active');

            // Open Modal
            if (checkoutModal) checkoutModal.classList.add('active');
        };
    }

    const closeCheckoutFn = () => {
        if (checkoutModal) checkoutModal.classList.remove('active');
        state.directCheckoutItem = null;
    };

    if (checkoutCancelBtn) checkoutCancelBtn.onclick = closeCheckoutFn;
    if (checkoutCloseTop) checkoutCloseTop.onclick = closeCheckoutFn;

    // Payment method tab switching
    const paymentPills = document.querySelectorAll('.payment-pill');
    paymentPills.forEach(pill => {
        pill.onclick = () => {
            paymentPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const method = pill.getAttribute('data-method');
            const upiFields = document.getElementById('payment-fields-upi');
            const cardFields = document.getElementById('payment-fields-card');

            // Toggle field required tags
            const upiInput = document.getElementById('checkout-upi-id');
            const cardInput = document.getElementById('checkout-card-num');
            const expiryInput = document.getElementById('checkout-card-expiry');
            const cvvInput = document.getElementById('checkout-card-cvv');

            if (method === 'upi') {
                if (upiFields) upiFields.classList.add('active');
                if (cardFields) cardFields.classList.remove('active');
                if (upiInput) upiInput.setAttribute('required', 'true');
                if (cardInput) cardInput.removeAttribute('required');
                if (expiryInput) expiryInput.removeAttribute('required');
                if (cvvInput) cvvInput.removeAttribute('required');
            } else if (method === 'card') {
                if (upiFields) upiFields.classList.remove('active');
                if (cardFields) cardFields.classList.add('active');
                if (upiInput) upiInput.removeAttribute('required');
                if (cardInput) cardInput.setAttribute('required', 'true');
                if (expiryInput) expiryInput.setAttribute('required', 'true');
                if (cvvInput) cvvInput.setAttribute('required', 'true');
            } else {
                // cash on delivery
                if (upiFields) upiFields.classList.remove('active');
                if (cardFields) cardFields.classList.remove('active');
                if (upiInput) upiInput.removeAttribute('required');
                if (cardInput) cardInput.removeAttribute('required');
                if (expiryInput) expiryInput.removeAttribute('required');
                if (cvvInput) cvvInput.removeAttribute('required');
            }
        };
    });

    if (checkoutForm) {
        checkoutForm.onsubmit = async (e) => {
            e.preventDefault();

            // Perform PIN validation
            const pincode = document.getElementById('checkout-pincode').value;
            if (pincode.length !== 6 || isNaN(pincode)) {
                showToast("Invalid Indian PIN Code. Must be exactly 6 digits.", "error");
                return;
            }

            // Build order payload
            const items = state.directCheckoutItem ? [state.directCheckoutItem] : state.cart;
            const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
            const discount = state.discountCode === 'VOGUE10' ? Math.round(subtotal * 0.1) : 0;
            const total = subtotal - discount;

            const activePaymentPill = document.querySelector('.payment-pill.active');
            const paymentMethod = activePaymentPill ? activePaymentPill.getAttribute('data-method') : 'cod';

            const orderPayload = {
                email: document.getElementById('checkout-email').value,
                firstName: document.getElementById('checkout-first-name').value,
                lastName: document.getElementById('checkout-last-name').value,
                address: document.getElementById('checkout-address').value,
                city: document.getElementById('checkout-city').value,
                pincode,
                paymentMethod,
                upiId: paymentMethod === 'upi' ? document.getElementById('checkout-upi-id').value : null,
                cardNum: paymentMethod === 'card' ? document.getElementById('checkout-card-num').value : null,
                cardExpiry: paymentMethod === 'card' ? document.getElementById('checkout-card-expiry').value : null,
                cardCvv: paymentMethod === 'card' ? document.getElementById('checkout-card-cvv').value : null,
                items: items.map(item => ({ product: { id: item.product.id, price: item.product.price, name: item.product.name, image: item.product.image }, size: item.size, color: item.color, quantity: item.quantity })),
                subtotal,
                discount,
                total
            };

            // Disable button to prevent double-submit
            const submitBtn = document.getElementById('checkout-submit-btn');
            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Placing Order...'; }

            try {
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderPayload)
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Failed to place order');
                }

                // Show real order ID from database
                document.getElementById('success-order-id').textContent = `ORDER #${result.id}`;

                // Clear cart and state variables (only if NOT a direct checkout)
                if (state.directCheckoutItem) {
                    state.directCheckoutItem = null;
                } else {
                    state.cart = [];
                    state.discountCode = '';
                    SafeStorage.removeItem('localStorage', 'uv_cart');
                    SafeStorage.removeItem('localStorage', 'uv_discount');
                    updateCartUI();
                }

                // Trigger Success view screen inside modal
                document.getElementById('checkout-success-screen').classList.add('active');
                showToast(`Order ${result.id} placed successfully!`, 'success');

            } catch (err) {
                console.error('Checkout error:', err);
                showToast(err.message || 'Failed to place order. Please try again.', 'error');
            } finally {
                if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Place Order'; }
            }
        };
    }

    if (successHomeBtn) {
        successHomeBtn.onclick = () => {
            if (checkoutModal) checkoutModal.classList.remove('active');
            window.location.hash = ''; // back to home
        };
    }
}

function populateCheckoutSummary(directCheckoutItem = null) {
    const container = document.getElementById('checkout-items-summary');
    const subtotalText = document.getElementById('checkout-subtotal-val');
    const discountRow = document.getElementById('checkout-discount-row-item');
    const discountText = document.getElementById('checkout-discount-val');
    const totalText = document.getElementById('checkout-total-val');

    if (!container) return;

    // Decide items list (either single direct checkout item or full cart)
    const items = directCheckoutItem ? [directCheckoutItem] : state.cart;

    // Items summary
    container.innerHTML = items.map(item => `
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.85rem;">
            <div style="display:flex; gap:10px; align-items:center;">
                <img src="${item.product.image}" style="width:40px; height:50px; border-radius:4px; border:1px solid var(--color-border-dark);" alt="${item.product.name}">
                <div>
                    <div style="font-weight:600; color:var(--color-secondary); max-width:180px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.product.name}</div>
                    <div style="color:var(--color-text-muted); font-size:0.75rem;">Size: ${item.size} | Qty: ${item.quantity}</div>
                </div>
            </div>
            <span style="font-weight:600; color:var(--color-secondary);">â‚¹${(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
        </div>
    `).join('');

    // Compute totals
    const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    if (subtotalText) subtotalText.textContent = `â‚¹${subtotal.toLocaleString('en-IN')}`;

    let discount = 0;
    if (state.discountCode === 'VOGUE10') {
        discount = Math.round(subtotal * 0.1);
        if (discountRow) discountRow.style.display = 'flex';
        if (discountText) discountText.textContent = `-â‚¹${discount.toLocaleString('en-IN')}`;
    } else {
        if (discountRow) discountRow.style.display = 'none';
    }

    const total = subtotal - discount;
    if (totalText) totalText.textContent = `â‚¹${total.toLocaleString('en-IN')}`;
}

// FOOTER NEWSLETTER FORM SUBMIT -> POST /api/newsletter
function bindFooterNewsletterForm() {
    const form = document.getElementById('newsletter-form-element');
    if (!form) return;

    form.onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('newsletter-email-field').value;
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Subscribing...'; }

        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            if (!response.ok) throw new Error('Subscription failed');
            SafeStorage.setItem('localStorage', 'uv_subscribed', 'true');
            SafeStorage.setItem('localStorage', 'uv_subscriber_email', email);
            form.reset();
            showToast('You are now subscribed! Check your email for your 10% coupon code.', 'success');
        } catch (err) {
            console.warn('Footer newsletter error:', err);
            showToast('Failed to subscribe. Please try again.', 'error');
        } finally {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Subscribe'; }
        }
    };
}

// CONTACT FORM SUBMIT -> POST /api/contact
window.handleContactSubmit = async function(e) {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const message = document.getElementById('contact-message').value;

    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message })
        });
        if (!response.ok) throw new Error('Failed to send inquiry');
        e.target.reset();
        showToast('Your inquiry has been successfully sent. We will respond within 24 hours.', 'success');
    } catch (err) {
        showToast('Failed to send inquiry. Please try again.', 'error');
    } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send Inquiry'; }
    }
};

// 11. UTILITY INTERACTIVE WIDGETS

// Toast messaging utility
function showToast(message, type = "success") {
    const container = document.getElementById('toast-messages-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = "fa-circle-check";
    if (type === "error") icon = "fa-circle-exclamation";
    if (type === "info") icon = "fa-circle-info";

    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Auto-remove toast after 4 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'all 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

// PASSWORD GATEWAY CONTROLLER
function initPasswordGateway() {
    const gateway = document.getElementById('password-gateway');
    const form = document.getElementById('password-gateway-form');
    
    if (!gateway) return;

    // Check if already unlocked
    if (SafeStorage.getItem('sessionStorage', 'uv_unlocked') === 'true') {
        gateway.classList.add('hidden');
        gateway.style.display = 'none';
    } else {
        gateway.classList.remove('hidden');
        gateway.style.display = 'flex';
    }

    form.onsubmit = (e) => {
        e.preventDefault();
        const pwd = document.getElementById('store-password-input').value;
        if (pwd === 'Test@123') {
            SafeStorage.setItem('sessionStorage', 'uv_unlocked', 'true');
            gateway.classList.add('hidden');
            setTimeout(() => {
                gateway.style.display = 'none';
            }, 500); // Wait for the transition to finish
            showToast("Welcome to Urban Vogue! Store Unlocked.", "success");
        } else {
            showToast("Incorrect password. Please try again.", "error");
        }
    };
}

// TRACK ORDER PAGE VIEW
function renderTrackOrderPage() {
    const container = document.getElementById('dynamic-content-container');
    
    container.innerHTML = `
        <div class="static-page-header">
            <div class="container">
                <h1 class="static-page-title">Track Your Order</h1>
                <p style="color:var(--color-text-muted); margin-top:8px; text-transform:uppercase; letter-spacing:0.1em; font-size:0.85rem;">Get real-time updates on your streetwear delivery</p>
            </div>
        </div>
        <div class="container">
            <div class="static-page-body" style="max-width: 600px; margin: 0 auto; padding-bottom: 80px;">
                <div style="background: var(--color-bg-card); padding: 32px; border-radius: var(--border-radius-lg); border: 1px solid var(--color-border-light); box-shadow: var(--shadow-md);">
                    <form id="order-tracking-form" onsubmit="handleOrderTracking(event)" style="display:flex; flex-direction:column; gap:16px;">
                        <div>
                            <label class="checkout-label" for="track-order-id">Order ID / Number</label>
                            <input type="text" class="checkout-input" id="track-order-id" placeholder="e.g. UV-289410" required style="border: 1px solid var(--color-border-light);">
                        </div>
                        <div>
                            <label class="checkout-label" for="track-email">Billing Email Address</label>
                            <input type="email" class="checkout-input" id="track-email" placeholder="email@address.com" required style="border: 1px solid var(--color-border-light);">
                        </div>
                        <button type="submit" class="btn btn-primary btn-full">Track Status</button>
                    </form>
                    
                    <div id="tracking-results-box" style="margin-top: 40px; display: none;">
                        <hr style="border: 0; border-top: 1px solid var(--color-border-light); margin-bottom: 30px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                            <h3 style="font-size: 1.1rem; color: var(--color-text-dark); margin: 0;">Order Status</h3>
                            <span class="badge badge-gold" id="tracking-status-badge">IN TRANSIT</span>
                        </div>
                        <div style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 32px;">
                            Showing tracking steps for <strong style="color: var(--color-text-dark);" id="tracking-display-id">UV-289410</strong>. Estimated delivery: <strong>3 Days from dispatch</strong>.
                        </div>
                        
                        <!-- Timeline - data-step and tracking-dot class enable dynamic highlighting from JS -->
                        <div style="display: flex; flex-direction: column; gap: 24px; position: relative; padding-left: 32px; border-left: 2px dashed var(--color-border-light); margin-left: 10px;">
                            <div style="position: relative;" data-step="0">
                                <div class="tracking-dot" style="position: absolute; left: -43px; top: 2px; width: 20px; height: 20px; border-radius: 50%; background: var(--color-border-light); color: #FFF; display: flex; align-items: center; justify-content: center; font-size: 0.7rem;"><i class="fa-solid fa-clock"></i></div>
                                <h4 style="font-size: 0.9rem; color: var(--color-text-dark); margin-bottom: 4px;">Order Confirmed</h4>
                                <p style="font-size: 0.75rem; color: var(--color-text-muted);">Payment verified and order accepted by merchant.</p>
                            </div>
                            <div style="position: relative;" data-step="1">
                                <div class="tracking-dot" style="position: absolute; left: -43px; top: 2px; width: 20px; height: 20px; border-radius: 50%; background: var(--color-border-light); color: #FFF; display: flex; align-items: center; justify-content: center; font-size: 0.7rem;"><i class="fa-solid fa-clock"></i></div>
                                <h4 style="font-size: 0.9rem; color: var(--color-text-dark); margin-bottom: 4px;">Processed &amp; Packed</h4>
                                <p style="font-size: 0.75rem; color: var(--color-text-muted);">Quality inspection complete. Sealed in custom eco-friendly packaging.</p>
                            </div>
                            <div style="position: relative;" data-step="2">
                                <div class="tracking-dot" style="position: absolute; left: -43px; top: 2px; width: 20px; height: 20px; border-radius: 50%; background: var(--color-border-light); color: #FFF; display: flex; align-items: center; justify-content: center; font-size: 0.7rem;"><i class="fa-solid fa-clock"></i></div>
                                <h4 style="font-size: 0.9rem; color: var(--color-text-dark); margin-bottom: 4px;">Dispatched from Warehouse</h4>
                                <p style="font-size: 0.75rem; color: var(--color-text-muted);">Shipped from Gurugram hub. Handed over to Express Logistics partner.</p>
                            </div>
                            <div style="position: relative;" data-step="3">
                                <div class="tracking-dot" style="position: absolute; left: -43px; top: 2px; width: 20px; height: 20px; border-radius: 50%; background: var(--color-border-light); color: #FFF; display: flex; align-items: center; justify-content: center; font-size: 0.7rem;"><i class="fa-solid fa-clock"></i></div>
                                <h4 style="font-size: 0.9rem; color: var(--color-text-dark); margin-bottom: 4px;">In Transit</h4>
                                <p style="font-size: 0.75rem; color: var(--color-text-muted);">Currently in transit between courier distribution hubs.</p>
                            </div>
                            <div style="position: relative; opacity: 0.5;" data-step="4">
                                <div class="tracking-dot" style="position: absolute; left: -43px; top: 2px; width: 20px; height: 20px; border-radius: 50%; background: var(--color-border-light); color: var(--color-text-muted); display: flex; align-items: center; justify-content: center; font-size: 0.7rem;"><i class="fa-solid fa-clock"></i></div>
                                <h4 style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 4px;">Out for Delivery</h4>
                                <p style="font-size: 0.75rem;">Package assigned to delivery agent for final doorstep drop.</p>
                            </div>
                            <div style="position: relative; opacity: 0.5;" data-step="5">
                                <div class="tracking-dot" style="position: absolute; left: -43px; top: 2px; width: 20px; height: 20px; border-radius: 50%; background: var(--color-border-light); color: var(--color-text-muted); display: flex; align-items: center; justify-content: center; font-size: 0.7rem;"><i class="fa-solid fa-clock"></i></div>
                                <h4 style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 4px;">Delivered</h4>
                                <p style="font-size: 0.75rem;">Your order has been successfully delivered. Enjoy!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

window.handleOrderTracking = async function(e) {
    e.preventDefault();
    const orderId = document.getElementById('track-order-id').value.toUpperCase().trim();
    const email = document.getElementById('track-email').value.trim();

    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Tracking...'; }

    try {
        const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}?email=${encodeURIComponent(email)}`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Order not found');
        }

        // Map status to timeline step index:
        // Pending(0), Processing(1), Dispatched(2), InTransit(3), OutForDelivery(4), Delivered(5)
        const statusMap = {
            'Pending': 0,
            'Processing': 1,
            'Dispatched': 2,
            'In Transit': 3,
            'Out for Delivery': 4,
            'Delivered': 5
        };
        const currentStep = statusMap[result.status] !== undefined ? statusMap[result.status] : 0;

        document.getElementById('tracking-display-id').textContent = orderId;
        document.getElementById('tracking-status-badge').textContent = result.status.toUpperCase();
        document.getElementById('tracking-results-box').style.display = 'block';

        // Dynamically update timeline steps
        const steps = document.querySelectorAll('#tracking-results-box [data-step]');
        steps.forEach((step, idx) => {
            const dot = step.querySelector('.tracking-dot');
            if (!dot) return;
            if (idx < currentStep) {
                dot.style.background = 'var(--color-success)';
                dot.innerHTML = '<i class="fa-solid fa-check"></i>';
                step.style.opacity = '1';
            } else if (idx === currentStep) {
                dot.style.background = 'var(--color-accent)';
                dot.style.boxShadow = '0 0 8px var(--color-accent)';
                dot.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
                step.style.opacity = '1';
            } else {
                step.style.opacity = '0.5';
            }
        });

        const orderDate = new Date(result.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
        showToast(`Order ${orderId} found — Status: ${result.status}`, 'success');

    } catch (err) {
        console.error('Tracking error:', err);
        showToast(err.message || 'Order not found. Please check your Order ID and email.', 'error');
        document.getElementById('tracking-results-box').style.display = 'none';
    } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Track Status'; }
    }
};
// --- AUTHENTICATION LOGIC ---
async function checkAuth() {
    const token = SafeStorage.getItem('localStorage', 'uv_token');
    if (!token) return;
    try {
        const res = await fetch('/api/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            state.user = data.user;
            updateAuthUI();
        } else {
            SafeStorage.removeItem('localStorage', 'uv_token');
        }
    } catch (err) {
        console.error('Auth check error:', err);
    }
}

function updateAuthUI() {
    const authBtn = document.getElementById('auth-toggle-btn');
    if (authBtn) {
        if (state.user) {
            authBtn.innerHTML = '<i class="fa-solid fa-user"></i>';
            authBtn.style.color = 'var(--color-accent)';
        } else {
            authBtn.innerHTML = '<i class="fa-regular fa-user"></i>';
            authBtn.style.color = 'var(--color-text-dark)';
        }
    }
}

function bindAuthEvents() {
    const authToggleBtn = document.getElementById('auth-toggle-btn');
    const authModal = document.getElementById('auth-modal-container');
    const authCloseBtn = document.getElementById('auth-close-btn');
    const authTabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loggedInView = document.getElementById('logged-in-view');
    const authModalTitle = document.getElementById('auth-modal-title');

    if (authToggleBtn && authModal) {
        authToggleBtn.addEventListener('click', () => {
            // Check if logged in to show correct view
            if (state.user) {
                loginForm.style.display = 'none';
                signupForm.style.display = 'none';
                document.querySelector('.auth-tabs').style.display = 'none';
                loggedInView.style.display = 'block';
                document.getElementById('user-welcome-name').textContent = `Welcome, ${state.user.name}`;
                document.getElementById('user-welcome-email').textContent = state.user.email;
                authModalTitle.textContent = 'Account';
            } else {
                loginForm.style.display = 'block';
                signupForm.style.display = 'none';
                document.querySelector('.auth-tabs').style.display = 'flex';
                loggedInView.style.display = 'none';
                authModalTitle.textContent = 'Sign In';
            }
            authModal.classList.add('active');
        });
    }

    if (authCloseBtn) {
        authCloseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            authModal.classList.remove('active');
        });
    }

    authTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            authTabs.forEach(t => {
                t.classList.remove('active');
                t.style.color = 'var(--color-text-muted)';
                t.style.borderBottom = 'none';
            });
            tab.classList.add('active');
            tab.style.color = 'var(--color-secondary)';
            tab.style.borderBottom = '2px solid var(--color-accent)';

            if (tab.dataset.tab === 'login') {
                loginForm.style.display = 'block';
                signupForm.style.display = 'none';
                authModalTitle.textContent = 'Sign In';
            } else {
                loginForm.style.display = 'none';
                signupForm.style.display = 'block';
                authModalTitle.textContent = 'Create Account';
            }
        });
    });

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const errorEl = document.getElementById('login-error');
            const submitBtn = document.getElementById('login-submit-btn');

            errorEl.style.display = 'none';
            submitBtn.textContent = 'Signing in...';
            submitBtn.disabled = true;

            try {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                
                if (res.ok) {
                    SafeStorage.setItem('localStorage', 'uv_token', data.token);
                    state.user = data.user;
                    updateAuthUI();
                    authModal.classList.remove('active');
                    showToast('Logged in successfully', 'success');
                    loginForm.reset();
                } else {
                    errorEl.textContent = data.error;
                    errorEl.style.display = 'block';
                }
            } catch (err) {
                errorEl.textContent = 'An error occurred. Please try again.';
                errorEl.style.display = 'block';
            } finally {
                submitBtn.textContent = 'Sign In';
                submitBtn.disabled = false;
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const errorEl = document.getElementById('signup-error');
            const submitBtn = document.getElementById('signup-submit-btn');

            errorEl.style.display = 'none';
            submitBtn.textContent = 'Creating...';
            submitBtn.disabled = true;

            try {
                const res = await fetch('/api/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });
                const data = await res.json();
                
                if (res.ok) {
                    SafeStorage.setItem('localStorage', 'uv_token', data.token);
                    state.user = data.user;
                    updateAuthUI();
                    authModal.classList.remove('active');
                    showToast('Account created successfully', 'success');
                    signupForm.reset();
                } else {
                    errorEl.textContent = data.error;
                    errorEl.style.display = 'block';
                }
            } catch (err) {
                errorEl.textContent = 'An error occurred. Please try again.';
                errorEl.style.display = 'block';
            } finally {
                submitBtn.textContent = 'Create Account';
                submitBtn.disabled = false;
            }
        });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            SafeStorage.removeItem('localStorage', 'uv_token');
            state.user = null;
            updateAuthUI();
            authModal.classList.remove('active');
            showToast('Logged out successfully', 'success');
        });
    }
}
