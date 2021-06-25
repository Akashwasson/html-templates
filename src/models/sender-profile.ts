import { ProfileData } from "./profile-data.model";
import { User } from "./sender-profile.model";

export class SenderProfile {
  id: number;
  localId?: string;
  profileName: string;
  profileDataId: number;
  profileDataIdLocal?: string;
  pin: boolean;
  isActive: boolean;
  optionalAttr: string;
  createdStamp: number;
  updatedStamp: number;
  uid?: number;
  profileData: ProfileData;
  device?: any;
  user?: User;
  token?: string;
  firebaseToken?: string;
  onlineDukanData?: {
    deliveryCharges?: {
      freeDeliveryThreshold: number;
      chargesPercentage: number;
      chargesFlat: number;
      isChargesApplicable: 0 | 1;
    };
    domain?: string;
  };
  itemSaleReportHashUrl?: string;
  dayBookHashUrl?: string;
  saleWisePnlHashUrl?: string;
  totalSaleReportHashUrl?: string;
  saleReportHashUrl?: string;
  cashFlowReportHashUrl?: string;
  purchaseReportHashUrl?: string;
  itemOrderReportHashUrl?: string;
  orderReportHashUrl?: string;

  //string[] => profileId in string []
  accessControl?:any

  /**
   * accessControl:{
   *   sales:["32121"],
   *   guest:["43434"],
   *   partner:["34343","9090"]
   * }
   */
}
