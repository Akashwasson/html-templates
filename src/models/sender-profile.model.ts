import {
  ProfileData
} from './profile-data.model';

export class SenderProfile {
    id: number;
    localId?:string;
    profileName:string;
    profileDataId: number;
    profileDataIdLocal?: string;
    pin: boolean;
    isActive: boolean;
    optionalAttr: string;
    createdStamp: number;
    updatedStamp: number;
    profileData: ProfileData;
    user?:User;
    itemSaleReportHashUrl?:string;
    dayBookHashUrl?:string;
    saleWisePnlHashUrl?:string;
    totalSaleReportHashUrl?:string;
    cashFlowReportHashUrl?:string;
    purchaseReportHashUrl?:string;
    saleReportHashUrl?: string;
    itemOrderReportHashUrl?:string;
    orderReportHashUrl?:string;
}

export class User {
    uid: number;
    src: string;
    mdm: string;
    cmp: string;
    trm: string;
    authKey: string;
    username: string;
    email: string;
    email2: string;
    googleId: string;
    facebookId: string;
    phone: string;
    gcm: string;
    password: string;
    passowrdHash: string;
    verificationCode: string | number;
    verified: number;
    isPro: number;
    registrationStamp: number;
    blocked: number;
    directLogin: string;
    loginUrl: string;
    isActive: boolean;
    partyProcessedStamp: number;
    lastActive: number
}
