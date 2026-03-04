export type ProductMaterial = 'inox' | 'nhom';
export type ProductSize = '150ml' | '200ml' | '500ml';

export interface ProductVariant {
    material: ProductMaterial;
    size: ProductSize;
    price: number;
    sku: string;
    inStock: boolean;
}

export interface Product {
    id: string;
    slug: string;
    name: string;
    shortName: string;
    tagline: string;
    description: string;
    longDescription: string;
    images: string[];
    featured: boolean;
    badge?: string;
    variants: ProductVariant[];
    features: string[];
    specifications: Record<string, string>;
    faq: { question: string; answer: string }[];
    category: 'inox' | 'nhom' | 'custom';
    metaTitle: string;
    metaDescription: string;
}

export const products: Product[] = [
    {
        id: 'phin-inox',
        slug: 'phin-ca-phe-inox',
        name: 'Phin Cà Phê Inox Cao Cấp',
        shortName: 'Phin Inox',
        tagline: 'Tinh tế & Bền vững',
        description: 'Phin cà phê inox 304/430 cao cấp với tùy chọn khắc logo laser. Phù hợp làm quà tặng doanh nghiệp và quà tặng cá nhân.',
        longDescription: `Phin cà phê inox PhinGift được làm từ thép không gỉ 304/430 cao cấp, 
    đảm bảo an toàn thực phẩm và độ bền vượt trội theo thời gian. 
    Thiết kế quai cong tinh tế, dễ cầm nắm. 
    Hỗ trợ khắc logo, tên, hoặc thiết kế tùy ý theo yêu cầu khách hàng.`,
        images: [
            '/images/products/phin-inox.jpg',
            '/images/products/phin-collection.jpg',
            '/images/craftsmanship/laser-engraving.jpg',
        ],
        featured: true,
        badge: 'Bán chạy',
        category: 'inox',
        variants: [
            { material: 'inox', size: '150ml', price: 180000, sku: 'PG-INX-150', inStock: true },
            { material: 'inox', size: '200ml', price: 220000, sku: 'PG-INX-200', inStock: true },
            { material: 'inox', size: '500ml', price: 290000, sku: 'PG-INX-500', inStock: true },
        ],
        features: [
            'Inox 304/430 không gỉ, an toàn thực phẩm',
            'Khắc laser chính xác cao, sắc nét',
            'Quai cong tinh tế, dễ cầm nắm',
            'Phù hợp pha 1–3 tách cà phê',
            'Bộ lọc mịn giữ lại cặn cà phê tốt',
            'Chịu nhiệt độ cao, dễ vệ sinh',
        ],
        specifications: {
            'Chất liệu': 'Inox 304 / Inox 430',
            'Màu sắc': 'Silver, Gold (PVD), Bronze (PVD), Black (PVD)',
            'Kích thước': '7 / 8 / 9 (serving size)',
            'Dung tích': '150ml / 200ml / 500ml',
            'Xuất xứ': 'Made in Vietnam',
            'Khắc laser': 'Có (theo yêu cầu)',
            'MOQ': '≥ 50 phin (Silver/Gold), ≥ 100 phin (Black/Bronze)',
        },
        faq: [
            {
                question: 'Phin inox có thể khắc logo công ty không?',
                answer: 'Có, chúng tôi hỗ trợ khắc laser logo, tên, slogan, hoặc thiết kế tùy ý lên thân hoặc nắp phin. MOQ từ 50 phin trở lên.',
            },
            {
                question: 'Mất bao lâu để sản xuất đơn hàng số lượng lớn?',
                answer: 'Thời gian sản xuất thông thường từ 7–10 ngày làm việc sau khi xác nhận đơn hàng và thiết kế.',
            },
            {
                question: 'Phin inox có an toàn thực phẩm không?',
                answer: 'Có, phin được làm từ inox 304 hoặc 430 đạt tiêu chuẩn an toàn thực phẩm, không nhiễm kim loại nặng vào cà phê.',
            },
            {
                question: 'Cách vệ sinh phin inox?',
                answer: 'Rửa bằng nước ấm và xà phòng nhẹ sau mỗi lần sử dụng. Không nên dùng bột tẩy rửa mạnh để tránh ảnh hưởng lớp mạ PVD.',
            },
        ],
        metaTitle: 'Phin Cà Phê Inox Cao Cấp | Khắc Logo Theo Yêu Cầu – PhinGift',
        metaDescription: 'Phin cà phê inox 304/430 khắc logo laser theo yêu cầu. Quà tặng doanh nghiệp cao cấp. Nhiều màu sắc, kích thước. Sỉ từ 50 phin. Giao hàng toàn quốc.',
    },
    {
        id: 'phin-nhom',
        slug: 'phin-ca-phe-nhom',
        name: 'Phin Cà Phê Nhôm Màu Sắc',
        shortName: 'Phin Nhôm',
        tagline: 'Truyền thống & Đa sắc',
        description: 'Phin cà phê nhôm định hình cao cấp với lớp anodize bền màu. Hơn 15 màu sắc tùy chọn, phù hợp cho mọi phong cách.',
        longDescription: `Phin cà phê nhôm PhinGift được làm từ nhôm định hình (extruded aluminum) 
    với lớp phủ anodize bền màu, kháng nước và kháng mài mòn cao. 
    Đây là lựa chọn truyền thống với trọng lượng nhẹ hơn inox, 
    phù hợp cho quán cà phê, homestay và làm quà tặng đặc biệt.`,
        images: [
            '/images/products/phin-collection.jpg',
            '/images/products/phin-inox.jpg',
            '/images/craftsmanship/laser-engraving.jpg',
        ],
        featured: true,
        badge: 'Đa màu sắc',
        category: 'nhom',
        variants: [
            { material: 'nhom', size: '150ml', price: 120000, sku: 'PG-NHM-150', inStock: true },
            { material: 'nhom', size: '200ml', price: 150000, sku: 'PG-NHM-200', inStock: true },
            { material: 'nhom', size: '500ml', price: 190000, sku: 'PG-NHM-500', inStock: true },
        ],
        features: [
            'Nhôm định hình cao cấp, nhẹ tay',
            'Lớp anodize bền màu, hơn 15 màu tùy chọn',
            'Khắc laser sắc nét trên nắp và thân',
            'Phong cách truyền thống Việt Nam',
            'Trọng lượng nhẹ, tiện mang theo',
            'Giữ nhiệt tốt trong quá trình pha',
        ],
        specifications: {
            'Chất liệu': 'Nhôm định hình (Extruded Aluminum)',
            'Lớp phủ': 'Anodize bền màu',
            'Màu sắc': 'Hơn 15 màu: Đỏ, Cam, Vàng, Xanh lá, Xanh dương, Tím, Hồng...',
            'Dung tích': '150ml / 200ml / 500ml',
            'Xuất xứ': 'Made in Vietnam',
            'Khắc laser': 'Có (theo yêu cầu)',
            'MOQ': '≥ 60 phin / màu',
        },
        faq: [
            {
                question: 'Có thể tùy chọn màu sắc theo yêu cầu không?',
                answer: 'Có, chúng tôi cung cấp hơn 15 màu anodize tiêu chuẩn. Màu custom có thể sản xuất với MOQ cao hơn.',
            },
            {
                question: 'Phin nhôm có khắc laser được không?',
                answer: 'Có, laser khắc trực tiếp lên lớp anodize cho hiệu ứng rất sắc nét và bền đẹp theo thời gian.',
            },
            {
                question: 'So sánh phin nhôm và inox?',
                answer: 'Phin nhôm nhẹ hơn, giá cả phải chăng hơn và nhiều màu sắc hơn. Phin inox bền hơn, cao cấp hơn và có thể mạ PVD gold/bronze.',
            },
        ],
        metaTitle: 'Phin Cà Phê Nhôm Màu Sắc | Khắc Logo Laser – PhinGift',
        metaDescription: 'Phin cà phê nhôm anodize hơn 15 màu, khắc laser theo yêu cầu. Nhẹ, bền màu, giá tốt. Sỉ từ 60 phin. Phù hợp quán cà phê và quà tặng.',
    },
    {
        id: 'phin-custom',
        slug: 'phin-ca-phe-khac-logo',
        name: 'Phin Khắc Logo Doanh Nghiệp',
        shortName: 'Phin Custom',
        tagline: 'Thương hiệu của bạn',
        description: 'Dịch vụ khắc logo doanh nghiệp lên phin cà phê. Tùy chỉnh hoàn toàn: màu sắc, kích thước, thiết kế, bao bì.',
        longDescription: `Dịch vụ tùy chỉnh phin cà phê theo yêu cầu doanh nghiệp của PhinGift. 
    Chúng tôi hỗ trợ khắc laser logo, tên thương hiệu, slogan lên phin inox hoặc nhôm. 
    Phù hợp cho quà tặng sự kiện, hội nghị, Tết doanh nghiệp.`,
        images: [
            '/images/craftsmanship/laser-engraving.jpg',
            '/images/products/phin-inox.jpg',
            '/images/products/phin-collection.jpg',
        ],
        featured: true,
        badge: 'B2B',
        category: 'custom',
        variants: [
            { material: 'inox', size: '150ml', price: 220000, sku: 'PG-CUS-INX-150', inStock: true },
            { material: 'inox', size: '200ml', price: 260000, sku: 'PG-CUS-INX-200', inStock: true },
            { material: 'nhom', size: '150ml', price: 150000, sku: 'PG-CUS-NHM-150', inStock: true },
            { material: 'nhom', size: '200ml', price: 190000, sku: 'PG-CUS-NHM-200', inStock: true },
        ],
        features: [
            'Khắc laser logo độ chính xác cao',
            'Tùy chỉnh màu sắc và vật liệu',
            'Bao bì tùy chỉnh theo yêu cầu',
            'Hỗ trợ thiết kế miễn phí',
            'Giao hàng đúng hẹn',
            'Phù hợp quà tặng doanh nghiệp B2B',
        ],
        specifications: {
            'Chất liệu': 'Inox 304/430 hoặc Nhôm Anodize',
            'Khắc': 'Laser engraving cao cấp',
            'Thiết kế': 'Theo yêu cầu khách hàng',
            'Bao bì': 'Hộp giấy cao cấp (tùy chọn)',
            'MOQ': '≥ 50 phin',
            'Thời gian': '7–14 ngày làm việc',
            'Xuất xứ': 'Made in Vietnam',
        },
        faq: [
            {
                question: 'Quy trình đặt hàng B2B như thế nào?',
                answer: 'Liên hệ qua WhatsApp/Email → Gửi thiết kế → Xác nhận mẫu → Thanh toán 50% → Sản xuất → Giao hàng.',
            },
            {
                question: 'Có hỗ trợ thiết kế không?',
                answer: 'Có, đội ngũ thiết kế của chúng tôi hỗ trợ tư vấn và tạo file thiết kế cho khách hàng hoàn toàn miễn phí.',
            },
        ],
        metaTitle: 'Phin Cà Phê Khắc Logo Doanh Nghiệp | Quà Tặng B2B – PhinGift',
        metaDescription: 'Dịch vụ khắc logo doanh nghiệp lên phin cà phê inox/nhôm cao cấp. Quà tặng sự kiện, hội nghị, Tết doanh nghiệp. MOQ từ 50 phin.',
    },
];

export function getProductBySlug(slug: string): Product | undefined {
    return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
    return products.filter((p) => p.featured);
}

export function getProductPrice(product: Product, material: ProductMaterial, size: ProductSize): number {
    const variant = product.variants.find(
        (v) => v.material === material && v.size === size
    );
    return variant?.price ?? product.variants[0]?.price ?? 0;
}

export const materialLabels: Record<ProductMaterial, string> = {
    inox: 'Inox (thép không gỉ)',
    nhom: 'Nhôm (anodize)',
};

export const sizeLabels: Record<ProductSize, string> = {
    '150ml': '150ml (1 tách)',
    '200ml': '200ml (1–2 tách)',
    '500ml': '500ml (2–3 tách)',
};
