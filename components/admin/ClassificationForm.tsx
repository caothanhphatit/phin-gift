'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { ArrowLeft, Save, Plus, Trash2, ListTree, GripVertical, Info, X } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';

type Option = { en: string; vi: string };

type Attribute = {
    code: string;
    name: { en: string; vi: string };
    type: 'text' | 'number' | 'boolean' | 'select';
    options: Option[];
    unit: string;
    isVariantDefining: boolean;
    required: boolean;
};

type ClassificationFormData = {
    name: { en: string; vi: string };
    isActive: boolean;
    attributes: Attribute[];
};

export default function ClassificationForm({
    initialData,
    isEditing = false,
}: {
    initialData?: any;
    isEditing?: boolean;
}) {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, control, handleSubmit, watch, formState: { errors } } = useForm<ClassificationFormData>({
        defaultValues: initialData || {
            name: { en: '', vi: '' },
            isActive: true,
            attributes: [],
        },
    });

    const { fields: attributes, append, remove, move } = useFieldArray({
        control,
        name: 'attributes',
    });

    const onSubmit = async (data: ClassificationFormData) => {
        setSubmitting(true);
        setError(null);
        try {
            // Cleanup empty options or unit if type mismatch
            const cleanedData = {
                ...data,
                attributes: data.attributes.map(attr => ({
                    ...attr,
                    options: attr.type === 'select' ? attr.options.filter(o => o.en || o.vi) : [],
                    unit: attr.type === 'number' ? attr.unit : '',
                }))
            };

            const url = isEditing ? `/api/admin/classifications/${initialData._id}` : '/api/admin/classifications';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cleanedData),
            });

            if (!res.ok) throw new Error('Failed to save');

            router.push('/admin/classifications');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button type="button" onClick={() => router.back()} className="p-2 text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors">
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-white flex items-center gap-2">
                            <ListTree className="text-[#C9A84C]" />
                            {isEditing ? 'Edit Classification' : 'New Classification'}
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                        <input type="checkbox" {...register('isActive')} className="rounded border-gray-600 bg-gray-700 text-[#C9A84C] focus:ring-[#C9A84C]" />
                        Active
                    </label>
                    <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2 px-6 py-2 bg-[#C9A84C] hover:bg-[#b8973b] text-black font-semibold rounded-lg transition-colors disabled:opacity-50">
                        <Save size={16} /> {submitting ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">{error}</div>}

            {/* General Info */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6">
                <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 border-b border-white/[0.05] pb-2">Classification Name</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Name (English) *</label>
                        <input {...register('name.en', { required: true })} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C9A84C] transition-colors" placeholder="e.g. Coffee Phin Specs" />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Name (Vietnamese) *</label>
                        <input {...register('name.vi', { required: true })} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C9A84C] transition-colors" placeholder="e.g. Thông số Phin" />
                    </div>
                </div>
            </div>

            {/* Attributes List */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4 border-b border-white/[0.05] pb-2">
                    <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Dynamic Attributes</h2>
                    <button
                        type="button"
                        onClick={() => append({ code: '', name: { en: '', vi: '' }, type: 'text', options: [], unit: '', isVariantDefining: false, required: false })}
                        className="flex items-center gap-1.5 text-xs text-[#C9A84C] hover:text-[#b8973b] hover:bg-[#C9A84C]/10 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        <Plus size={14} /> Add Attribute
                    </button>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 p-3 rounded-lg text-xs flex items-start gap-2 mb-6">
                    <Info size={14} className="mt-0.5 flex-shrink-0" />
                    <p><strong>Variant Defining:</strong> If checked, this attribute will be used to generate distinct SKUs (e.g. Size, Color, Material). If unchecked, it will be treated as global product specifications (e.g. Dimensions, Weight).</p>
                </div>

                <Reorder.Group axis="y" values={attributes} onReorder={(newOrder) => {
                    // Simple reorder via array iteration
                    newOrder.forEach((item, index) => {
                        const originalIndex = attributes.findIndex(a => a.id === item.id);
                        if (originalIndex !== index) move(originalIndex, index);
                    });
                }} className="space-y-4">
                    {attributes.map((field, index) => (
                        <AttributeCard
                            key={field.id}
                            field={field}
                            index={index}
                            register={register}
                            control={control}
                            watch={watch}
                            onRemove={() => remove(index)}
                        />
                    ))}
                    {attributes.length === 0 && (
                        <div className="text-center py-12 text-gray-500 text-sm border-2 border-dashed border-white/[0.05] rounded-xl">
                            No attributes defined yet. Click "Add Attribute" to begin.
                        </div>
                    )}
                </Reorder.Group>
            </div>
        </form>
    );
}

