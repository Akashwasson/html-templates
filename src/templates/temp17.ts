import { InvoicePrint } from "../models/print.model";
import { commonTempData } from "./commonTempData";

export class Temp17{

    constructor(
      private data: InvoicePrint,
      ){
      }

    totalSaving = 0;

    main(){
      return `
      <style>
      ${commonTempData.invoiceHtmlTemplateCss()}
      .three-inch-holder *{
        margin:0;
        padding:0;
      }
      .three-inch-holder b{
        color:#000;
      }
      .three-inch-holder .text-sm{
        font-size:10px;
      }
      </style>
      <div class="container-new arial three-inch-holder"
      style="width:70mm;background: white;padding: 2mm;padding-bottom: 70px;visibility: visible;-webkit-print-color-adjust: exact !important;color-adjust: exact !important;">
        ${this.header()}
        ${this.templateBody()}
        ${this.footer()}
      </div>
      `
    }

    header(){
      return `
        ${this.sellerDetails()}
        ${this.invoiceTitle()}`;

    }

    footer(){
      let domain='';
      if(
         this.data?.user?.onlineDukanData?.domain!=""){
          domain=this.data?.user?.onlineDukanData?.domain;
        }
      return `<div style="text-align:center">
        <p>Thank You!! Visit Again!!</p>
        ${domain?.length>0?`
          <p>Now Order Online @</p>
          <p>https://${domain}.ezo.digital</p>
        `:''}
        
      </div>
      <div class="row" style="margin-top:20px;"><hr/></div>`;
      
    }

    templateBody(){
      let html='';
      html+=`
      <div class="row">
        <hr/>
        <div class="col-xs-6" style="text-align:left">
        <b>Item Name</b>
        </div>
        <div class="col-xs-2" style="text-align:right">
        <b>Qty</b>
        </div>
        <div class="col-xs-2" style="text-align:right">
        <b>Rate</b>
        </div>
        <div class="col-xs-2" style="text-align:right">
        <b>Total</b>
        </div>
        <div class="col-xs-6" style="text-align:left">
        
        </div>
        <div class="col-xs-2" style="text-align:right">
        <span class="text-sm">Tax%</span>
        </div>
        <div class="col-xs-2" style="text-align:right">
        <span class="text-sm">MRP</sapn>
        </div>
        <div class="col-xs-2" style="text-align:right">
        <span class="text-sm">HSN</span>
        </div>
      </div> 
      <div class="row">
        <hr/>
      </div>
      `;
      let totalQty=0;
      let receivedOrPaidAmt = 0;
      let totalTax=0;
      let isTax = false;
      let totalTaxAmt =0;
      let sameState = false;

      let partyInfo = this.data?.partyInfo?.profileData||null;
  
      if( partyInfo && (partyInfo?.addressState == this.data?.user?.profileData?.addressState)){
        sameState = true;
      }
      else if((!partyInfo?.addressState || !(this.data?.user?.profileData?.addressState))){
        sameState = true;
      }
  
      if (this.data?.gstAmount || this.data?.cessAmount) {
        totalTaxAmt = this.data?.gstAmount + this.data?.cessAmount;
        isTax = true;
      }

      if(this.data?.moneyInInfo || this.data?.moneyOut){
        receivedOrPaidAmt = (this.data?.moneyInInfo?.amount || this.data?.moneyOut?.amount ||0);
      }


      for(let i=0;i<this.data?.invoiceItems?.length;i++){
        let invoiceItem=this.data?.invoiceItems[i];
        totalTax+=invoiceItem.totalTax ||0;
        totalQty+=invoiceItem.quantity ||0;
        try{
          html+=this.itemRow(invoiceItem);
        }catch(err){
          console.log(err);
        }
        let el = this.data?.invoiceItems[i] ;
        if(el?.item && el?.item?.mrp && el?.sellPrice && !this.data?.isPurchase){
          if(!el?.spIncTax){
            //Exclusive
            this.totalSaving += ((el?.item?.mrp - el?.sellPrice + (el?.discountFlat||0))*el?.quantity)-((el?.totalCess||0) + (el?.totalTax||0));
          } else {
            //Inclusive
            this.totalSaving += (el?.item?.mrp - el?.sellPrice + (el?.discountFlat||0))*el?.quantity;
          }
        }
      }

      this.totalSaving = (this.totalSaving||0)+(this.data?.flatDiscount||0) ;
      

      html+=`
        <div class="row">
          <hr/>
          <div class="col-xs-6" style="text-align:left">
          Total Items : ${this.data?.invoiceItems.length}
          </div>
          <div class="col-xs-6" style="text-align:right">
          Total Quantity : ${totalQty}
          </div>
        </div>
        <div class="row">
          <hr/>
          `
 
          if (!sameState && isTax) {
            html += this.commonTaxAndAmtDetails('IGST', commonTempData.unitAdjuster(this.data?.gstAmount));
          }
      
          if (sameState && isTax) {
            html += this.commonTaxAndAmtDetails('SGST', commonTempData.unitAdjuster(this.data?.gstAmount / 2));
          }
      
          if (sameState && isTax) {
            html += this.commonTaxAndAmtDetails('CGST', commonTempData.unitAdjuster(this.data?.gstAmount / 2));
          }
      
          if (this.data?.cessAmount) {
            html += this.commonTaxAndAmtDetails('CESS', commonTempData.unitAdjuster(this.data?.cessAmount));
          }

          html +=`
          <div class="col-xs-6"></div>
          <div class="col-xs-3" style="text-align:right"><b>Total</b></div>
          <div class="col-xs-3" style="text-align:right">${this.data?.totalAmount}</div>
          `
          
          let additionalAmount = this.data?.additionalAmount || 0;
          if(additionalAmount){
            html += this.commonTaxAndAmtDetails('Labour/Delivery Charges', additionalAmount);
          }
      
          if (this.data?.flatDiscount) {
            html += this.commonTaxAndAmtDetails('Invoice Discount', `(${commonTempData.unitAdjuster(this.data?.flatDiscount)})`);
          }


        let receivedOrPaid = this.data?.isPurchase? 'Paid Amount': 'Received Amount';
        if(receivedOrPaidAmt){
          html += this.commonTaxAndAmtDetails(receivedOrPaid, commonTempData.unitAdjuster(receivedOrPaidAmt||0));
        }
        let balanceAmt = ((this.data?.totalAmount||0) - receivedOrPaidAmt);
        if(balanceAmt>0){
          html +=this.commonTaxAndAmtDetails('Balance', commonTempData.unitAdjuster(balanceAmt));
        }
  
        if(this.totalSaving > 0){
          html +=this.commonTaxAndAmtDetails('Total Saving', commonTempData.unitAdjuster(this.totalSaving));
        }

        html+=`
          
        </div>
        <div class="row">
          <hr/>
        </div>
      `
      
      return html;
    }

