import { Invoice } from './invoice.model';

export class Estimate extends Invoice {
    invoiceId: number;
    invConvertedStamp: number;
    orderStatus?: OrderStatusEnum;
}

export enum OrderStatusEnum{
    Pending="pending",
    Accepted="accepted",
    Shipping="shipping",
    Delivered="delivered",
    Rejected="rejected",
}