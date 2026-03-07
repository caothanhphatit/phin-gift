'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, PhoneCall, Mail, Building2, User, Package, Palette, Ruler,
    FileText, StickyNote, Image as ImageIcon, CheckCircle, Clock, Loader2,
    XCircle, ChevronRight, Upload, X, Pencil, Flag
} from 'lucide-react';

const STATUS_OPTIONS = ['Pending', 'Contacted', 'In Progress', 'Completed', 'Cancelled'] as const;
type Status = typeof STATUS_OPTIONS[number];

const statusConfig: Record<Status, { color: string; bg: string; icon: React.ReactNode }> = {
    Pending: { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', icon: <Clock size={14} /> },
    Contacted: { color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', icon: <PhoneCall size={14} /> },
    'In Progress': { color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', icon: <Loader2 size={14} /> },
    Completed: { color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', icon: <CheckCircle size={14} /> },
    Cancelled: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: <XCircle size={14} /> },
};

interface Order {
    _id: string;
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    material: string;
    size: string;
    color: string;
    quantity: number;
    logoImageUrl?: string;
    logoDescription?: string;
    notes?: string;
    finalDesignUrl?: string;
    finalDesignPublicId?: string;
    status: Status;
    createdAt: string;
    updatedAt: string;
}

export default function B2BOrderDetailClient({ order: initialOrder }: { order: Order }) {
    const router = useRouter();
    const [order, setOrder] = useState(initialOrder);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [statusMsg, setStatusMsg] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null); // State for popup

    const handleStatusChange = async (newStatus: Status) => {
        if (newStatus === order.status || updatingStatus) return;
        setUpdatingStatus(true);
        setStatusMsg(null);
        try {
            const res = await fetch(`/api/admin/b2b-orders/${order._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            const json = await res.json();
            if (json.success) {
                setOrder(json.data);
                setStatusMsg(`✓ Updated to "${newStatus}"`);
                setTimeout(() => setStatusMsg(null), 3000);
            } else {
                setStatusMsg('Update failed.');
            }
        } catch {
            setStatusMsg('Network error.');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const cfg = statusConfig[order.status] || statusConfig.Pending;

    return (
        <div className="space-y-5 max-w-4xl relative">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors">
                    <ArrowLeft size={18} />
                </button>
                <div className="flex-1">
                    <h1 className="text-xl font-semibold text-white">{order.companyName}</h1>
                    <p className="text-gray-400 text-sm">{new Date(order.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <span className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium border ${cfg.bg} ${cfg.color}`}>
                    {cfg.icon} {order.status}
                </span>
            </div>

            {/* Status Panel */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
                <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Update Status</p>
                <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map(s => {
                        const c = statusConfig[s];
                        const isActive = order.status === s;
                        return (
                            <button key={s} onClick={() => handleStatusChange(s)} disabled={isActive || updatingStatus}
                                className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-medium border transition-all ${isActive
                                    ? `${c.bg} ${c.color} border-current ring-2 ring-current/30 cursor-default`
                                    : 'bg-white/[0.03] border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.08]'
                                    } ${updatingStatus ? 'opacity-50' : ''}`}
                            >
                                {c.icon} {s} {isActive && <ChevronRight size={10} />}
                            </button>
                        );
                    })}
                </div>
                {statusMsg && <p className="text-xs mt-3 text-green-400">{statusMsg}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contact */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-2"><User size={13} className="text-[#C9A84C]" /> Contact</p>
                    <InfoRow icon={<Building2 size={14} />} label="Company" value={order.companyName} />
                    <InfoRow icon={<User size={14} />} label="Contact" value={order.contactName} />
                    <InfoRow icon={<Mail size={14} />} label="Email" value={<a href={`mailto:${order.email}`} className="text-blue-400 hover:underline">{order.email}</a>} />
                    <InfoRow icon={<PhoneCall size={14} />} label="Phone" value={<a href={`tel:${order.phone}`} className="text-green-400 hover:underline">{order.phone}</a>} />
                </div>

                {/* Specs */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-2"><Package size={13} className="text-[#C9A84C]" /> Order Specs</p>
                    <InfoRow icon={<Package size={14} />} label="Material" value={order.material === 'inox' ? 'Inox (Stainless Steel)' : 'Nhôm (Aluminum)'} />
                    <InfoRow icon={<Ruler size={14} />} label="Size" value={order.size} />
                    <InfoRow icon={<Palette size={14} />} label="Color" value={order.color} />
                    <InfoRow icon={<Package size={14} />} label="Quantity" value={<span className="text-white font-bold text-base">{order.quantity.toLocaleString()} units</span>} />
                </div>
            </div>

            {/* Designs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Request Design (Customer Logo) */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 flex flex-col">
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-1"><Pencil size={13} className="text-[#C9A84C]" /> Request Design</p>
                        <p className="text-[11px] text-gray-600 mb-4">From customer</p>
                    </div>

                    {order.logoImageUrl ? (
                        <div className="flex-1">
                            <div
                                className="relative group cursor-zoom-in"
                                onClick={() => setPreviewImage(order.logoImageUrl!)}
                            >
                                <img src={order.logoImageUrl} alt="Request Design" className="w-full max-h-52 object-contain rounded-lg bg-white/5 border border-white/10 p-2 group-hover:opacity-90 transition-opacity" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-lg">
                                    <ImageIcon className="text-white" size={24} />
                                </div>
                            </div>
                        </div>
                    ) : order.logoDescription ? (
                        <div className="bg-white/[0.03] rounded-lg p-4 flex-1">
                            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1.5"><FileText size={12} /> Design Description</p>
                            <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{order.logoDescription}</p>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm border-2 border-dashed border-white/[0.05] rounded-lg">
                            No design provided
                        </div>
                    )}
                </div>

                {/* Final Design Upload Panel */}
                <DesignUploadPanel
                    orderId={order._id}
                    field="finalDesign"
                    label="Final Design"
                    description="Upload approved / production design"
                    icon={<Flag size={13} className="text-[#C9A84C]" />}
                    currentUrl={order.finalDesignUrl}
                    onUploaded={(updated) => setOrder(updated)}
                    onPreview={(url) => setPreviewImage(url)}
                />

            </div>

            {/* Notes */}
            {order.notes && (
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2"><StickyNote size={13} className="text-[#C9A84C]" /> Notes</p>
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{order.notes}</p>
                </div>
            )}

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
                <a href={`tel:${order.phone}`} className="flex items-center gap-2 px-4 py-2.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/20 transition-colors">
                    <PhoneCall size={14} /> Call {order.contactName}
                </a>
                <a href={`mailto:${order.email}?subject=Re: PhinGift B2B Order – ${order.companyName}`} className="flex items-center gap-2 px-4 py-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-500/20 transition-colors">
                    <Mail size={14} /> Email {order.contactName}
                </a>
            </div>

            {/* Image Popup Modal */}
            <AnimatePresence>
                {previewImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setPreviewImage(null)}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-zoom-out"
                    >
                        <button
                            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                            onClick={() => setPreviewImage(null)}
                        >
                            <X size={24} />
                        </button>
                        <motion.img
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            src={previewImage}
                            alt="Popup Preview"
                            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl cursor-default bg-white/5 border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ── Design Upload Panel ──────────────────────────────────────────────────────
function DesignUploadPanel({
    orderId, field, label, description, icon, currentUrl, onUploaded, onPreview
}: {
    orderId: string;
    field: 'requestDesign' | 'finalDesign';
    label: string;
    description: string;
    icon: React.ReactNode;
    currentUrl?: string;
    onUploaded: (order: any) => void;
    onPreview: (url: string) => void;
}) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Local preview
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }

        setUploading(true);
        setError(null);
        try {
            const fd = new FormData();
            fd.append('field', field);
            fd.append('file', file);

            const res = await fetch(`/api/admin/b2b-orders/${orderId}`, {
                method: 'PATCH',
                body: fd,
            });
            const json = await res.json();
            if (json.success) {
                onUploaded(json.data);
                setPreview(null);
            } else {
                setError(json.error || 'Upload failed');
            }
        } catch {
            setError('Network error');
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    const displayUrl = preview || currentUrl;

    return (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-2">{icon} {label}</p>
                    <p className="text-[11px] text-gray-600 mt-0.5">{description}</p>
                </div>
                <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] text-gray-300 hover:text-white hover:bg-white/[0.08] rounded-lg transition-colors disabled:opacity-50"
                >
                    {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                    {currentUrl ? 'Replace' : 'Upload'}
                </button>
                <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFile} />
            </div>

            {displayUrl ? (
                <div className="relative group cursor-zoom-in" onClick={() => onPreview(currentUrl || displayUrl)}>
                    <img
                        src={displayUrl}
                        alt={label}
                        className="w-full max-h-52 object-contain rounded-lg bg-white/5 border border-white/10 p-2 group-hover:opacity-90 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-lg">
                        <ImageIcon className="text-white" size={24} />
                    </div>
                    {uploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                            <Loader2 size={24} className="animate-spin text-[#C9A84C]" />
                        </div>
                    )}
                </div>
            ) : (
                <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="flex-1 w-full border-2 border-dashed border-white/[0.08] rounded-lg p-8 flex flex-col items-center justify-center gap-2 text-gray-600 hover:text-gray-400 hover:border-white/[0.15] transition-colors disabled:opacity-50"
                >
                    <Upload size={20} />
                    <span className="text-xs">Click to upload</span>
                    <span className="text-[11px] text-gray-700">PNG, JPG, PDF</span>
                </button>
            )}

            {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
        </div>
    );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3">
            <span className="text-gray-600 mt-0.5 flex-shrink-0">{icon}</span>
            <div className="min-w-0">
                <p className="text-[11px] text-gray-500">{label}</p>
                <div className="text-sm text-gray-200 mt-0.5">{value}</div>
            </div>
        </div>
    );
}
