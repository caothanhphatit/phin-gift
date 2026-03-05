'use client';

import { Upload, Search, Trash2, Copy, Grid, List } from 'lucide-react';

const mediaItems = [
    { id: 1, name: 'phin-inox-304.jpg', size: '2.4 MB', url: '/images/products/phin-inox.jpg', type: 'image', date: '2026-03-01' },
    { id: 2, name: 'hero-coffee-pour.jpg', size: '3.1 MB', url: '/images/hero/phin-coffee-pour.jpg', type: 'image', date: '2026-02-28' },
    { id: 3, name: 'factory-machine-1.jpg', size: '1.8 MB', url: '/images/factory/machine.jpg', type: 'image', date: '2026-02-20' },
    { id: 4, name: 'logo-phingift.png', size: '0.4 MB', url: '/images/logo.png', type: 'image', date: '2026-02-15' },
    { id: 5, name: 'phin-nhom-001.jpg', size: '2.2 MB', url: '/images/products/phin-nhom.jpg', type: 'image', date: '2026-02-10' },
    { id: 6, name: 'b2b-logo-example.jpg', size: '1.6 MB', url: '/images/b2b/logo.jpg', type: 'image', date: '2026-02-05' },
];

const colorPalette = [
    'from-amber-400/30 to-orange-500/20',
    'from-blue-400/30 to-sky-500/20',
    'from-rose-400/30 to-pink-500/20',
    'from-violet-400/30 to-purple-500/20',
    'from-emerald-400/30 to-green-500/20',
    'from-yellow-400/30 to-amber-500/20',
];

export default function MediaPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Media Library</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage your uploaded images via Cloudinary</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-[#C9A84C] hover:bg-[#b8973b] text-black rounded-lg text-sm font-semibold transition-colors">
                    <Upload size={16} />
                    Upload
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg flex-1 max-w-sm">
                    <Search size={15} className="text-gray-500" />
                    <input type="text" placeholder="Search media..." className="bg-transparent text-sm text-white placeholder-gray-500 outline-none flex-1" />
                </div>
                <div className="flex gap-1 bg-white/[0.04] border border-white/[0.08] rounded-lg p-1">
                    <button className="p-2 bg-[#C9A84C]/20 text-[#C9A84C] rounded transition-colors"><Grid size={14} /></button>
                    <button className="p-2 text-gray-500 hover:text-white rounded transition-colors"><List size={14} /></button>
                </div>
            </div>

            {/* Upload Dropzone */}
            <div className="border-2 border-dashed border-white/[0.08] hover:border-[#C9A84C]/40 rounded-xl p-8 text-center transition-colors cursor-pointer">
                <Upload size={28} className="mx-auto text-gray-600 mb-3" />
                <p className="text-gray-400 text-sm">Drag and drop files here, or click to browse</p>
                <p className="text-gray-600 text-xs mt-1">Supports JPG, PNG, WebP up to 5MB each</p>
                <p className="text-xs text-[#C9A84C]/60 mt-2">Uploads securely via Cloudinary</p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {mediaItems.map((item, i) => (
                    <div key={item.id} className="group relative bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden cursor-pointer hover:border-white/[0.12] transition-all">
                        {/* Placeholder image area */}
                        <div className={`aspect-square bg-gradient-to-br ${colorPalette[i % colorPalette.length]} flex items-center justify-center`}>
                            <span className="text-2xl opacity-40">🖼</span>
                        </div>

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                                <Copy size={13} />
                            </button>
                            <button className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors">
                                <Trash2 size={13} />
                            </button>
                        </div>

                        {/* Info */}
                        <div className="p-2">
                            <p className="text-xs text-gray-300 truncate">{item.name}</p>
                            <p className="text-xs text-gray-600 mt-0.5">{item.size}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