    commonTaxAndAmtDetails(title, value){

      return `
          <div class="col-xs-6"></div>
          <div class="col-xs-3" style="text-align:right">${title}</div>
          <div class="col-xs-3" style="text-align:right">${value}</div>
      `
    }

    itemRow(invoiceItem){
      return `
      <div class="row">
        <div class="col-xs-6" style="text-align:left">
          ${invoiceItem?.itemName}
        </div>
        <div class="col-xs-2" style="text-align:right">
          ${invoiceItem?.quantity}
        </div>
        <div class="col-xs-2" style="text-align:right">
          ${invoiceItem?.sellPrice}
        </div>
        <div class="col-xs-2" style="text-align:right">
          ${invoiceItem?.sellPrice * invoiceItem?.quantity}
        </div>
        <div class="col-xs-6" style="text-align:left">
          ${invoiceItem?.totalDiscount?' Discount : Rs '+invoiceItem?.totalDiscount:''}
        </div>
        <div class="col-xs-2" style="text-align:right">
          <span class="text-sm">${invoiceItem?.taxPercentage?invoiceItem?.taxPercentage+"%":''}</span>
        </div>
        <div class="col-xs-2" style="text-align:right">
          
        </div>
        <div class="col-xs-2" style="text-align:right">
          <span class="text-sm">${invoiceItem?.hsn ||''}</span>
        </div>
      </div>
      `
    }

    sellerDetails(){
        let html = "";
        html+=`<div style="text-align:center">
          <h3>${this.data?.user?.profileData?.legalName ||''}</h3>
          <p>${this.data?.user?.profileData?.addressLine1 || ''}</p>
          <p>${(this.data?.user?.profileData?.contactPersonPhone && this.data?.user?.profileData?.contactPersonPhone!='0')? 'Phone: '+this.data?.user?.profileData?.contactPersonPhone:''}</p>
          <p>${(this.data?.user?.profileData?.contactPersonEmail)? 'Email: '+this.data?.user?.profileData?.contactPersonEmail:''}</p>
          <p>${this.data?.user?.profileData?.gstNumber?'GST Number : '+this.data?.user?.profileData?.gstNumber:''}</p>
        </div>`

        return html;

    }

    invoiceTitle(){
      let party = this.data?.partyInfo?.profileData ||null;
      let html = `
        <div class="row">
          <hr/>
          <div class="col-xs-6">
           <b>Bill No</b>: ${this.data?.invoiceNo ||''}
          </div>
          <div class="col-xs-6" style="text-align:right">
            ${this.data?.invoiceDateStamp?this.commonDateFormat('Date', this.data?.invoiceDateStamp):''}
          </div>
        </div>
        <div class="row">
          <hr/>
          <div class="col-xs-12">
            Bill To : ${party?.contactPersonName}
          </div>
          
        </div>
        <div class="row">
        <hr/>
        </div>
      `;
      
      return html;
    }


    commonDateFormat(dateName, timeStamp){
      return `
        <div
          style="display: flow-root;font-weight: bold;font-size: 14px;color: #000;width: 50%;float: left;"
          class="f-14 f-b m-5">
            ${dateName} :
          </div>

          <div
          style="display: flow-root;font-size: 14px;color: #000;width: 50%;float: left;text-align: right;"
          class="f-14 m-5">
             ${commonTempData.dateToDDMMYYY(timeStamp)}
        </div>
      `
    }


}

