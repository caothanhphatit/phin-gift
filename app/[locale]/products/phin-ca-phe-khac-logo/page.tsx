import B2BCustomOrderForm from '@/components/B2BCustomOrderForm';
import { Metadata } from 'next';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params;
    const defaultMetaTitle = 'PhinGift – Phin Cà Phê Khắc Logo Dành Cho Doanh Nghiệp';
    const defaultMetaDescription = 'Dịch vụ khắc logo doanh nghiệp lên phin cà phê inox/nhôm cao cấp. Quà tặng sự kiện, hội nghị, Tết doanh nghiệp. MOQ từ 50 phin.';
    const isEn = locale === 'en';
    return {
        title: isEn ? 'Custom Logo Coffee Filters for B2B | PhinGift' : defaultMetaTitle,
        description: isEn ? 'Corporate custom logo coffee filters in stainless steel and aluminum. Premium corporate gifts. MOQ starts at 50 units.' : defaultMetaDescription,
    };
}

export default function CustomLogoPage() {
    return (
        <main className="min-h-screen bg-[var(--color-cream)] pt-20">
            <B2BCustomOrderForm />
        </main>
    );
}
