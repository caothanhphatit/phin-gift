import localProducts from '@/data/products.json';

export interface BilingualString {
    vi: string;
    en: string;
}

export interface ProductVariant {
    size: string;
    color: string;
    image: string;
}

export interface ProductSheet {
    id: string;
    slug: string;
    category: string;
    title: BilingualString;
    description: BilingualString;
    price: number;
    variants: ProductVariant[];
    tags: string[];
}

const SHEET_ID = '1unmx_GLWFZQzRiHR9cSLt5qnSGaRdjKEFQICktQyuUg';
const SHEET_URL = `https://opensheet.elk.sh/${SHEET_ID}/Sheet1`;

export async function getProducts(): Promise<ProductSheet[]> {
    try {
        const res = await fetch(SHEET_URL, { next: { revalidate: 60 } });

        if (!res.ok) {
            console.warn('Google Sheets API failed or sheet is not public. Using local fallback.');
            return localProducts as ProductSheet[];
        }

        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
            console.warn('Google Sheet is empty or malformed. Using local fallback.');
            return localProducts as ProductSheet[];
        }

        // Parse sheet records into structured products
        return data.map((row: any) => ({
            id: row.id,
            slug: row.slug,
            category: row.category,
            title: {
                vi: row.title_vi || '',
                en: row.title_en || '',
            },
            description: {
                vi: row.description_vi || '',
                en: row.description_en || '',
            },
            price: Number(row.price) || 0,
            variants: row.variants ? JSON.parse(row.variants) : [],
            tags: row.tags ? row.tags.split(',').map((t: string) => t.trim()) : [],
        }));
    } catch (error) {
        console.warn('Error fetching products from Google Sheet:', error);
        return localProducts as ProductSheet[];
    }
}
