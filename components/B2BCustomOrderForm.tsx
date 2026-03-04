'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, CheckCircle, Info } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';

type FormValues = {
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    material: 'inox' | 'nhom';
    size: '150ml' | '200ml' | '500ml';
    color: string;
    designOption: 'upload' | 'describe';
    logoDescription?: string;
    quantity: number;
    notes?: string;
};

export default function B2BCustomOrderForm() {
    const locale = useLocale() as 'vi' | 'en';
    const isEn = locale === 'en';
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const { register, handleSubmit, control, watch, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            material: 'inox',
            size: '200ml',
            color: 'Silver',
            designOption: 'upload',
            quantity: 50,
        }
    });

    const material = watch('material');
    const designOption = watch('designOption');

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        try {
            // Netlify Form Submission Requirements:
            // Must URL-encode the data, including files (which require FormData)
            const formData = new FormData();
            formData.append('form-name', 'b2b-custom-order');

            // Append top level fields
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined) {
                    formData.append(key, value.toString());
                }
            });

            // Append File if uploaded
            if (designOption === 'upload' && uploadedFile) {
                formData.append('logoFile', uploadedFile);
            }

            const res = await fetch('/', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                setIsSuccess(true);
            } else {
                console.error("Netlify form error:", res.status);
                alert(isEn ? "Submission failed. Please try again." : "Lỗi khi gửi form. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error('Failed to submit form:', error);
            alert(isEn ? 'Something went wrong. Please try again.' : 'Đã có lỗi xảy ra. Hãy thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setUploadedFile(e.target.files[0]);
        }
    };

    return (
        <section className="section-padding relative">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-[500px] bg-gradient-to-bl from-[var(--color-gold)]/10 to-transparent rounded-bl-[100px] pointer-events-none" />

            <div className="container-custom max-w-4xl relative z-10">

                {/* 1. Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="heading-display text-[var(--color-brown-dark)] mb-4">
                        {isEn ? 'Custom Logo Coffee Filters' : 'Phin Cà Phê Khắc Logo'}
                    </h1>
                    <p className="text-xl text-[var(--color-brown)] font-serif mb-6">
                        {isEn ? 'Create personalized Vietnamese coffee filters with your company logo.' : 'Sáng tạo phin cà phê mang đậm dấu ấn thương hiệu doanh nghiệp bạn.'}
                    </p>
                    <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
                        {isEn
                            ? 'Our custom engraved coffee filters are perfect for corporate gifts, branding campaigns, promotional events, and cafes/restaurants.'
                            : 'Phin cà phê khắc logo của chúng tôi là sự lựa chọn hoàn hảo cho quà tặng doanh nghiệp, chiến dịch quảng bá thương hiệu, và các chuỗi F&B.'}
                    </p>
                </motion.div>

                {/* 2. Minimum Order Notice */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[var(--color-brown)] text-white p-6 rounded-xl shadow-lg border-l-4 border-[var(--color-gold)] mb-12 flex items-start gap-4"
                >
                    <Info className="flex-shrink-0 text-[var(--color-gold)] mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-lg mb-1">
                            {isEn ? 'Minimum order quantity: 50 units' : 'Số lượng đặt hàng tối thiểu (MOQ): 50 phin'}
                        </h3>
                        <p className="text-white/80 text-sm">
                            {isEn
                                ? 'Custom engraving is available exclusively for bulk orders starting from 50 pieces to ensure the highest quality setup and production.'
                                : 'Dịch vụ khắc logo theo yêu cầu áp dụng đặc quyền cho các đơn hàng sỉ từ 50 đơn vị trở lên nhằm đảo bảo chất lượng sản xuất tốt nhất.'}
                        </p>
                    </div>
                </motion.div>

                {/* Netlify requires data-netlify="true" attribute, name="b2b-custom-order" and encType="multipart/form-data" for file uploads */}
                <form
                    name="b2b-custom-order"
                    method="POST"
                    data-netlify="true"
                    encType="multipart/form-data"
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-12 bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100"
                >
                    {/* Hidden input needed by Netlify logic for static sites */}
                    <input type="hidden" name="form-name" value="b2b-custom-order" />

                    {/* 3. Product Customization */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xl font-serif text-[var(--color-brown)] border-b pb-2 mb-6">
                                {isEn ? '1. Product Specifications' : '1. Thông Số Sản Phẩm'}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Material & Size */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
                                            {isEn ? 'Material' : 'Chất Liệu'}
                                        </label>
                                        <div className="flex gap-4">
                                            {(['inox', 'nhom'] as const).map(mat => (
                                                <label key={mat} className="flex-1 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        value={mat}
                                                        className="peer sr-only"
                                                        {...register('material')}
                                                    />
                                                    <div className="text-center p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 peer-checked:border-[var(--color-brown)] peer-checked:bg-[var(--color-cream)] peer-checked:text-[var(--color-brown)] transition-all font-medium">
                                                        {mat === 'inox' ? (isEn ? 'Stainless Steel' : 'Inox Cao Cấp') : (isEn ? 'Aluminum' : 'Nhôm Anodize')}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
                                            {isEn ? 'Size' : 'Kích Thước'}
                                        </label>
                                        <div className="flex gap-3 text-sm">
                                            {(['150ml', '200ml', '500ml'] as const).map(s => (
                                                <label key={s} className="flex-1 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        value={s}
                                                        className="peer sr-only"
                                                        {...register('size')}
                                                    />
                                                    <div className="text-center p-2.5 border-2 border-gray-200 rounded-lg peer-checked:border-[var(--color-brown)] peer-checked:text-[var(--color-brown)] hover:bg-gray-50 transition-all font-medium">
                                                        {s}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Color */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
                                        {isEn ? 'Color Preference' : 'Tùy Chọn Màu Sắc'}
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Silver', 'Black', 'Gold', 'Red', 'Blue'].map(c => (
                                            <label key={c} className="cursor-pointer">
                                                <input
                                                    type="radio"
                                                    value={c}
                                                    className="peer sr-only"
                                                    {...register('color')}
                                                />
                                                <div className="p-3 border-2 border-gray-200 rounded-lg peer-checked:border-[var(--color-brown)] peer-checked:text-[var(--color-brown)] hover:bg-gray-50 transition-all flex items-center gap-2">
                                                    <div className={`w-4 h-4 rounded-full border border-gray-300 shadow-inner ${c === 'Silver' ? 'bg-gray-200' :
                                                        c === 'Black' ? 'bg-gray-800' :
                                                            c === 'Gold' ? 'bg-yellow-500' :
                                                                c === 'Red' ? 'bg-red-600' :
                                                                    'bg-blue-600'
                                                        }`} />
                                                    <span className="font-medium text-sm">
                                                        {isEn ? c :
                                                            c === 'Silver' ? 'Bạc' :
                                                                c === 'Black' ? 'Đen' :
                                                                    c === 'Gold' ? 'Vàng' :
                                                                        c === 'Red' ? 'Đỏ' : 'Xanh'
                                                        }
                                                    </span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. Logo Options */}
                    <div>
                        <h2 className="text-xl font-serif text-[var(--color-brown)] border-b pb-2 mb-6">
                            {isEn ? '2. Logo & Design' : '2. Thiết Kế & Logo'}
                        </h2>

                        <div className="flex gap-4 mb-6">
                            {(['upload', 'describe'] as const).map(opt => (
                                <label key={opt} className="cursor-pointer">
                                    <input
                                        type="radio"
                                        value={opt}
                                        className="peer sr-only"
                                        {...register('designOption')}
                                    />
                                    <div className="px-5 py-2.5 border-2 border-gray-200 rounded-full text-sm font-semibold peer-checked:border-[var(--color-brown)] peer-checked:bg-[var(--color-brown)] peer-checked:text-white transition-all">
                                        {opt === 'upload'
                                            ? (isEn ? 'Upload File' : 'Tải File Lên')
                                            : (isEn ? 'Describe Design' : 'Mô Tả Thiết Kế')}
                                    </div>
                                </label>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            {designOption === 'upload' ? (
                                <motion.div
                                    key="upload"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors relative cursor-pointer group">
                                        <input
                                            type="file"
                                            name="logoFile"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            accept=".png,.jpg,.jpeg,.svg,.pdf"
                                            onChange={handleFileChange}
                                        />
                                        <Upload className="mx-auto text-gray-400 mb-3 group-hover:text-[var(--color-gold)] transition-colors" size={32} />
                                        {uploadedFile ? (
                                            <div className="text-sm font-medium text-[var(--color-brown)]">
                                                {uploadedFile.name}
                                            </div>
                                        ) : (
                                            <>
                                                <div className="text-sm font-semibold text-gray-700">
                                                    {isEn ? 'Click or drag file to this area to upload' : 'Nhấp hoặc thả file vào đây để tải lên'}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {isEn ? 'Accepted formats: PNG, JPG, SVG, PDF' : 'Định dạng hỗ trợ: PNG, JPG, SVG, PDF'}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="describe"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <textarea
                                        {...register('logoDescription')}
                                        rows={4}
                                        className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent outline-none transition-shadow"
                                        placeholder={isEn
                                            ? "Describe the logo you want (text, icon, brand name, style, etc.)"
                                            : "Mô tả chi tiết logo bạn mong muốn (văn bản, biểu tượng, tên thương hiệu, phong cách...)"}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <p className="text-sm text-gray-500 mt-4 flex gap-2">
                            <span className="text-[var(--color-gold)]">✨</span>
                            {isEn ? 'Your custom coffee filter will be engraved with your company logo precisely.' : 'Phin cà phê của bạn sẽ được khắc logo công ty một cách tinh xảo.'}
                        </p>
                    </div>

                    {/* 5. Business Information Form */}
                    <div>
                        <h2 className="text-xl font-serif text-[var(--color-brown)] border-b pb-2 mb-6">
                            {isEn ? '3. Contact Information' : '3. Thông Tin Liên Hệ'}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700">{isEn ? 'Company Name *' : 'Tên Công Ty *'}</label>
                                <input
                                    {...register('companyName', { required: true })}
                                    className={`w-full border ${errors.companyName ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent outline-none`}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700">{isEn ? 'Contact Person *' : 'Người Liên Hệ *'}</label>
                                <input
                                    {...register('contactPerson', { required: true })}
                                    className={`w-full border ${errors.contactPerson ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent outline-none`}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700">Email *</label>
                                <input
                                    type="email"
                                    {...register('email', {
                                        required: true,
                                        pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                                    })}
                                    className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent outline-none`}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700">{isEn ? 'Phone Number *' : 'Số Điện Thoại *'}</label>
                                <input
                                    {...register('phone', { required: true })}
                                    className={`w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent outline-none`}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700">{isEn ? 'Estimated Quantity *' : 'Số Lượng Dự Kiến *'}</label>
                                <input
                                    type="number"
                                    {...register('quantity', { required: true, min: 50 })}
                                    className={`w-full border ${errors.quantity ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent outline-none`}
                                />
                                {errors.quantity && <span className="text-xs text-red-500">{isEn ? 'Minimum 50 units required' : 'Yêu cầu tối thiểu 50 đơn vị'}</span>}
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-sm font-semibold text-gray-700">{isEn ? 'Additional Notes' : 'Ghi chú thêm'}</label>
                                <textarea
                                    {...register('notes')}
                                    rows={3}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 6. Submit Button */}
                    <div className="pt-6 border-t border-gray-100 text-center md:text-right">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`btn-primary w-full md:w-auto text-lg px-12 py-4 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting
                                ? (isEn ? 'Submitting...' : 'Đang gửi...')
                                : (isEn ? 'Submit Custom Order' : 'Gửi Yêu Cầu Đặt Hàng')}
                        </button>
                    </div>

                </form>
            </div>

            {/* Success Modal */}
            <AnimatePresence>
                {isSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative text-center"
                        >
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle size={32} />
                            </div>

                            <h3 className="text-2xl font-serif text-[var(--color-brown)] mb-3">
                                {isEn ? 'Request Received' : 'Đã Gửi Yêu Cầu'}
                            </h3>

                            <p className="text-gray-600 mb-8 leading-relaxed">
                                {isEn ? (
                                    <>
                                        Your custom order request has been received.<br /><br />
                                        Thank you for your interest in PhinGift. Our team will review your request and contact you shortly.
                                    </>
                                ) : (
                                    <>
                                        Yêu cầu đặt hàng tùy chỉnh của bạn đã được tiếp nhận.<br /><br />
                                        Cảm ơn bạn đã quan tâm đến PhinGift. Đội ngũ của chúng tôi sẽ xem xét và phản hồi trong thời gian sớm nhất.
                                    </>
                                )}
                            </p>

                            <Link
                                href="/"
                                onClick={() => setIsSuccess(false)}
                                className="inline-block w-full bg-[var(--color-brown)] text-white font-semibold py-3.5 px-6 rounded-lg hover:bg-[var(--color-brown-dark)] transition-colors"
                            >
                                {isEn ? 'Close & Return Home' : 'Đóng & Về Trang Chủ'}
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
