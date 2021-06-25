import { Item } from './item.model';

export class PurchaseItem {
    id: number;
    localId: string;
    invoiceId: number;
    itemId: number;
    itemIdLocal: string;
    hsn: string;
    sellPrice: number;
    spIncTax: boolean;
    purchasePrice: number;
    ppIncTax: boolean;
    taxPercentage: number;
    cess: number;
    unit: string;
    item:Item;
    quantity: number;
    discountPercent: number;
    discountFlat: number;
    totalTax: number;
    totalCess: number;
    totalDiscount: number;
    totalAmount: number;
    secondaryUnit: string;
    convertRatio: number;
    updatedStamp: number;
}
