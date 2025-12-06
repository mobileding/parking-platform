// types/domain.ts (New file)

export interface Domain {
    id: number;
    name: string;
    list_price: number | null;
    is_for_sale: boolean;
    landing_page_type: string;
}