'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductTabsProps {
    description: string;
    specifications?: Record<string, string>;
    usageGuide?: string;
    shippingReturns?: string;
}

export default function ProductTabs({ description, specifications, usageGuide, shippingReturns }: ProductTabsProps) {
    const tabs = [
        { id: 'desc', label: 'Description', content: description },
        { id: 'specs', label: 'Specifications', content: specifications },
        { id: 'usage', label: 'Usage Guide', content: usageGuide },
        { id: 'shipping', label: 'Shipping & Returns', content: shippingReturns },
    ].filter(tab => {
        if (tab.id === 'specs' && tab.content) return Object.keys(tab.content as Record<string, string>).length > 0;
        return !!tab.content;
    });

    const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'desc');

    if (tabs.length === 0) return null;

    return (
        <div className="mt-20 border-t border-[#E5E7EB] pt-12">
            {/* Desktop Tabs / Mobile Scroll */}
            <div className="flex overflow-x-auto scrollbar-none gap-8 border-b border-[#E5E7EB] mb-8 pb-4 snap-x">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`text-sm sm:text-base font-medium whitespace-nowrap snap-center transition-colors relative pb-4 -mb-4 ${activeTab === tab.id ? 'text-[#111111]' : 'text-[#888888] hover:text-[#111111]'}`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTabUnderline"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#111111]"
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[200px]">
                <AnimatePresence mode="wait">
                    {tabs.map((tab) => {
                        if (tab.id !== activeTab) return null;

                        return (
                            <motion.div
                                key={tab.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="text-[#555555] leading-relaxed text-sm sm:text-base space-y-4"
                            >
                                {tab.id === 'specs' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                        {Object.entries(tab.content as Record<string, string>).map(([key, value]) => (
                                            <div key={key} className="flex justify-between py-3 border-b border-[#E5E7EB]">
                                                <span className="text-[#888888]">{key}</span>
                                                <span className="text-[#111111] text-right font-medium">
                                                    {typeof value === 'object' && value !== null ? ((value as any).en || JSON.stringify(value)) : String(value)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="prose max-w-none prose-p:text-[#555555] prose-headings:text-[#111111] prose-a:text-[#111111]">
                                        {/* Assuming plain text formatting for now, splitting on newlines */}
                                        {(tab.content as string).split('\n').map((paragraph, i) => (
                                            <p key={i}>{paragraph}</p>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
