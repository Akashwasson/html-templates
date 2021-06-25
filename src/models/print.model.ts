import Party from './party.model';
import { SenderProfile } from './sender-profile';
import { Invoice } from './invoice.model';
import { MoneyIn } from './money-in.model';
import { ProfileData } from './profile-data.model';
import { Purchase } from './purchase.model';
import { MoneyOut } from './money-out.model';

export class InvoicePrint extends Invoice {
    user: SenderProfile;
    partyInfo: Party;
    moneyInInfo?: MoneyIn;
    moneyOutInfo?: MoneyOut;
    signature?: string;
    logo?: string;
    payLink?: string;
    qrPayLink?:string;
    isEstimate?:boolean|undefined;
    isPurchase?:boolean|undefined;
    isSaleReturn?:boolean|undefined;
    isPurchaseReturn?:boolean|undefined;
    isMoneyIn?:boolean|undefined;
    isMoneyOut?:boolean|undefined;
    moneyOut?:MoneyOut;
    addressTo?: string;
    showSignatureNotRequiredText?:boolean;
    showSignatureInTemplates?: boolean;
    makeItemNameBold?:boolean;
    roundOffValue?:number
}

export class MoneyInPrint extends MoneyIn {
    user: SenderProfile;
    partyInfo: Party;
    signature?: string;
    logo?: string;
}

export class MoneyOutPrint extends MoneyOut {
    user: SenderProfile;
    partyInfo: Party;
    signature?: string;
    logo?: string;
}

export class PurchasePrint extends Purchase {
    user: SenderProfile;
    partyInfo: ProfileData;
    items?: any;    
    logo?: string;
    isPurchase?:boolean|undefined;
    isSaleReturn?:boolean|undefined;
    moneyOutInfo: MoneyOut;
    signature?: string;
}