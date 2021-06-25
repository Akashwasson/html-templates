import { Arrays } from '../utils/ReferenceData';
import {
  Party
} from './Party';

export class MoneyIn {
  id ? : number;
  localId : string;
  profileId ? : number;
  receiptNo: string;
  partyId: number;
  partyIdLocal: string;
  deliveryState?:keyof typeof Arrays.states;
  dateStamp: number; //set if not
  amount: number;
  txnMode: string;
  txnRef ? : string; //if chq
  note ? : string;
  attachment ? : string;
  txnId ? : string;
  category?:string;
  cancelStamp ? : number;
  deletedStamp ? : number;
  createdStamp ? : number;
  updatedStamp ? : number;
  parentId ? : number;
  partyData ? : Party;
  partyName ? : string;
  shareHashUrl?: string;
  bankTxnNo?:string;
  isReconsiled: boolean;
	reconsiledStamp: number;
	refReconsiled: string;
	indexDbKey?: any;
	isDraft?: boolean;
  invoiceIdLocal?:string;
  isDuplicateBillEntry? : boolean;
  isDuplicateInvNo? : boolean;
}
