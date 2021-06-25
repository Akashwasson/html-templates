
export class Item {
    id?: number;
    profileId?: number;
    type?: String;
    itemName?: string;
    brandName?: string;
    category?: string;
    itemDes?: string;
    barCode?: string;
    hsn?: string;
    itemCode?: string;
    sellPrice?: number;
    spIncTax?: 0 | 1;
    purchasePrice?: number;
    ppIncTax?: 0 | 1;
    taxPercentage?: number;
    cessPercentage?: number;
    minStock?: number;
    openingStock?: number;
    currentStock?: number;
    primaryUnit?: string;
    secondaryUnit?: string;
    tag?:string;
    convertRatio?: number;
    image?: string;
    image1?: string;
    image2?: string;
    image3?: string;
    image4?: string;
    storage?: string;
    createdStamp?: number;
    updatedStamp?: number;
    deletedStamp?: number;
    onlineDukanItem?: number;
    mrp?:number;
    localId?:string;
    unit?: string;
    itemReportHashUrl?:string;
    isTaxExempted?: 0|1;
    isTaxZero?: 0|1;
    isFav?:boolean;
    partyWeightage?:number;
    itemWeightage?:number;

    //delete this key from db
    uuid?:number;
    additionalInputFieldValue?:string;
    additionalDateFieldValue?: number;
    additionalInputFieldTitle?:string;
    additionalDateFieldTitle?: string;
    state?:any;
    quantityLogs?:any;
    quantity?:any;
}
