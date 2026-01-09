import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './src/models/User.js';
import Product from './src/models/Product.js';
import MorePage from './src/models/MorePage.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/product-catalog');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await MorePage.deleteMany();

    console.log('Data cleared...');

    // Create admin user
    const adminUser = await User.create({
      name: 'Chandan Randive',
      email: 'Chandan.randive.official@gmail.com',
      password: 'Iamchandanfrom@490020',
      role: 'admin',
    });

    console.log('Users created...');

    // Current date for dynamic month calculation
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const currentMonthName = months[currentMonth];
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevMonthName = months[prevMonth];
    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Products with local images from /public folder
    const products = [
      // ===== BESTSELLERS (4 products) =====
      {
        name: 'Nike Air Max Red',
        description: 'Premium red sneakers with Air Max cushioning technology. Perfect blend of style and comfort.',
        productLink: 'https://www.nike.com/in/t/air-max-90-mens-shoes-6n8tKS/CN8490-100',
        price: 120.00,
        category: 'Accessories',
        sku: 'SHOE-2026-001',
        images: [{ url: '/redshoe.png', alt: 'Nike Air Max Red' }],
        year: currentYear,
        month: currentMonthName,
        status: 'Active',
        visibility: { published: true, bestSelling: true, editorsPick: false },
        tags: ['footwear', 'sneakers', 'nike', 'red'],
        stock: 25,
        createdBy: adminUser._id,
      },
      {
        name: 'Chronos Minimal Watch',
        description: 'Elegant minimalist timepiece with premium leather strap and Swiss movement.',
        productLink: 'https://www.amazon.in/dp/B08XYZ123',
        price: 250.00,
        category: 'Accessories',
        sku: 'WATCH-2026-001',
        images: [{ url: '/watch.png', alt: 'Chronos Minimal Watch' }],
        year: currentYear,
        month: currentMonthName,
        status: 'Active',
        visibility: { published: true, bestSelling: true, editorsPick: false },
        tags: ['watch', 'accessories', 'minimal', 'luxury'],
        stock: 15,
        createdBy: adminUser._id,
      },
      {
        name: 'Audio Technica X Headphones',
        description: 'Professional-grade wireless headphones with noise cancellation and premium sound.',
        productLink: 'https://www.audiotechnica.com/en-us/ath-m50xbt2',
        price: 300.00,
        category: 'Accessories',
        sku: 'HEAD-2026-001',
        images: [{ url: '/headphone.png', alt: 'Audio Technica X Headphones' }],
        year: currentYear,
        month: currentMonthName,
        status: 'Active',
        visibility: { published: true, bestSelling: true, editorsPick: false },
        tags: ['headphones', 'audio', 'wireless', 'premium'],
        stock: 30,
        createdBy: adminUser._id,
      },
      {
        name: 'Rayban Classic Shades',
        description: 'Iconic sunglasses with UV protection and timeless design.',
        productLink: 'https://www.ray-ban.com/usa/sunglasses/RB2132%20UNISEX%20new%20wayfarer%20classic-black/805289126577',
        price: 150.00,
        category: 'Accessories',
        sku: 'SHADE-2026-001',
        images: [{ url: '/shades.png', alt: 'Rayban Classic Shades' }],
        year: currentYear,
        month: currentMonthName,
        status: 'Active',
        visibility: { published: true, bestSelling: true, editorsPick: false },
        tags: ['sunglasses', 'accessories', 'rayban', 'classic'],
        stock: 40,
        createdBy: adminUser._id,
      },

      // ===== EDITOR'S PICK (4 products) =====
      {
        name: 'Abstract Sculpture Form',
        description: 'Contemporary abstract sculpture perfect for modern interiors.',
        productLink: 'https://www.etsy.com/listing/abstract-sculpture',
        price: 280.00,
        category: 'Arts',
        sku: 'ART-2026-001',
        images: [{ url: '/paint.png', alt: 'Abstract Sculpture Form' }],
        year: currentYear,
        month: currentMonthName,
        status: 'Active',
        visibility: { published: true, bestSelling: false, editorsPick: true },
        tags: ['sculpture', 'art', 'abstract', 'decor'],
        stock: 10,
        createdBy: adminUser._id,
      },
      {
        name: 'Ceramic Coffee Cup',
        description: 'Handcrafted ceramic cup with minimalist design.',
        price: 45.00,
        category: 'Decor',
        sku: 'CUP-2026-001',
        images: [{ url: '/cup.png', alt: 'Ceramic Coffee Cup' }],
        year: currentYear,
        month: currentMonthName,
        status: 'Active',
        visibility: { published: true, bestSelling: false, editorsPick: true },
        tags: ['cup', 'ceramic', 'kitchen', 'minimal'],
        stock: 50,
        createdBy: adminUser._id,
      },
      {
        name: 'Potted Plant Decor',
        description: 'Beautiful potted plant to bring life to any space.',
        price: 65.00,
        category: 'Decor',
        sku: 'PLANT-2026-001',
        images: [{ url: '/pottedplant.png', alt: 'Potted Plant Decor' }],
        year: currentYear,
        month: currentMonthName,
        status: 'Active',
        visibility: { published: true, bestSelling: false, editorsPick: true },
        tags: ['plant', 'decor', 'green', 'nature'],
        stock: 35,
        createdBy: adminUser._id,
      },
      {
        name: 'Design Chronicle Book',
        description: 'Coffee table book featuring iconic designs through the decades.',
        price: 55.00,
        category: 'Arts',
        sku: 'BOOK-2026-001',
        images: [{ url: '/bookcover.png', alt: 'Design Chronicle Book' }],
        year: currentYear,
        month: currentMonthName,
        status: 'Active',
        visibility: { published: true, bestSelling: false, editorsPick: true },
        tags: ['book', 'design', 'art', 'coffee table'],
        stock: 20,
        createdBy: adminUser._id,
      },

      // ===== CURRENT MONTH COLLECTION (4 products) =====
      {
        name: 'iPhone Pro Case',
        description: 'Premium protective case with sleek design for iPhone.',
        price: 49.00,
        category: 'Accessories',
        sku: 'MOBILE-2026-001',
        images: [{ url: '/mobile.png', alt: 'iPhone Pro Case' }],
        year: currentYear,
        month: currentMonthName,
        status: 'Active',
        visibility: { published: true, bestSelling: false, editorsPick: false },
        tags: ['phone', 'case', 'iphone', 'accessories'],
        stock: 100,
        createdBy: adminUser._id,
      },
      {
        name: 'Essence Perfume No. 5',
        description: 'Luxurious fragrance with notes of jasmine and sandalwood.',
        price: 195.00,
        category: 'Accessories',
        sku: 'PERF-2026-001',
        images: [{ url: '/perfume.png', alt: 'Essence Perfume No. 5' }],
        year: currentYear,
        month: currentMonthName,
        status: 'Active',
        visibility: { published: true, bestSelling: false, editorsPick: false },
        tags: ['perfume', 'fragrance', 'luxury', 'beauty'],
        stock: 25,
        createdBy: adminUser._id,
      },
      {
        name: 'Cotton Basic White Tee',
        description: 'Premium cotton t-shirt with perfect fit and comfort.',
        price: 35.00,
        category: 'Accessories',
        sku: 'TEE-2026-001',
        images: [{ url: '/whitet.png', alt: 'Cotton Basic White Tee' }],
        year: currentYear,
        month: currentMonthName,
        status: 'Active',
        visibility: { published: true, bestSelling: false, editorsPick: false },
        tags: ['tshirt', 'cotton', 'white', 'basic'],
        stock: 75,
        createdBy: adminUser._id,
      },
      {
        name: 'Decorative Picture Frame',
        description: 'Elegant frame to showcase your favorite memories.',
        price: 42.00,
        category: 'Decor',
        sku: 'FRAME-2026-001',
        images: [{ url: '/frame.png', alt: 'Decorative Picture Frame' }],
        year: currentYear,
        month: currentMonthName,
        status: 'Active',
        visibility: { published: true, bestSelling: false, editorsPick: false },
        tags: ['frame', 'decor', 'photo', 'wall'],
        stock: 45,
        createdBy: adminUser._id,
      },

      // ===== PREVIOUS MONTH COLLECTION (4 products) =====
      {
        name: 'Modern Office Setup',
        description: 'Complete desk organization system for the modern workspace.',
        price: 320.00,
        category: 'Furniture',
        sku: 'OFFICE-2026-001',
        images: [{ url: '/office.png', alt: 'Modern Office Setup' }],
        year: prevMonthYear,
        month: prevMonthName,
        status: 'Active',
        visibility: { published: true, bestSelling: false, editorsPick: false },
        tags: ['office', 'desk', 'workspace', 'organization'],
        stock: 15,
        createdBy: adminUser._id,
      },
      {
        name: 'Wooden Display Shelf',
        description: 'Minimalist wooden shelf for displaying collectibles.',
        price: 185.00,
        category: 'Furniture',
        sku: 'SHELF-2026-001',
        images: [{ url: '/shelf.png', alt: 'Wooden Display Shelf' }],
        year: prevMonthYear,
        month: prevMonthName,
        status: 'Active',
        visibility: { published: true, bestSelling: false, editorsPick: false },
        tags: ['shelf', 'wood', 'furniture', 'display'],
        stock: 20,
        createdBy: adminUser._id,
      },
      {
        name: 'Designer Side Chair',
        description: 'Ergonomic side chair with contemporary design.',
        price: 450.00,
        category: 'Furniture',
        sku: 'CHAIR-2026-001',
        images: [{ url: '/sidechair.png', alt: 'Designer Side Chair' }],
        year: prevMonthYear,
        month: prevMonthName,
        status: 'Active',
        visibility: { published: true, bestSelling: false, editorsPick: false },
        tags: ['chair', 'furniture', 'designer', 'seating'],
        stock: 12,
        createdBy: adminUser._id,
      },
      {
        name: 'Artistic Hand Sculpture',
        description: 'Unique hand sculpture as a statement piece.',
        price: 175.00,
        category: 'Arts',
        sku: 'HAND-2026-001',
        images: [{ url: '/hand.png', alt: 'Artistic Hand Sculpture' }],
        year: prevMonthYear,
        month: prevMonthName,
        status: 'Active',
        visibility: { published: true, bestSelling: false, editorsPick: false },
        tags: ['sculpture', 'art', 'hand', 'decor'],
        stock: 8,
        createdBy: adminUser._id,
      },

      // ===== 2025 COLLECTION (4 products) =====
      {
        name: 'Minimalist Desk Setup',
        description: 'Clean and functional desk arrangement for productivity.',
        price: 275.00,
        category: 'Furniture',
        sku: 'DESK-2025-001',
        images: [{ url: '/office.png', alt: 'Minimalist Desk Setup' }],
        year: 2025,
        month: 'October',
        status: 'Active',
        visibility: { published: true, bestSelling: false, editorsPick: false },
        tags: ['desk', 'office', 'minimal', 'workspace'],
        stock: 10,
        createdBy: adminUser._id,
      },
      {
        name: 'Brass Candle Holder',
        description: 'Elegant brass candle holder for ambient lighting.',
        price: 85.00,
        category: 'Decor',
        sku: 'CANDLE-2025-001',
        images: [{ url: '/cup.png', alt: 'Brass Candle Holder' }],
        year: 2025,
        month: 'September',
        status: 'Active',
        visibility: { published: true, bestSelling: false, editorsPick: false },
        tags: ['candle', 'brass', 'decor', 'lighting'],
        stock: 30,
        createdBy: adminUser._id,
      },
      {
        name: 'Wool Throw Blanket',
        description: 'Cozy wool blanket for cold evenings.',
        price: 120.00,
        category: 'Decor',
        sku: 'BLANKET-2025-001',
        images: [{ url: '/whitet.png', alt: 'Wool Throw Blanket' }],
        year: 2025,
        month: 'August',
        status: 'Active',
        visibility: { published: true, bestSelling: false, editorsPick: false },
        tags: ['blanket', 'wool', 'cozy', 'home'],
        stock: 25,
        createdBy: adminUser._id,
      },
      {
        name: 'Glass Water Carafe',
        description: 'Elegant glass carafe for serving water or beverages.',
        price: 55.00,
        category: 'Decor',
        sku: 'CARAFE-2025-001',
        images: [{ url: '/cup.png', alt: 'Glass Water Carafe' }],
        year: 2025,
        month: 'July',
        status: 'Active',
        visibility: { published: true, bestSelling: false, editorsPick: false },
        tags: ['glass', 'carafe', 'kitchen', 'serving'],
        stock: 40,
        createdBy: adminUser._id,
      },

      // ===== 2024 COLLECTION (4 products) =====
      {
        name: 'Wooden Cutting Board',
        description: 'Premium hardwood cutting board for the kitchen.',
        price: 75.00,
        category: 'Decor',
        sku: 'BOARD-2024-001',
        images: [{ url: '/shelf.png', alt: 'Wooden Cutting Board' }],
        year: 2024,
        month: 'December',
        status: 'Active',
        visibility: { published: true, bestSelling: false, editorsPick: false },
        tags: ['cutting board', 'wood', 'kitchen', 'cooking'],
        stock: 35,
        createdBy: adminUser._id,
      },
      {
        name: 'Stoneware Bowl Set',
        description: 'Handcrafted stoneware bowls for serving.',
        price: 95.00,
        category: 'Decor',
        sku: 'BOWL-2024-001',
        images: [{ url: '/cup.png', alt: 'Stoneware Bowl Set' }],
        year: 2024,
        month: 'November',
        status: 'Active',
        visibility: { published: true, bestSelling: false, editorsPick: false },
        tags: ['bowl', 'stoneware', 'kitchen', 'serving'],
        stock: 28,
        createdBy: adminUser._id,
      },
      {
        name: 'Linen Napkin Collection',
        description: 'Set of premium linen napkins for dining.',
        price: 45.00,
        category: 'Decor',
        sku: 'NAPKIN-2024-001',
        images: [{ url: '/whitet.png', alt: 'Linen Napkin Collection' }],
        year: 2024,
        month: 'October',
        status: 'Active',
        visibility: { published: true, bestSelling: false, editorsPick: false },
        tags: ['napkin', 'linen', 'dining', 'table'],
        stock: 50,
        createdBy: adminUser._id,
      },
      {
        name: 'Copper Tea Kettle',
        description: 'Classic copper kettle for brewing tea.',
        price: 135.00,
        category: 'Decor',
        sku: 'KETTLE-2024-001',
        images: [{ url: '/cup.png', alt: 'Copper Tea Kettle' }],
        year: 2024,
        month: 'September',
        status: 'Active',
        visibility: { published: true, bestSelling: false, editorsPick: false },
        tags: ['kettle', 'copper', 'tea', 'kitchen'],
        stock: 18,
        createdBy: adminUser._id,
      },
    ];

    await Product.insertMany(products);
    console.log('Products created...');

    // Create sample More pages
    const morePages = [
      {
        title: 'Our Journey & Mission',
        slug: 'our-journey-mission',
        content: `Since our inception in 2020, we have been dedicated to pushing the boundaries of what is possible in digital design. Our philosophy is rooted in the belief that simplicity is the ultimate sophistication.

We strive to create products that are not only functional but also intuitive and beautiful. Every pixel is crafted with care, and every interaction is thought through to ensure a seamless user experience.

Join us on our journey as we continue to explore new horizons and redefine the standards of excellence.`,
        status: 'PUBLISHED',
        order: 1,
        updatedBy: adminUser._id,
      },
      {
        title: 'Design Philosophy',
        slug: 'design-philosophy',
        content: `We believe in the power of minimalism and functionality. Our design philosophy centers around creating products that serve a purpose while maintaining aesthetic appeal.

Every product we create goes through rigorous testing and refinement to ensure it meets our high standards of quality and usability.`,
        status: 'PUBLISHED',
        order: 2,
        updatedBy: adminUser._id,
      },
    ];

    await MorePage.insertMany(morePages);
    console.log('More pages created...');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('   Admin: Chandan.randive.official@gmail.com / Iamchandanfrom@490020\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
