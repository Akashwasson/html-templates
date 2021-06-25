import { Item } from './item.model';

export class InvoiceItem {
    id?: number;
    invoiceId?: number;
    itemId?: number;
    itemIdLocal?: string;
    itemDes?:string;
    itemSrl?:string;
    hsn: string;
    itemCode: string;
    sellPrice: number;
    spIncTax: 0|1;
    purchasePrice: number;
    ppIncTax: 0|1;
    taxPercentage: number;
    cess: number;
    unit: string;
    quantity: number;
    discountPercent: number;
    discountFlat: number;
    totalTax: number;
    totalCess: number;
    totalDiscount: number;
    totalAmount: number;
    secondaryUnit?: string;
    convertRatio?: number;
    createdStamp?: number;
    updatedStamp?: number;
    item?: Item;
    itemName?:string;
    isTaxExempted?: 0|1;
    isTaxZero?: 0|1;
    additionalInputFieldValue?:string;
    additionalDateFieldValue?: number;
    additionalInputFieldTitle?:string;
    additionalDateFieldTitle?: string;
    mrp?:number
}