export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: BlogSection[];
    category: string;
    readingTime: number;
    publishedAt: string;
    image: string;
    imageAlt: string;
    tags: string[];
    relatedProducts: string[];
    metaTitle: string;
    metaDescription: string;
}

export interface BlogSection {
    type: 'paragraph' | 'heading' | 'image' | 'list' | 'cta';
    content?: string;
    items?: string[];
    src?: string;
    alt?: string;
    href?: string;
    label?: string;
}

export const blogPosts: BlogPost[] = [
    {
        id: '1',
        slug: 'cach-pha-ca-phe-phin',
        title: 'Cách Pha Cà Phê Phin Đúng Chuẩn – Bí Quyết Từ Người Việt',
        excerpt: 'Khám phá nghệ thuật pha cà phê phin truyền thống Việt Nam: từ cách chọn cà phê, điều chỉnh ép phin, đến bí quyết có ly cà phê đậm đà, thơm ngon nhất.',
        category: 'Hướng dẫn pha chế',
        readingTime: 6,
        publishedAt: '2024-12-15',
        image: '/images/hero/phin-coffee-pour.jpg',
        imageAlt: 'Cách pha cà phê phin đúng chuẩn Việt Nam',
        tags: ['cách pha cà phê phin', 'pha cà phê phin', 'bí quyết pha phin'],
        relatedProducts: ['phin-ca-phe-inox', 'phin-ca-phe-nhom'],
        metaTitle: 'Cách Pha Cà Phê Phin Đúng Chuẩn Việt Nam | PhinGift',
        metaDescription: 'Hướng dẫn cách pha cà phê phin đậm đà, thơm ngon theo đúng phong cách Việt Nam. Tỷ lệ cà phê, nhiệt độ nước, thời gian pha và các mẹo hay từ chuyên gia.',
        content: [
            { type: 'paragraph', content: 'Phin cà phê là biểu tượng của văn hóa uống cà phê Việt Nam. Một ly cà phê phin đúng chuẩn không chỉ là thức uống – đó là một nghi thức, một khoảnh khắc dừng lại giữa cuộc sống bộn bề.' },
            { type: 'heading', content: '1. Chọn Đúng Loại Cà Phê' },
            { type: 'paragraph', content: 'Cà phê Robusta Tây Nguyên là lựa chọn hàng đầu cho phin. Với hàm lượng caffeine cao và hương vị đậm đà, đắng nhẹ, đây là nền tảng hoàn hảo cho cà phê sữa đá Việt Nam. Tỷ lệ rang xay: rang vừa đến rang đậm (medium-dark to dark roast).' },
            { type: 'heading', content: '2. Chuẩn Bị Phin' },
            { type: 'list', items: ['Tháo ép phin ra, xếp đáy phin vừa khớp miệng ly', 'Cho 20–25g cà phê xay vào phin (khoảng 2–3 muỗng canh)', 'Đặt ép phin nhẹ xuống, không nén quá chặt', 'Đặt phin lên miệng ly'] },
            { type: 'heading', content: '3. Nhiệt Độ Nước Lý Tưởng' },
            { type: 'paragraph', content: 'Nước quá sôi (100°C) sẽ làm cà phê đắng và mất hương. Nước lý tưởng là 90–95°C – tức là vừa tắt bếp khoảng 30 giây. Đây là bí quyết quan trọng nhiều người bỏ qua.' },
            { type: 'heading', content: '4. Kỹ Thuật Rót Nước' },
            { type: 'list', items: ['Bước 1: Rót 30ml nước vào phin để "bloom" (thấm cà phê trong 30 giây)', 'Bước 2: Rót thêm 100–130ml nước từ từ', 'Bước 3: Chờ 4–6 phút để cà phê nhỏ giọt hoàn toàn', 'Bước 4: Thưởng thức nóng hoặc thêm đá, sữa đặc theo sở thích'] },
            { type: 'heading', content: '5. Mẹo Để Có Ly Cà Phê Ngon Nhất' },
            { type: 'list', items: ['Dùng cà phê xay tươi trong vòng 2 tuần sau khi rang', 'Vệ sinh phin sạch sau mỗi lần dùng', 'Thử nghiệm tỷ lệ cà phê và nước để tìm khẩu vị riêng', 'Phin inox giữ nhiệt tốt hơn, giúp cà phê nhỏ đều hơn'] },
            { type: 'cta', content: 'Xem phin cà phê inox cao cấp', href: '/products/phin-ca-phe-inox', label: 'Mua Phin Ngay' },
        ],
    },
    {
        id: '2',
        slug: 'phin-ca-phe-inox-hay-nhom',
        title: 'Phin Cà Phê Inox Hay Nhôm? So Sánh Chi Tiết Để Chọn Đúng',
        excerpt: 'Bạn đang phân vân giữa phin inox và phin nhôm? Bài viết này so sánh chi tiết về chất liệu, độ bền, giá thành và phù hợp với nhu cầu nào.',
        category: 'So sánh & Tư vấn',
        readingTime: 5,
        publishedAt: '2024-12-20',
        image: '/images/products/phin-collection.jpg',
        imageAlt: 'So sánh phin cà phê inox và nhôm',
        tags: ['phin inox', 'phin nhôm', 'so sánh phin cà phê'],
        relatedProducts: ['phin-ca-phe-inox', 'phin-ca-phe-nhom'],
        metaTitle: 'Phin Cà Phê Inox Hay Nhôm? So Sánh Chi Tiết 2024 | PhinGift',
        metaDescription: 'So sánh chi tiết phin cà phê inox và nhôm: độ bền, chất lượng cà phê, giá cả, khả năng khắc laser. Tư vấn chọn phin phù hợp nhất cho bạn.',
        content: [
            { type: 'paragraph', content: 'Câu hỏi "nên dùng phin inox hay phin nhôm?" là một trong những câu hỏi phổ biến nhất khi chọn mua phin cà phê. Cả hai đều là lựa chọn tốt, nhưng phù hợp với những nhu cầu khác nhau.' },
            { type: 'heading', content: 'Phin Inox – Premium & Bền Bỉ' },
            { type: 'list', items: ['Vật liệu: Thép không gỉ 304/430', 'Độ bền: Cực cao, không bị ăn mòn', 'Giữ nhiệt: Xuất sắc', 'Màu sắc: Silver, Gold PVD, Bronze, Black', 'Giá: Từ 180,000đ', 'Phù hợp: Dùng lâu dài, quà tặng cao cấp'] },
            { type: 'heading', content: 'Phin Nhôm – Đa Sắc & Truyền Thống' },
            { type: 'list', items: ['Vật liệu: Nhôm định hình + lớp anodize', 'Độ bền: Cao, lớp anodize kháng mài mòn', 'Giữ nhiệt: Tốt', 'Màu sắc: Hơn 15 màu tươi sáng', 'Giá: Từ 120,000đ', 'Phù hợp: Quán cà phê, phong cách truyền thống'] },
            { type: 'heading', content: 'Bảng So Sánh Nhanh' },
            { type: 'paragraph', content: 'Khả năng khắc laser: Cả hai đều hỗ trợ khắc laser, nhưng phin nhôm anodize cho hiệu ứng tương phản màu sắc rõ nét hơn khi khắc trên nền màu. Phin inox cho đường nét sắc bén, sang trọng trên nền kim loại.' },
            { type: 'heading', content: 'Kết Luận' },
            { type: 'paragraph', content: 'Chọn phin inox nếu bạn muốn sản phẩm cao cấp, bền lâu và làm quà tặng sang trọng. Chọn phin nhôm nếu bạn muốn nhiều màu sắc, giá phải chăng hơn và phong cách truyền thống Việt.' },
            { type: 'cta', content: 'Xem bộ sưu tập phin của chúng tôi', href: '/products', label: 'Xem Tất Cả Sản Phẩm' },
        ],
    },
    {
        id: '3',
        slug: 'phin-ca-phe-loai-nao-tot',
        title: 'Phin Cà Phê Loại Nào Tốt? Top 5 Tiêu Chí Chọn Phin Chất Lượng',
        excerpt: 'Thị trường phin cà phê ngày càng đa dạng. Bài viết tổng hợp 5 tiêu chí quan trọng nhất để chọn phin chất lượng, bền đẹp và phù hợp nhu cầu sử dụng.',
        category: 'Hướng dẫn chọn mua',
        readingTime: 7,
        publishedAt: '2025-01-05',
        image: '/images/craftsmanship/laser-engraving.jpg',
        imageAlt: 'Tiêu chí chọn phin cà phê tốt nhất',
        tags: ['phin cà phê loại nào tốt', 'chọn phin cà phê', 'phin chất lượng'],
        relatedProducts: ['phin-ca-phe-inox', 'phin-ca-phe-nhom'],
        metaTitle: 'Phin Cà Phê Loại Nào Tốt? Top 5 Tiêu Chí Chọn Phin 2025 | PhinGift',
        metaDescription: 'Top 5 tiêu chí chọn phin cà phê chất lượng: chất liệu, độ mịn bộ lọc, khả năng giữ nhiệt, dễ vệ sinh, và giá trị thẩm mỹ. Hướng dẫn từ chuyên gia.',
        content: [
            { type: 'paragraph', content: 'Một chiếc phin tốt là nền tảng của ly cà phê hoàn hảo. Nhưng với hàng chục thương hiệu và kiểu dáng khác nhau trên thị trường, làm sao biết loại nào thực sự tốt?' },
            { type: 'heading', content: 'Tiêu Chí 1: Chất Liệu An Toàn Thực Phẩm' },
            { type: 'paragraph', content: 'Đây là tiêu chí quan trọng nhất. Phin cần được làm từ vật liệu đạt chuẩn an toàn thực phẩm như inox 304, inox 430, hoặc nhôm anodize thực phẩm. Tránh các phin nhôm không rõ nguồn gốc có thể nhiễm kim loại nặng.' },
            { type: 'heading', content: 'Tiêu Chí 2: Độ Mịn Của Bộ Lọc' },
            { type: 'paragraph', content: 'Bộ lọc của phin phải đủ mịn để giữ cặn cà phê mà vẫn để cà phê nhỏ đều. Lỗ quá to → cặn lọt xuống ly. Lỗ quá nhỏ → cà phê nhỏ chậm, dễ bị đắng. Phin chất lượng thường dùng công nghệ đục lỗ laser.' },
            { type: 'heading', content: 'Tiêu Chí 3: Khả Năng Giữ Nhiệt' },
            { type: 'paragraph', content: 'Phin inox dày giữ nhiệt tốt hơn, giúp cà phê nhỏ đều từ đầu đến cuối. Điều này đặc biệt quan trọng trong mùa đông hoặc khi pha số lượng lớn.' },
            { type: 'heading', content: 'Tiêu Chí 4: Thiết Kế Dễ Vệ Sinh' },
            { type: 'paragraph', content: 'Phin tốt phải có thể tháo rời hoàn toàn để vệ sinh. Các góc cạnh không được quá sắc, không có khe hở khó chùi sạch. Vật liệu không bị hấp thụ mùi cà phê.' },
            { type: 'heading', content: 'Tiêu Chí 5: Giá Trị Thẩm Mỹ & Độ Bền' },
            { type: 'paragraph', content: 'Một chiếc phin đẹp là niềm vui mỗi sáng. Phin PhinGift kết hợp thẩm mỹ và độ bền với công nghệ khắc laser và lớp phủ PVD/anodize bền màu theo thời gian.' },
            { type: 'cta', content: 'Khám phá bộ sưu tập phin chất lượng cao', href: '/products', label: 'Xem Sản Phẩm' },
        ],
    },
    {
        id: '4',
        slug: 'phin-ca-phe-cho-quan',
        title: 'Phin Cà Phê Cho Quán – Giải Pháp Đặt Hàng Sỉ Và Khắc Logo',
        excerpt: 'Nếu bạn đang kinh doanh quán cà phê và muốn tạo dấu ấn thương hiệu riêng, bài viết này sẽ giúp bạn hiểu rõ về dịch vụ phin khắc logo theo yêu cầu cho quán.',
        category: 'Dành cho doanh nghiệp',
        readingTime: 5,
        publishedAt: '2025-01-20',
        image: '/images/products/phin-inox.jpg',
        imageAlt: 'Phin cà phê khắc logo cho quán cà phê',
        tags: ['phin cho quán cà phê', 'phin khắc logo quán', 'phin sỉ quán cà phê'],
        relatedProducts: ['phin-ca-phe-khac-logo', 'phin-ca-phe-inox'],
        metaTitle: 'Phin Cà Phê Cho Quán – Sỉ & Khắc Logo Theo Yêu Cầu | PhinGift',
        metaDescription: 'Dịch vụ phin cà phê khắc logo cho quán: inox hoặc nhôm, nhiều màu và kích thước, sỉ từ 50 phin. Tạo dấu ấn thương hiệu cho quán cà phê của bạn.',
        content: [
            { type: 'paragraph', content: 'Trong thời đại mà khách hàng không chỉ đến quán để uống cà phê mà còn để trải nghiệm và chia sẻ lên mạng xã hội, một chiếc phin khắc logo có thể là điểm nhấn tạo nên sự khác biệt cho quán bạn.' },
            { type: 'heading', content: 'Tại Sao Nên Khắc Logo Lên Phin?' },
            { type: 'list', items: ['Tạo dấu ấn thương hiệu chuyên nghiệp', 'Khách hàng dễ nhận diện và chia sẻ trên mạng xã hội', 'Quà tặng ý nghĩa cho khách hàng trung thành', 'Tăng giá trị thương hiệu tổng thể của quán'] },
            { type: 'heading', content: 'Các Tùy Chọn Cho Quán Cà Phê' },
            { type: 'paragraph', content: 'PhinGift cung cấp phin inox và nhôm với nhiều kích thước cho quán. Phin inox 200ml phù hợp pha 1–2 tách, trong khi phin 500ml lý tưởng cho phục vụ tại bàn hoặc pha theo bình.' },
            { type: 'heading', content: 'Quy Trình Đặt Hàng Sỉ' },
            { type: 'list', items: ['Liên hệ tư vấn qua WhatsApp hoặc email', 'Gửi file logo/thiết kế (AI, PDF, PNG độ phân giải cao)', 'Nhận bản xem trước thiết kế miễn phí', 'Xác nhận đơn hàng → Đặt cọc 50%', 'Sản xuất 7–14 ngày → Giao hàng toàn quốc'] },
            { type: 'heading', content: 'Chính Sách Giá Sỉ' },
            { type: 'paragraph', content: 'Đơn hàng từ 50 phin trở lên được hưởng giá sỉ. Đơn hàng từ 200 phin nhận ưu đãi đặc biệt. Liên hệ trực tiếp để nhận báo giá tốt nhất.' },
            { type: 'cta', content: 'Liên hệ ngay để nhận báo giá sỉ', href: '/contact', label: 'Liên Hệ Ngay' },
        ],
    },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
    return blogPosts.find((p) => p.slug === slug);
}

export function getLatestBlogPosts(count: number = 3): BlogPost[] {
    return [...blogPosts]
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, count);
}
