import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import StorySection from '@/components/home/StorySection';
import DesignSection from '@/components/home/DesignSection';
import CraftsmanshipSection from '@/components/home/CraftsmanshipSection';
import MaterialComparisonSection from '@/components/home/MaterialComparisonSection';
import CustomizationCTA from '@/components/home/CustomizationCTA';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BlogPreview from '@/components/home/BlogPreview';

export const metadata: Metadata = {
  title: 'PhinGift – Phin Cà Phê Khắc Logo | Vietnamese Coffee Filter Gift',
  description:
    'Phin cà phê khắc logo theo yêu cầu – chất liệu inox 304/430 và nhôm anodize cao cấp. Your Coffee. Your Story. Giao hàng toàn quốc.',
  openGraph: {
    title: 'PhinGift – Phin Cà Phê Khắc Logo Cao Cấp',
    description: 'Phin cà phê khắc logo theo yêu cầu. Chất liệu inox và nhôm cao cấp. Quà tặng ý nghĩa.',
    images: [{ url: '/images/hero/phin-coffee-pour.jpg' }],
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StorySection />
      <FeaturedProducts />
      <DesignSection />
      <CraftsmanshipSection />
      <MaterialComparisonSection />
      <CustomizationCTA />
      <BlogPreview />
    </>
  );
}
