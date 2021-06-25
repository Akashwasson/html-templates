import { Arrays } from '../utils/ReferenceData';

export class MoneyOut {
  id?:number;
  localId:string;
  profileId?: number;
  receiptNo: string;
  partyId: number;
  partyIdLocal: string;
  dateStamp: number;
  amount: number;
  txnMode: string;
  note: string;
  attachment: string;
  txnId: string;
  cancelStamp?: number;
  deletedStamp?: number;
  createdStamp?: number;
  updatedStamp?: number;
  deliveryState?:keyof typeof Arrays.states;
  parentId?: number;
  partyName?:string;
  //have to emove keys beofre call
  indexDbKey?:string;
  isDraft?:boolean;
  bankTxnNo?:string;
  isReconsiled: boolean;
	reconsiledStamp: number;
	refReconsiled: string;
  txnRef ? : string; //if chq
  shareHashUrl?: string;
  paymentDate?: number;
  invoiceIdLocal?:string;
  isDuplicateBillEntry? : boolean;
  isDuplicateInvNo? : boolean;
}
