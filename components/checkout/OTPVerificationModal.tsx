'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Mail, MessageCircle, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { useRouter } from '@/i18n/routing';

interface OTPVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerified: (customerId: string) => void;
}

type Step = 'PHONE_INPUT' | 'OTP_INPUT';
type Channel = 'SMS' | 'ZALO';

export default function OTPVerificationModal({ isOpen, onClose, onVerified }: OTPVerificationModalProps) {
    const [step, setStep] = useState<Step>('PHONE_INPUT');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [channel, setChannel] = useState<Channel>('SMS');

    const [otpCode, setOtpCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Countdown timer for resend
    const [timeLeft, setTimeLeft] = useState(0);

    const router = useRouter();

    useEffect(() => {
        if (!isOpen) {
            // Reset state when closed
            setStep('PHONE_INPUT');
            setPhoneNumber('');
            setOtpCode('');
            setError('');
            setTimeLeft(0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleSendOTP = async () => {
        if (!phoneNumber || phoneNumber.length < 9) {
            setError('Vui lòng nhập số điện thoại hợp lệ.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/otp/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber, channel }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Có lỗi xảy ra khi gửi OTP.');
            }

            // Success -> Move to next step
            setStep('OTP_INPUT');
            setTimeLeft(300); // 5 minutes mock
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otpCode || otpCode.length !== 6) {
            setError('Mã OTP phải bao gồm 6 chữ số.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber, otpCode }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Mã OTP không hợp lệ.');
            }

            // Success -> Pass customer ID up
            sessionStorage.setItem('phin_customer_id', data.customerId); // Store temporarily
            sessionStorage.setItem('phin_customer_phone', phoneNumber);

            // Auto fill from database if returning customer
            if (data.customerData && typeof document !== 'undefined') {
                const d = new Date();
                d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
                const expires = "expires=" + d.toUTCString();
                document.cookie = "phin_customer_info=" + encodeURIComponent(JSON.stringify(data.customerData)) + ";" + expires + ";path=/";
            }

            onVerified(data.customerId);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Mask phone number for display
    const maskedPhone = phoneNumber.length > 4
        ? `${phoneNumber.substring(0, 3)}****${phoneNumber.substring(phoneNumber.length - 3)}`
        : phoneNumber;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-white shadow-2xl overflow-hidden rounded-xl border border-[var(--color-cream-dark)]"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-5 border-b border-[var(--color-cream-dark)] bg-[var(--color-cream)]/30">
                            <h2 className="font-serif text-xl text-[var(--color-brown)] font-medium">Bảo Mật Thanh Toán</h2>
                            <button onClick={onClose} className="p-2 -mr-2 text-[var(--color-text-muted)] hover:text-[var(--color-brown)] rounded-full hover:bg-[var(--color-cream)] transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {step === 'PHONE_INPUT' ? (
                                <motion.div
                                    key="phone"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <p className="text-sm text-[var(--color-text-muted)]">
                                        Vui lòng xác thực số điện thoại của bạn trước khi tiếp tục đến trang thanh toán.
                                    </p>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[var(--color-brown)]">Số Điện Thoại</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-text-muted)]">
                                                <Smartphone size={18} />
                                            </div>
                                            <input
                                                type="tel"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))} // only digits
                                                placeholder="VD: 0912345678"
                                                className="w-full pl-10 pr-4 py-3 bg-white border border-[var(--color-cream-dark)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-gold)] transition-all text-[#111] placeholder:text-gray-400"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-[var(--color-brown)]">Phương Thức Nhận Mã OTP</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setChannel('SMS')}
                                                className={`flex items-center justify-center gap-2 py-3 rounded-lg border text-sm font-medium transition-all ${channel === 'SMS'
                                                    ? 'border-[var(--color-gold)] bg-[var(--color-gold)]/5 text-[var(--color-brown)] shadow-sm'
                                                    : 'border-[var(--color-cream-dark)] text-[var(--color-text-muted)] hover:bg-[var(--color-cream)]'
                                                    }`}
                                            >
                                                <MessageCircle size={16} /> SMS
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setChannel('ZALO')}
                                                className={`flex items-center justify-center gap-2 py-3 rounded-lg border text-sm font-medium transition-all ${channel === 'ZALO'
                                                    ? 'border-[#0068FF] bg-[#0068FF]/5 text-[#0068FF] shadow-sm'
                                                    : 'border-[var(--color-cream-dark)] text-[var(--color-text-muted)] hover:bg-[var(--color-cream)]'
                                                    }`}
                                            >
                                                {/* Simple Zalo Logo Placeholder using Mail icon for now */}
                                                <Mail size={16} /> Zalo
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSendOTP}
                                        disabled={loading || phoneNumber.length < 9}
                                        className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Nhận Mã Xác Thực'}
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="otp"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center space-y-2">
                                        <p className="text-sm text-[var(--color-text-muted)]">
                                            Mã xác thực đã được gửi đến số điện thoại
                                        </p>
                                        <p className="font-semibold text-lg text-[var(--color-brown)] tracking-wider">
                                            {maskedPhone}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-center text-[var(--color-brown)]">
                                            Nhập Mã OTP (Dev: 666666)
                                        </label>
                                        <input
                                            type="text"
                                            maxLength={6}
                                            value={otpCode}
                                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                            className="w-full text-center text-3xl tracking-[0.5em] font-mono py-4 bg-[var(--color-cream)]/30 border border-[var(--color-cream-dark)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-gold)] transition-all text-[#111]"
                                            autoFocus
                                        />
                                    </div>

                                    <button
                                        onClick={handleVerifyOTP}
                                        disabled={loading || otpCode.length !== 6}
                                        className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Xác Nhận & Tiếp Tục'}
                                    </button>

                                    <div className="flex flex-col items-center gap-2 pt-2 text-sm text-[var(--color-text-muted)]">
                                        <p>Mã hết hạn sau: <span className="font-mono text-[var(--color-brown)]">{formatTime(timeLeft)}</span></p>

                                        {timeLeft === 0 ? (
                                            <button
                                                onClick={handleSendOTP}
                                                className="text-[var(--color-gold)] font-medium flex items-center gap-1 hover:underline"
                                            >
                                                <RefreshCw size={14} /> Gửi lại mã
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => setStep('PHONE_INPUT')}
                                                className="text-gray-500 hover:text-[var(--color-brown)] underline transition-colors"
                                            >
                                                Thay đổi số điện thoại
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
