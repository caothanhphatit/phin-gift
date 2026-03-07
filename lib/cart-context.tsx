'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface CartItem {
    id: string;
    productId: string;
    productSlug: string;
    productName: string;
    attributes?: Record<string, string>; // e.g. { size: 'Standard', color: 'Silver' } or { "kích thước": "Tiêu chuẩn" }
    engravingText: string;
    price: number;
    quantity: number;
    image: string;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
}

type CartAction =
    | { type: 'ADD_ITEM'; payload: CartItem }
    | { type: 'REMOVE_ITEM'; payload: string }
    | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
    | { type: 'CLEAR_CART' }
    | { type: 'TOGGLE_CART' }
    | { type: 'CLOSE_CART' }
    | { type: 'SET_ITEMS'; payload: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existingIndex = state.items.findIndex((item) => item.id === action.payload.id);
            if (existingIndex > -1) {
                return {
                    ...state,
                    items: state.items.map((item, index) =>
                        index === existingIndex
                            ? { ...item, quantity: item.quantity + action.payload.quantity }
                            : item
                    ),
                };
            }
            return { ...state, items: [...state.items, action.payload] };
        }
        case 'REMOVE_ITEM':
            return { ...state, items: state.items.filter((item) => item.id !== action.payload) };
        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items.map((item) =>
                    item.id === action.payload.id
                        ? { ...item, quantity: Math.max(1, action.payload.quantity) }
                        : item
                ),
            };
        case 'CLEAR_CART':
            return { ...state, items: [] };
        case 'TOGGLE_CART':
            return { ...state, isOpen: !state.isOpen };
        case 'CLOSE_CART':
            return { ...state, isOpen: false };
        case 'SET_ITEMS':
            return { ...state, items: action.payload };
        default:
            return state;
    }
}

interface CartContextType {
    state: CartState;
    dispatch: React.Dispatch<CartAction>;
    totalItems: number;
    totalPrice: number;
    addToCart: (item: Omit<CartItem, 'id'>) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

    // Load cart from localStorage on init
    React.useEffect(() => {
        const savedCart = localStorage.getItem('phin_gift_cart');
        if (savedCart) {
            try {
                const items = JSON.parse(savedCart);
                if (Array.isArray(items)) {
                    dispatch({ type: 'SET_ITEMS', payload: items });
                }
            } catch (e) {
                console.error('Failed to parse cart from localStorage', e);
            }
        }
    }, []);

    // Save cart to localStorage on change
    React.useEffect(() => {
        localStorage.setItem('phin_gift_cart', JSON.stringify(state.items));
    }, [state.items]);

    const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const addToCart = (item: Omit<CartItem, 'id'>) => {
        // Stringify attributes for unique ID generation
        const attrStr = item.attributes
            ? Object.entries(item.attributes).sort(([k1], [k2]) => k1.localeCompare(k2)).map(([k, v]) => {
                const valStr = v && typeof v === 'object' ? (v as any).en || (v as any).vi : String(v);
                return `${k}:${valStr}`;
            }).join('|')
            : 'no-attrs';
        const id = `${item.productId}-${attrStr}-${item.engravingText || 'no-engraving'}`;
        dispatch({ type: 'ADD_ITEM', payload: { ...item, id } });
    };

    return (
        <CartContext.Provider value={{ state, dispatch, totalItems, totalPrice, addToCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
}
