import { ProfileData } from './profile-data.model';
export class Party {
    id: number;
    localId:string;
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
    paymentReminderDateStamp?:number
    searchIndex?:string;
    tag?:string;
    deletedStamp?: number;
    type?: String;
}
