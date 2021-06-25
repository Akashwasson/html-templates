import { Item } from './item.model';

export class ExpenseItem {
    id: number;
    invoiceId: number;
    itemId: number;
    hsn: string;
    sellPrice: number;
    spIncTax: boolean;
    expensePrice: number;
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
    itemIdLocal?:string;
}
