import { ProfileData } from './profile-data.model';
export default class Party {
    id: number;
    localId: string;
    userProfileId: number;
    profileDataId: number;
    credit?: number;
    openingBalance?: number;
    isPinned?: number;
    createdStamp?: number;
    updatedStamp?: number;
    profileData?: ProfileData;
    smsAlerts?:number;
    partyStatementHashUrl?:string;
    lastActiveStamp?: number;
    paymentReminderDateStamp?:number;
    tag?:string;
}

export class MyParty {
    id: number;
    name: string;
}


export class Transactin {
    amount: number;
    bill_no: string;
    cancel_stamp: number|null;
    created_stamp: number;
    date: number;
    id: number;
    party_id: number
    type: "Estimate"|"Sale"|"Money Out"|"Purchase"|"Expense"|"Money In";
  }