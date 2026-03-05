const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // ---- Schemas ----
        const CategorySchema = new mongoose.Schema(
            {
                name: { en: String, vi: String },
                slug: String,
                description: { en: String, vi: String },
                isActive: { type: Boolean, default: true },
            },
            { timestamps: true }
        );
        const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

        const ProductImageSchema = new mongoose.Schema({ publicId: String, url: String, isMain: Boolean });
        const ProductVariantSchema = new mongoose.Schema({ sku: String, size: String, color: String, price: Number, salePrice: Number, stock: Number });
        const ProductSchema = new mongoose.Schema(
            {
                name: { en: String, vi: String },
                slug: String,
                shortDescription: { en: String, vi: String },
                description: { en: String, vi: String },
                categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
                basePrice: Number,
                salePrice: Number,
                images: [ProductImageSchema],
                variants: [ProductVariantSchema],
                isActive: { type: Boolean, default: true },
                isFeatured: { type: Boolean, default: false },
                seoTitle: { en: String, vi: String },
                seoDescription: { en: String, vi: String },
            },
            { timestamps: true }
        );
        const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

        const OrderItemSchema = new mongoose.Schema({ productId: mongoose.Schema.Types.ObjectId, variantId: String, name: String, price: Number, quantity: Number });
        const OrderSchema = new mongoose.Schema(
            {
                orderNumber: String,
                customer: { name: String, email: String, phone: String, address: String, city: String, country: { type: String, default: 'Vietnam' } },
                items: [OrderItemSchema],
                subtotal: Number,
                shippingFee: Number,
                total: Number,
                status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'], default: 'Pending' },
                paymentMethod: { type: String, default: 'COD' },
                paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
                notes: String,
            },
            { timestamps: true }
        );
        const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

        const B2BOrderSchema = new mongoose.Schema(
            {
                companyName: String,
                contactName: String,
                email: String,
                phone: String,
                material: String,
                size: String,
                color: String,
                quantity: Number,
                logoImagePublicId: String,
                logoImageUrl: String,
                logoDescription: String,
                notes: String,
                status: { type: String, enum: ['Pending', 'Contacted', 'In Progress', 'Completed', 'Cancelled'], default: 'Pending' },
            },
            { timestamps: true }
        );
        const B2BOrder = mongoose.models.B2BOrder || mongoose.model('B2BOrder', B2BOrderSchema);

        const BlogPostSchema = new mongoose.Schema(
            {
                title: { en: String, vi: String },
                slug: String,
                content: { en: String, vi: String },
                excerpt: { en: String, vi: String },
                featuredImageUrl: String,
                status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' },
                views: { type: Number, default: 0 },
            },
            { timestamps: true }
        );
        const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);

        const UserSchema = new mongoose.Schema(
            {
                name: String,
                email: String,
                password: String,
                role: { type: String, enum: ['Super Admin', 'Manager'], default: 'Manager' },
                isActive: { type: Boolean, default: true },
                lastLogin: Date,
            },
            { timestamps: true }
        );
        const User = mongoose.models.User || mongoose.model('User', UserSchema);

        // ---- Clear Existing Data ----
        console.log('🧹 Clearing existing data...');
        await Category.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
        await B2BOrder.deleteMany({});
        await BlogPost.deleteMany({});
        await User.deleteMany({});

        // ---- Seed Categories ----
        console.log('📦 Seeding categories...');
        const [catInox, catNhom, catSets, catPhuKien] = await Category.insertMany([
            { name: { en: 'Stainless Steel', vi: 'Phin Inox' }, slug: 'phin-inox', description: { en: 'Premium stainless steel coffee filters', vi: 'Phin lọc cà phê inox cao cấp' } },
            { name: { en: 'Aluminum', vi: 'Phin Nhôm' }, slug: 'phin-nhom', description: { en: 'Lightweight aluminum coffee filters', vi: 'Phin nhôm định hình nhẹ' } },
            { name: { en: 'Gift Sets', vi: 'Bộ Quà Tặng' }, slug: 'bo-qua-tang', description: { en: 'Curated coffee gift sets', vi: 'Bộ quà tặng cà phê cao cấp' } },
            { name: { en: 'Accessories', vi: 'Phụ Kiện' }, slug: 'phu-kien', description: { en: 'Coffee accessories and filters', vi: 'Phụ kiện cà phê' } },
        ]);
        console.log('  ✓ 4 categories created');

        // ---- Seed Products ----
        console.log('🛒 Seeding products...');
        await Product.insertMany([
            {
                name: { en: 'SS 304 Logo-Engraved Coffee Filter', vi: 'Phin Inox 304 Khắc Logo' },
                slug: 'phin-inox-304-khac-logo',
                shortDescription: { en: 'Premium SS304 coffee filter with custom logo engraving', vi: 'Phin inox 304 cao cấp, khắc logo theo yêu cầu' },
                description: {
                    en: 'Hand-crafted from food-grade SS304 stainless steel. The perfect corporate gift with your logo precision-engraved. Available in multiple size options.',
                    vi: 'Chế tác từ inox 304 thực phẩm cao cấp. Quà tặng doanh nghiệp hoàn hảo với logo khắc chính xác. Có nhiều kích thước khác nhau.'
                },
                categories: [catInox._id],
                basePrice: 450000,
                salePrice: null,
                images: [
                    { publicId: 'phingift/products/phin-inox-304', url: 'https://res.cloudinary.com/ddme6kbtq/image/upload/v1/phingift/products/phin-inox-304.jpg', isMain: true }
                ],
                variants: [
                    { sku: 'PHIN-IN304-S', size: 'Small (6cm)', color: 'Silver', price: 450000, stock: 80 },
                    { sku: 'PHIN-IN304-M', size: 'Medium (7cm)', color: 'Silver', price: 480000, stock: 62 },
                    { sku: 'PHIN-IN304-L', size: 'Large (8cm)', color: 'Silver', price: 520000, stock: 45 },
                ],
                isActive: true,
                isFeatured: true,
                seoTitle: { en: 'SS304 Logo-Engraved Coffee Filter | PhinGift', vi: 'Phin Inox 304 Khắc Logo | PhinGift' },
            },
            {
                name: { en: 'SS 430 Standard Coffee Filter', vi: 'Phin Inox 430 Cơ Bản' },
                slug: 'phin-inox-430-co-ban',
                shortDescription: { en: 'Durable SS430 filter, great value', vi: 'Phin inox 430 bền bỉ, giá trị tốt' },
                description: {
                    en: 'Made with SS430 stainless steel, durable and affordable. Great for everyday use or as a budget-friendly gift option.',
                    vi: 'Làm từ inox 430, bền bỉ và tiết kiệm. Phù hợp cho sử dụng hàng ngày hoặc làm quà tặng tiết kiệm.'
                },
                categories: [catInox._id],
                basePrice: 350000,
                salePrice: null,
                images: [
                    { publicId: 'phingift/products/phin-inox-430', url: 'https://res.cloudinary.com/ddme6kbtq/image/upload/v1/phingift/products/phin-inox-430.jpg', isMain: true }
                ],
                variants: [
                    { sku: 'PHIN-IN430-M', size: 'Medium (7cm)', color: 'Silver', price: 350000, stock: 0 },
                ],
                isActive: true,
                isFeatured: false,
            },
            {
                name: { en: 'Aluminum Defined Coffee Filter', vi: 'Phin Nhôm Định Hình Cao Cấp' },
                slug: 'phin-nhom-dinh-hinh-cao-cap',
                shortDescription: { en: 'Lightweight premium aluminum phin', vi: 'Phin nhôm định hình cao cấp, nhẹ' },
                description: {
                    en: 'HHigh-quality aluminum with precise shaping for uniform brew. Available in various anodized color finishes.',
                    vi: 'Nhôm cao cấp với hình dạng chính xác cho đồ uống đồng đều. Có nhiều màu anod khác nhau.'
                },
                categories: [catNhom._id],
                basePrice: 280000,
                salePrice: 250000,
                images: [
                    { publicId: 'phingift/products/phin-nhom', url: 'https://res.cloudinary.com/ddme6kbtq/image/upload/v1/phingift/products/phin-nhom.jpg', isMain: true }
                ],
                variants: [
                    { sku: 'PHIN-NH-S-GD', size: 'Small (6cm)', color: 'Gold Anodized', price: 280000, salePrice: 250000, stock: 55 },
                    { sku: 'PHIN-NH-M-BK', size: 'Medium (7cm)', color: 'Black Anodized', price: 290000, salePrice: 260000, stock: 32 },
                ],
                isActive: true,
                isFeatured: true,
            },
            {
                name: { en: 'Premium Coffee Gift Set', vi: 'Set Quà Cà Phê Premium' },
                slug: 'set-qua-ca-phe-premium',
                shortDescription: { en: 'Complete gift set: phin, glass, and premium coffee', vi: 'Bộ quà tặng đầy đủ: phin, ly thủy tinh và cà phê cao cấp' },
                description: {
                    en: 'An extraordinary corporate gift set featuring a hand-crafted logo-engraved SS304 phin, a glass cup, and premium Vietnamese coffee.',
                    vi: 'Bộ quà tặng doanh nghiệp đặc biệt gồm phin inox 304 khắc logo, ly thủy tinh và cà phê Việt Nam cao cấp.'
                },
                categories: [catSets._id],
                basePrice: 890000,
                salePrice: null,
                images: [
                    { publicId: 'phingift/products/set-qua', url: 'https://res.cloudinary.com/ddme6kbtq/image/upload/v1/phingift/products/set-qua.jpg', isMain: true }
                ],
                variants: [
                    { sku: 'SET-QT-001-STD', size: 'Standard', color: 'Natural', price: 890000, stock: 20 },
                    { sku: 'SET-QT-001-LUX', size: 'Luxury (Gift Box)', color: 'Natural', price: 1200000, stock: 14 },
                ],
                isActive: true,
                isFeatured: true,
            },
            {
                name: { en: 'Coffee Filter Cleaning Brush', vi: 'Cọ Vệ Sinh Phin Cà Phê' },
                slug: 'co-ve-sinh-phin',
                shortDescription: { en: 'Soft cleaning brush for coffee filters', vi: 'Cọ mềm vệ sinh phin cà phê' },
                description: {
                    en: 'Keep your phin clean with this soft-bristle cleaning brush. Safe for all filter materials.',
                    vi: 'Giữ phin luôn sạch với cọ lông mềm này. An toàn cho mọi chất liệu.'
                },
                categories: [catPhuKien._id],
                basePrice: 45000,
                salePrice: null,
                images: [],
                variants: [{ sku: 'ACC-BRUSH-001', size: 'Standard', color: 'Green', price: 45000, stock: 200 }],
                isActive: true,
                isFeatured: false,
            },
        ]);
        console.log('  ✓ 5 products created');

        // ---- Seed Orders ----
        console.log('📋 Seeding orders...');
        const customers = [
            { name: 'Nguyễn Văn Anh', email: 'nguyenvananh@gmail.com', phone: '0901234567', address: '123 Nguyễn Huệ', city: 'TP.HCM' },
            { name: 'Trần Thị Bích', email: 'tranbich@gmail.com', phone: '0912345678', address: '45 Lê Lợi', city: 'Hà Nội' },
            { name: 'Lê Hoàng Nam', email: 'nam.le@gmail.com', phone: '0923456789', address: '89 Trần Phú', city: 'Đà Nẵng' },
            { name: 'Phạm Thị Lan', email: 'phamlan@gmail.com', phone: '0934567890', address: '12 Hai Bà Trưng', city: 'TP.HCM' },
            { name: 'Đỗ Minh Tuấn', email: 'tuan.do@gmail.com', phone: '0945678901', address: '56 Lý Thường Kiệt', city: 'Cần Thơ' },
            { name: 'Hoàng Thị Thu', email: 'hoangthu@gmail.com', phone: '0956789012', address: '78 Võ Thị Sáu', city: 'TP.HCM' },
        ];

        const orderData = [
            { num: 'PG-0284', cust: 0, subtotal: 890000, fee: 30000, status: 'Completed', payment: 'Paid', items: [{ name: 'Set Quà Cà Phê Premium', price: 890000, qty: 1 }] },
            { num: 'PG-0283', cust: 1, subtotal: 1250000, fee: 0, status: 'Processing', payment: 'Paid', items: [{ name: 'Phin Inox 304 Khắc Logo', price: 480000, qty: 1 }, { name: 'Phin Nhôm Định Hình Cao Cấp', price: 250000, qty: 3 }] },
            { num: 'PG-0282', cust: 2, subtotal: 450000, fee: 30000, status: 'Pending', payment: 'Pending', items: [{ name: 'Phin Inox 304 Khắc Logo', price: 450000, qty: 1 }] },
            { num: 'PG-0281', cust: 3, subtotal: 2100000, fee: 0, status: 'Shipped', payment: 'Paid', items: [{ name: 'Set Quà Cà Phê Premium', price: 1050000, qty: 2 }] },
            { num: 'PG-0280', cust: 4, subtotal: 780000, fee: 30000, status: 'Completed', payment: 'Paid', items: [{ name: 'Phin Nhôm Định Hình Cao Cấp', price: 260000, qty: 3 }] },
            { num: 'PG-0279', cust: 5, subtotal: 340000, fee: 30000, status: 'Cancelled', payment: 'Failed', items: [{ name: 'Cọ Vệ Sinh Phin Cà Phê', price: 45000, qty: 2 }, { name: 'Phin Inox 430 Cơ Bản', price: 350000, qty: 1 }] },
        ];

        await Order.insertMany(
            orderData.map((o) => ({
                orderNumber: o.num,
                customer: customers[o.cust],
                items: o.items.map((i) => ({ name: i.name, price: i.price, quantity: i.qty })),
                subtotal: o.subtotal,
                shippingFee: o.fee,
                total: o.subtotal + o.fee,
                status: o.status,
                paymentStatus: o.payment,
                paymentMethod: 'COD',
            }))
        );
        console.log('  ✓ 6 orders created');

        // ---- Seed B2B Orders ----
        console.log('🏢 Seeding B2B orders...');
        await B2BOrder.insertMany([
            { companyName: 'Highlands Coffee', contactName: 'Nguyễn Văn Hùng', email: 'hung@highlands.com', phone: '0901112233', material: 'Inox 304', size: 'Medium (7cm)', color: 'Silver', quantity: 500, logoDescription: 'Highlands Coffee logo, exact brand colors', notes: 'Need sample first', status: 'In Progress' },
            { companyName: 'Trung Nguyên Legend', contactName: 'Trần Thị Hoa', email: 'hoa@trungnguyen.com', phone: '0912223344', material: 'Nhôm', size: 'Large (8cm)', color: 'Gold Anodized', quantity: 200, logoDescription: 'TN Legend logo', status: 'Pending' },
            { companyName: 'Phúc Long Tea & Coffee', contactName: 'Lê Minh Đức', email: 'duc@phuclong.com', phone: '0923334455', material: 'Inox 430', size: 'Small (6cm)', color: 'Black', quantity: 1000, logoDescription: 'Phúc Long full logo', notes: 'Urgent delivery', status: 'Completed' },
            { companyName: 'The Coffee House', contactName: 'Phạm Anh Khoa', email: 'khoa@tcfh.com', phone: '0934445566', material: 'Inox 304', size: 'Medium (7cm)', color: 'Matte Black', quantity: 300, logoDescription: 'TCF minimal logo', status: 'Contacted' },
        ]);
        console.log('  ✓ 4 B2B orders created');

        // ---- Seed Blog Posts ----
        console.log('📝 Seeding blog posts...');
        await BlogPost.insertMany([
            {
                title: { en: 'How to Brew the Perfect Vietnamese Drip Coffee', vi: 'Cách Pha Cà Phê Phin Đúng Chuẩn Người Việt' },
                slug: 'cach-pha-ca-phe-phin-dung-chuan',
                excerpt: { en: 'Learn the traditional Vietnamese drip method with tips from coffee artisans.', vi: 'Học cách pha cà phê phin truyền thống Việt Nam qua chia sẻ từ nghệ nhân cà phê.' },
                content: { en: '<p>Vietnamese drip coffee, known as <em>cà phê phin</em>, is a beloved tradition...</p>', vi: '<p>Cà phê phin Việt Nam là một nét văn hóa đặc sắc lâu đời...</p>' },
                status: 'Published',
                views: 1240,
            },
            {
                title: { en: 'Logo-Engraved Phin – The Ultimate Corporate Gift', vi: 'Phin Khắc Logo – Quà Tặng Doanh Nghiệp Ý Nghĩa' },
                slug: 'phin-khac-logo-qua-tang-doanh-nghiep',
                excerpt: { en: 'Why a custom-engraved coffee filter is the best business gift you can give.', vi: 'Tại sao phin cà phê khắc logo là món quà doanh nghiệp tốt nhất.' },
                content: { en: '<p>In a world of generic gifts, a personalized coffee filter stands out...</p>', vi: '<p>Trong thế giới quà tặng thông thường, phin cà phê khắc logo nổi bật...</p>' },
                status: 'Published',
                views: 856,
            },
            {
                title: { en: 'SS304 vs Aluminum Coffee Filters – Which Should You Choose?', vi: 'Inox 304 vs Nhôm Định Hình – Chất Liệu Nào Phù Hợp?' },
                slug: 'inox-304-vs-nhom-dinh-hinh-chat-lieu-nao-phu-hop',
                excerpt: { en: 'A comprehensive guide comparing stainless steel and aluminum coffee filters.', vi: 'Hướng dẫn so sánh toàn diện giữa phin inox và phin nhôm.' },
                content: { en: '<p>Choosing the right material for your coffee filter depends on a few factors...</p>', vi: '<p>Việc chọn chất liệu phin cà phê phụ thuộc vào một số yếu tố...</p>' },
                status: 'Draft',
                views: 0,
            },
        ]);
        console.log('  ✓ 3 blog posts created');

        // ---- Seed Users ----
        console.log('👤 Seeding admin users...');
        await User.insertMany([
            { name: 'Admin', email: 'admin@phingift.vn', role: 'Super Admin', isActive: true },
            { name: 'Manager', email: 'manager@phingift.vn', role: 'Manager', isActive: true },
        ]);
        console.log('  ✓ 2 admin users created');

        console.log('\n🎉 Seed complete! Database is ready.');
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
    } finally {
        await mongoose.disconnect();
    }
}

seed();
