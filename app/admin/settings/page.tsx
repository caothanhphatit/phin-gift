'use client';

import { Save, Globe, Phone, Instagram, Facebook, Youtube } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-semibold text-white">Settings</h1>
                <p className="text-gray-400 text-sm mt-1">General platform configuration</p>
            </div>

            {/* General */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 space-y-4">
                <h2 className="text-sm font-semibold text-white">General</h2>
                <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Site Name</label>
                    <input type="text" defaultValue="PhinGift" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#C9A84C]/50 transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5">Contact Email</label>
                        <input type="email" defaultValue="info@phingift.vn" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#C9A84C]/50 transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5">Phone</label>
                        <input type="tel" defaultValue="0901234567" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#C9A84C]/50 transition-colors" />
                    </div>
                </div>
                <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Address (Vietnamese)</label>
                    <input type="text" defaultValue="123 Đường Cà Phê, Quận 1, TP.HCM" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#C9A84C]/50 transition-colors" />
                </div>
            </div>

            {/* SEO */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 space-y-4">
                <h2 className="text-sm font-semibold text-white">SEO</h2>
                <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Meta Title (VI)</label>
                    <input type="text" defaultValue="PhinGift – Phin Cà Phê Khắc Logo Cao Cấp" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#C9A84C]/50 transition-colors" />
                </div>
                <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Meta Description (VI)</label>
                    <textarea rows={2} defaultValue="Phin cà phê khắc logo theo yêu cầu..." className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#C9A84C]/50 transition-colors resize-none" />
                </div>
                <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Meta Title (EN)</label>
                    <input type="text" defaultValue="PhinGift – Premium Logo-Engraved Vietnamese Coffee Filter" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#C9A84C]/50 transition-colors" />
                </div>
            </div>

            {/* Social Links */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 space-y-4">
                <h2 className="text-sm font-semibold text-white">Social Links</h2>
                {[
                    { icon: Facebook, label: 'Facebook', placeholder: 'https://facebook.com/phingift', key: 'facebook' },
                    { icon: Instagram, label: 'Instagram', placeholder: 'https://instagram.com/phingift', key: 'instagram' },
                    { icon: Youtube, label: 'YouTube', placeholder: 'https://youtube.com/@phingift', key: 'youtube' },
                ].map(({ icon: Icon, label, placeholder }) => (
                    <div key={label} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center">
                            <Icon size={15} className="text-gray-400" />
                        </div>
                        <input type="url" placeholder={placeholder} className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50 transition-colors" />
                    </div>
                ))}
            </div>

            {/* Save */}
            <button className="flex items-center gap-2 px-6 py-2.5 bg-[#C9A84C] hover:bg-[#b8973b] text-black rounded-lg text-sm font-semibold transition-colors">
                <Save size={16} />
                Save Settings
            </button>
        </div>
    );
}