// Sub-component to keep rendering clean
function AttributeCard({ field, index, register, control, watch, onRemove }: any) {
    const type = watch(`attributes.${index}.type`);

    // Sub-form for options if type is select
    const { fields: options, append: appendOption, remove: removeOption } = useFieldArray({
        control,
        name: `attributes.${index}.options`
    });

    return (
        <Reorder.Item value={field} id={field.id} className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 flex gap-4 items-start">
            <div className="cursor-grab text-gray-600 hover:text-gray-400 mt-2">
                <GripVertical size={18} />
            </div>

            <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-3">
                        <label className="block text-[10px] text-gray-500 uppercase mb-1">Attr Code *</label>
                        <input {...register(`attributes.${index}.code`, { required: true, pattern: /^[a-z0-9_]+$/ })} className="w-full bg-black/30 border border-white/[0.05] rounded-md px-3 py-1.5 text-sm text-white focus:border-[#C9A84C]" placeholder="e.g. material" />
                    </div>
                    <div className="md:col-span-3">
                        <label className="block text-[10px] text-gray-500 uppercase mb-1">Name (EN) *</label>
                        <input {...register(`attributes.${index}.name.en`, { required: true })} className="w-full bg-black/30 border border-white/[0.05] rounded-md px-3 py-1.5 text-sm text-white focus:border-[#C9A84C]" placeholder="e.g. Material" />
                    </div>
                    <div className="md:col-span-3">
                        <label className="block text-[10px] text-gray-500 uppercase mb-1">Name (VI) *</label>
                        <input {...register(`attributes.${index}.name.vi`, { required: true })} className="w-full bg-black/30 border border-white/[0.05] rounded-md px-3 py-1.5 text-sm text-white focus:border-[#C9A84C]" placeholder="e.g. Chất liệu" />
                    </div>
                    <div className="md:col-span-3">
                        <label className="block text-[10px] text-gray-500 uppercase mb-1">Input Type *</label>
                        <select {...register(`attributes.${index}.type`)} className="w-full bg-black/30 border border-white/[0.05] rounded-md px-3 py-1.5 text-sm text-white focus:border-[#C9A84C]">
                            <option value="text">Text (String)</option>
                            <option value="number">Number (Number)</option>
                            <option value="boolean">Toggle (Boolean)</option>
                            <option value="select">Dropdown (Select)</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 items-center bg-black/20 p-3 rounded-lg border border-white/[0.03]">
                    <label className="flex items-center gap-2 text-xs text-gray-300">
                        <input type="checkbox" {...register(`attributes.${index}.required`)} className="rounded border-gray-600 bg-gray-700 text-[#C9A84C] focus:ring-[#C9A84C]" />
                        Required Field
                    </label>
                    <label className="flex items-center gap-2 text-xs text-[#C9A84C] font-medium ml-4">
                        <input type="checkbox" {...register(`attributes.${index}.isVariantDefining`)} className="rounded border-gray-600 bg-gray-700 text-[#C9A84C] focus:ring-[#C9A84C]" />
                        Variant Defining (Creates SKU)
                    </label>

                    {type === 'number' && (
                        <div className="ml-auto flex items-center gap-2">
                            <span className="text-[10px] text-gray-500 uppercase">Unit:</span>
                            <input {...register(`attributes.${index}.unit`)} className="w-20 bg-black/30 border border-white/[0.05] rounded-md px-2 py-1 text-sm text-white focus:border-[#C9A84C]" placeholder="e.g. ml, cm" />
                        </div>
                    )}
                </div>

                {/* Select Options Config */}
                {type === 'select' && (
                    <div className="bg-[#0F1117] rounded-lg p-4 border border-white/[0.05]">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xs text-gray-400">Dropdown Options</h4>
                            <button type="button" onClick={() => appendOption({ en: '', vi: '' })} className="text-[10px] bg-white/[0.05] hover:bg-white/[0.1] px-2 py-1 rounded text-gray-300 transition-colors">
                                Add Option
                            </button>
                        </div>
                        <div className="space-y-2">
                            {options.map((opt, optIndex) => (
                                <div key={opt.id} className="flex gap-2 items-center">
                                    <input {...register(`attributes.${index}.options.${optIndex}.en`)} className="flex-1 bg-black/30 border border-white/[0.05] rounded-md px-3 py-1.5 text-xs text-white" placeholder="Value (EN) e.g. Silver" />
                                    <input {...register(`attributes.${index}.options.${optIndex}.vi`)} className="flex-1 bg-black/30 border border-white/[0.05] rounded-md px-3 py-1.5 text-xs text-white" placeholder="Value (VI) e.g. Bạc" />
                                    <button type="button" onClick={() => removeOption(optIndex)} className="text-red-400 hover:text-red-300 p-1"><X size={14} /></button>
                                </div>
                            ))}
                            {options.length === 0 && <p className="text-[10px] text-gray-600">No options defined.</p>}
                        </div>
                    </div>
                )}
            </div>

            <button type="button" onClick={onRemove} className="text-gray-500 hover:text-red-400 transition-colors p-1 mt-1">
                <Trash2 size={16} />
            </button>
        </Reorder.Item>
    );
}

