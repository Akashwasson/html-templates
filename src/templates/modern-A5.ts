import { InvoicePrint } from "../models/print.model";
import { commonTempData } from "./commonTempData";

export class ModernA5{

    constructor(
      private data: InvoicePrint,
    ){
    }

    totalSaving = 0;

    async main(){
      return `
      <style>
      ${commonTempData?.invoiceHtmlTemplateCss()}
      </style>
      <div class="container-new arial"
      style="width:210mm;background: white;padding: 0;padding-bottom: 0px;visibility: visible;-webkit-print-color-adjust: exact !important;color-adjust: exact !important;">
        ${this.header()}
        ${this.templateBody()}
        ${await this.footer()}
      </div>
      `
    }

    header(){
      return `
        ${this.sellerDetails()}
        ${this.invoiceTitle()}
        ${this.partyDetails()}`

    }

    async footer(){
      return `
        ${await this.footerAmountCalculation()}
        ${this.footerBankDetails()}
        ${this.footerTNCAndNotes()}`
    }

    templateBody(){
      if(!this.data?.invoiceItems?.length){
        return '';
      }

      let html = '';
      let totalQty = 0;
      let totalCess = 0;
      let isHsn = false;
      let isMrp = false;
      let isTax=false;
      let isDiscount =false;
      let dynamicColumnCount = 0;
      let dynamicColWidthCss;
      let sellOrPurchasePrice;
      let isAdditionlDateField = false;
      let isAdditionlInputField = false;
      let additionlDateFieldTitle = '';
      let additionlInputFieldTitle = '';

      for (let i = 0; i <  this.data?.invoiceItems?.length; i++) {
        let el = this.data?.invoiceItems[i] ;

        if(el?.item && (el?.mrp ||el?.item?.mrp) && el?.sellPrice && !this.data?.isPurchase){
          if(!el?.spIncTax){
            //Exclusive
            this.totalSaving += (((el?.mrp ||el?.item?.mrp) - el?.sellPrice + (el?.discountFlat||0))*el?.quantity)-((el?.totalCess||0) + (el?.totalTax||0));
          } else {
            //Inclusive
            this.totalSaving += ((el?.mrp ||el?.item?.mrp) - el?.sellPrice + (el?.discountFlat||0))*el?.quantity;
          }
        }

        if(el?.hsn && !isHsn){
            isHsn = true;
            dynamicColumnCount++;
        }
        if((el?.mrp ||el?.item?.mrp) && !isMrp){
          isMrp=true;
          dynamicColumnCount++;
        }

        if((el?.totalTax || el?.cess) && !isTax){
            isTax = true;
            dynamicColumnCount++;
        }

        if(el?.totalDiscount && !isDiscount){
          isDiscount = true;
          dynamicColumnCount++;
        }
        if(el?.additionalDateFieldTitle && el?.additionalDateFieldValue && !isAdditionlDateField){
          isAdditionlDateField = true;
          additionlDateFieldTitle = el?.additionalDateFieldTitle
          dynamicColumnCount++;
        }

        if(el?.additionalInputFieldTitle && el?.additionalInputFieldValue && !isAdditionlInputField){
          isAdditionlInputField = true;
          additionlInputFieldTitle = el?.additionalInputFieldTitle
          dynamicColumnCount++;
        }

      }

      if(dynamicColumnCount == 1){
        dynamicColWidthCss = `extraColOne`
      }
      else if(dynamicColumnCount == 2){
        dynamicColWidthCss = `extraColTwo`
      }
      else if(dynamicColumnCount == 3){
        dynamicColWidthCss = `extraColThree`
      }
      else if(dynamicColumnCount == 4){
        dynamicColWidthCss = `extraColFour`
      }

      // Main div , close it in last
      html += `<div style="width: 100%;padding:5px 25px 5px;" class="padding-102525">`;

      // Table close it before main div closing
      html += `<table style="width: 100%; text-align: center;table-layout: fixed;" ${dynamicColumnCount? `class='${dynamicColWidthCss}'`:''}>`;

      html+=`
      <thead
      style="border-bottom: 1px solid ${this.data?.color}; !important;background-color: ${this.data?.color} !important;-webkit-print-color-adjust: exact !important; -webkit-princolor-adjust: exact !important;"
      >
        <th style="text-align: center;color: #ffffff !important;padding:5px;font-size:13px;">#</th>
        <th style="text-align: center;color: #ffffff !important;width: 50%;padding:5px;font-size:13px;">Item Names</th>
        <th style="text-align: center;color: #ffffff !important;padding:5px;font-size:13px;${!isHsn?'display: none':''}">HSN Code</th>
        <th style="text-align: center;color: #ffffff !important;padding:5px;font-size:13px;">Qty</th>
        <th style="text-align: center;color: #ffffff !important;padding:5px;font-size:13px;${!isAdditionlInputField?'display: none':''}">${additionlInputFieldTitle}</th>
        <th style="text-align: center;color: #ffffff !important;padding:5px;font-size:13px;${!isAdditionlDateField?'display: none':''}">${additionlDateFieldTitle}</th>
        <th style="text-align: center;color: #ffffff !important;padding:5px;font-size:13px;${!isMrp?'display: none':''}">MRP</th>
        <th style="text-align: center;color: #ffffff !important;padding:5px;font-size:13px;">₹/Unit</th>
        <th style="text-align: center;color: #ffffff !important;padding:5px;font-size:13px;${!isDiscount?'display: none':''}">Discount</th>
        <th style="text-align: center;color: #ffffff !important;padding:5px;font-size:13px;${!isTax?'display: none':''}">Tax Amt</th>
        <th style="text-align: right;color: #ffffff !important;padding:5px;font-size:13px;">Total</th>
      </thead>
      `
      // close it after applying conditions
      html += `<tbody>`

      for (let i = 0; i < this.data?.invoiceItems?.length; i++) {

        let el = this.data?.invoiceItems[i] ;
        totalQty= totalQty + (+el?.quantity);
        totalCess = totalCess + el?.totalCess;
        sellOrPurchasePrice = this.data?.isPurchase? el?.purchasePrice: el?.sellPrice ;

        html += `
        <tr>
          <td style="text-align: center;padding:5px;-webkit-print-color-adjust: exact !important;color-adjust: exact !important;font-size:13px">${i+1}</td>
          <td class="padding-0515"
            style="text-align: center;width: 50%;overflow: hidden;text-overflow: ellipsis;padding: 5px;white-space: nowrap;-webkit-print-color-adjust: exact !important;color-adjust: exact !important;font-size:13px">
            ${(el?.item?.itemName||'') + (el?.itemDes?'<br>('+el?.itemDes+')':'')}
          </td>
          <td style="-webkit-print-color-adjust: exact !important;color-adjust: exact !important;text-align: center;padding:5px;font-size:13px;${!isHsn?'display: none':''}">${el?.hsn|| ''}</td>
          <td style="-webkit-print-color-adjust: exact !important;color-adjust: exact !important;text-align: center;padding:5px;font-size:13px;">${(el?.quantity||0)+" "+(el?.unit||'')}</td>
          <td style="-webkit-print-color-adjust: exact !important;color-adjust: exact !important;text-align: center;padding:5px;font-size:13px;${!isAdditionlInputField?'display: none':''}">${el?.additionalInputFieldValue||''}</td>
          <td style="-webkit-print-color-adjust: exact !important;color-adjust: exact !important;text-align: center;padding:5px;font-size:13px;${!isAdditionlDateField?'display: none':''}">${el?.additionalDateFieldValue?commonTempData.dateToDDMMYYY(el?.additionalDateFieldValue):''}</td>
          <td style="-webkit-print-color-adjust: exact !important;color-adjust: exact !important;text-align: center;padding:5px;font-size:13px;${!isMrp?'display: none':''}">${(el?.mrp ||el?.item?.mrp)||''}</td>
          <td style="-webkit-print-color-adjust: exact !important;color-adjust: exact !important;text-align: center;padding:5px;font-size:13px;">${sellOrPurchasePrice}</td>
          <td style="-webkit-print-color-adjust: exact !important;color-adjust: exact !important;text-align: center;padding:5px;font-size:13px;${!isDiscount?'display: none':''}">${(el?.totalDiscount?(el?.totalDiscount) +'<br>'+'('+el?.discountPercent+'%'+')':'')}</td>
          <td style="-webkit-print-color-adjust: exact !important;color-adjust: exact !important;text-align: center;padding:5px;font-size:13px;${!isTax?'display: none':''}">
          ${(((el?.totalTax ||0)+(el?.totalCess||0))>0?commonTempData.unitAdjuster((el?.totalTax|| 0)+(el?.totalCess|| 0))+'<br>'+'('+(el?.taxPercentage||0)+(el?.cess?(el?.taxPercentage?'+':'')+el?.cess:'')+')%':'')}
          </td>
          <td style="-webkit-print-color-adjust: exact !important;color-adjust: exact !important;text-align: right;padding:5px;font-size:13px;">${el?.totalAmount}</td>
        </tr>
        `
      }
      // tbody tag closed
      html += `</tbody>`

      html +=`
      <thead class="border" style="border-top: 1px solid #4f4f4f;border-bottom: 1px solid #4f4f4f;border-color:${this.data?.color} !important;-webkit-print-color-adjust: exact !important;color-adjust: exact !important;">
         <th style="text-align: center;padding:5px;font-size:13px;"></th>
         <th style="text-align: center;width: 50%;padding:5px;font-size:13px;">Total</th>
         <th style="text-align: center;padding:5px;font-size:13px;${!isHsn?'display: none':''}"></th>
         <th style="text-align: center;padding:5px;font-size:13px;">${totalQty}</th>
         <th style="text-align: center;padding:5px;font-size:13px;${!isAdditionlInputField?'display: none':''}"></th>
         <th style="text-align: center;padding:5px;font-size:13px;${!isAdditionlDateField?'display: none':''}"></th>
         <th style="text-align: center;padding:5px;font-size:13px;${!isMrp?'display: none':''}"></th>
         <th style="text-align: center;padding:5px;font-size:13px;"></th>
         <th style="text-align: center;padding:5px;font-size:13px;${!isDiscount?'display: none':''}">
         ${(this.data?.discountAmount?'₹'+this.data?.discountAmount:'')}
         </th>
         <th style="text-align: center;padding:5px;font-size:13px;${!isTax?'display: none':''}">
         ${((this.data?.gstAmount||0)+(totalCess))>0?'₹'+commonTempData.unitAdjuster((this.data?.gstAmount||0)+(totalCess)):''}
         </th>
         <th style="text-align: right;padding:5px;font-size:13px;">
         ₹${commonTempData.unitAdjuster((this.data?.totalAmount||0) - (this.data?.additionalAmount||0) + (this.data?.flatDiscount||0))}
         </th>
       </thead>
      `
      html += `</table>`
      html += `</div>`
      return html;
    }

    sellerDetails(){
      // S: OWNER DETAILS
        let html = "";
        // close these two divs in last
        html += `
        <div style="display: flex;flex-wrap:wrap;width: 100%;align-items: flex-start;background: white;padding:5px 25px 5px;"
        class="padding-25 top">
        <div style="display: flow-root;width:100%;text-align:right;font-size: 12px;color: #d3d3d3;" class="f-16">
          ${this.data?.addressTo}
        </div>
        <div style="display: flow-root;width: 80%;">`

        if(this.data?.user?.profileData?.legalName){
            html += `
            <div style="display: flow-root;font-weight: bold;font-size: 24px;color: ${this.data?.color}" class="f-24 f-b">
                ${this.data?.user?.profileData?.legalName}
            </div>`
        }

        if(this.data?.user?.profileData?.addressLine1){
            html +=`
            <div style="display: flow-root;font-size: 14px;color: #000;" class="f-14">
                ${this.data?.user?.profileData?.addressLine1}
            </div>
            `
        }

        if(this.data?.user?.profileData?.contactPersonPhone && this.data?.user?.profileData?.contactPersonPhone!='0'){
            html += `
            <div style="display: flow-root;font-size: 14px;color: #000;" class="f-14">
                ${this.data?.user?.profileData?.contactPersonPhone}
            </div>
            `
        }

        if(this.data?.user?.profileData?.contactPersonEmail){
            html += `
            <div style="display: flow-root;font-size: 14px;color: #000;" class="f-14">
                ${this.data?.user?.profileData?.contactPersonEmail}
            </div>
            `
        }

        if(this.data?.user?.profileData?.gstNumber){
            html += `
            <div style="display: flow-root;font-size: 14px;color: #000;" class="f-14">
                ${this.data?.user?.profileData?.gstNumber}${this.data?.user?.profileData?.addressState?', '+this.data?.user.profileData.addressState:''}
            </div>
            `
        }

        //closing one div out of two
        html+=`</div>`;

        if(this.data?.logo){
            html += `
            <div style="display: flow-root;width: 20%;">
              <img src="${this.data?.logo}" style="display: block;margin-left: auto;width:70%;">
            </div>
            `
        }else{
          html +=`
          <div  class="addLogo" style="display: flow-root;float:right;background: white;width: 20%;margin: 5px 0 7px;height:auto;padding: 5px;display: flex;flex-wrap: wrap;border-radius: 6px;border: 2px dashed #dbb73F;">
            <img src="./assets/icons/upload-photo.png" style="display: block;width:40%;margin: 5px auto;">
            <span style="font-size:14px;width:100%;text-align:center;color: #000;" class="f-16">Upload Logo</span>
          </div>
          `
        }

        //closing last div
        html+=`</div>`;
        // E: OWNER DETAILS

        return html;

    }

    invoiceTitle(){
      let html = '';
    let invoiceTitle = commonTempData.getInvoiceTitle(this.data);

      if(invoiceTitle){
        html += `
        <div style="display: flex;width: 100%;align-items: flex-start;background: white;padding:0 25px 5px;"
        class="padding-002510">
            <div style="width: 100%;text-align: center;font-size: 16px;color: ${this.data?.color};font-weight: bold;" class="f-20 f-b">
            ${invoiceTitle}
            </div>
        </div>
        `
      }
      else {
        html += `
        <div style="display: flex;width: 100%;align-items: flex-start;background: white;padding:0 25px 5px;"
        class="padding-002510">
            <div style="width: 100%;text-align: center;font-size: 16px;color: ${this.data?.color};font-weight: bold;" class="f-20 f-b">
               Tax Invoice
            </div>
        </div>
        `
      }
      return html;
    }

    partyDetails(){
      let el = this.data?.partyInfo.profileData || null;
      let html ='';

      if(!el) return

      // close this div in last
      html +=`
        <div style="display: flex;width: 100%;align-items: flex-start;background: white;padding:0 25px 5px;"
        class="padding-002510">
      `
      //Naming this div as div1, close it after applying conditions
      html +=`
        <div style="display: flow-root;width: 58%;">
      `
      let billTitle = this.data?.isPurchase? 'Bill From': 'Bill To';
      html +=`
        <div style="display: flow-root;font-weight: bold;font-size: 14px;color: #000;" class="f-14 f-b">${billTitle}</div>
      `
      if(el?.legalName){
        html +=`
         <div style="display: flow-root;font-size: 14px;color: #000;" class="f-14">${el?.legalName}</div>
        `
      }

      if(el?.contactPersonName == el?.contactPersonPhone){
        html +=this.commonLeftSideFormatForPartyDetails(el?.contactPersonPhone)
      } else {

        if(el?.contactPersonName){
          if(el?.contactPersonName == "Party Not Available"){
            html+=`
            <div style="display: flow-root;font-size: 14px;color: red;font-weight:bold;" class="f-14 m-5">
                Party Has Been Deleted
            </div>`
          }else{
            html+=`
            <div style="display: flow-root;font-size: 14px;color: #000;font-weight:bold;" class="f-14 m-5">
            ${el?.contactPersonName}
            </div>`
          } 
        }
        if(el?.contactPersonPhone && el?.contactPersonPhone !='0'){
          html +=this.commonLeftSideFormatForPartyDetails(el?.contactPersonPhone)
        }
      }

      if(el?.addressLine1 || el?.addressState){
        html +=`
        <div style="display: flow-root;font-size: 14px;color: #000;" class="f-14 m-5">
          ${el?.addressLine1?el?.addressLine1: ''}${el?.addressState? ', '+el?.addressState:''}${el?.addressPincode?', '+el?.addressPincode:''}
        </div>`
      }

      if(el?.gstNumber){
        html +=this.commonLeftSideFormatForPartyDetails(el?.gstNumber)
      }
      if(el?.udf1T && el?.udf1V){
        let text = `${el?.udf1T? el?.udf1T: ''}${el?.udf1V? ' : '+el?.udf1V:''}`
        html +=this.commonLeftSideFormatForPartyDetails(text)
      }
      if(el?.udf2T && el?.udf2V){
        let text = `${el?.udf2T? el?.udf2T: ''}${el?.udf2V? ' : '+el?.udf2V:''}`
        html +=this.commonLeftSideFormatForPartyDetails(text)
      }
      if(el?.udf3T && el?.udf3V){
        let text = `${el?.udf3T? el?.udf3T: ''}${el?.udf3V? ' : '+el?.udf3V:''}`
        html +=this.commonLeftSideFormatForPartyDetails(text)
      }


/*       if(this.data?.deliveryLocation || this.data?.deliveryState){
        html +=`
        <div style="display: flow-root;font-weight: bold;font-size: 16px;color: #000;margin-top: 5px;" class="f-16 f-b">
           Delivery Address
        </div>
        <div style="display: flow-root;font-size: 16px;color: #000;" class="f-16 m-5">
           ${this.data?.deliveryLocation? this.data?.deliveryLocation: ''}${this.data?.deliveryState? ', '+this.data?.deliveryState:''}
        </div>`
      } */

      if(this.data?.deliveryState || el?.addressOneLine1 || el?.addressOneState) {
        let deliveryState = this.data.deliveryState || el?.addressOneState;
        html +=`
        <div style="display: flow-root;font-weight: bold;font-size: 14px;color: #000;" class="f-14 f-b">
           Delivery Address
        </div>
        <div style="display: flow-root;font-size: 14px;color: #000;" class="f-14 m-5">
           ${el?.addressOneLine1 || ''}${deliveryState? ', '+deliveryState:''}${el?.addressOnePincode?', '+el?.addressOnePincode:''}
        </div>`
      }

      // div1 closed
      html +=`</div>`

    // This is Right side of party Details
    //Naming this div as div2, close it after applying conditions
      html +=`<div style="display: flow-root;width: 42%;align-items: flex-start;flex-wrap: wrap;">`

      if(this.data?.invoiceNo){
        let title = `${this.data?.isEstimate ? 'Estimate No':'Invoice No'}`
        html += this.commonRightSideFormatForPartyDetails(title, this.data?.invoiceNo);
      }

      if(this.data?.purOrderNo && this.data?.purOrderNo != ' ' ){
        html += this.commonRightSideFormatForPartyDetails('PO No',this.data?.purOrderNo);
      }

      if(this.data?.invoiceDateStamp){
        html += this.commonDateFormat('Date', this.data?.invoiceDateStamp);
      }

      let salePurReturnBillTitle = '';
      let salePurReturnDateTitle = '';

      if(this.data?.isPurchaseReturn){
        salePurReturnBillTitle = 'Purchase Bill No';
        salePurReturnDateTitle = 'Purchase Bill Date';
      }
      if(this.data?.isSaleReturn){
        salePurReturnBillTitle = ' Sale Bill No';
        salePurReturnDateTitle = ' Sale Bill Date'
      }

      if((this.data?.isSaleReturn || this.data?.isPurchaseReturn) && this.data?.billNo){
        html += this.commonRightSideFormatForPartyDetails(salePurReturnBillTitle, this.data?.billNo);
      }

      if((this.data?.isSaleReturn || this.data?.isPurchaseReturn) && this.data?.billDateStamp){
        html += this.commonDateFormat(salePurReturnDateTitle, this.data?.billDateStamp);
      }

      if(this.data?.dueDateStamp){
        html += this.commonDateFormat('Due Date', this.data?.dueDateStamp);
      }

      if(this.data?.eWayBillNo){
        html += this.commonRightSideFormatForPartyDetails('E-way Bill No',this.data?.eWayBillNo);
      }

      if(this.data?.eWayBillDate){
        html += this.commonDateFormat('E-way Bill Date', this.data?.eWayBillDate)

      }

      if(this.data?.vehicleNumber){
        html += this.commonRightSideFormatForPartyDetails('Vehicle No',this.data?.vehicleNumber);
      }

      if(this.data?.transporterName){
        html += this.commonRightSideFormatForPartyDetails('Transporter Name',this.data?.transporterName);
      }

      if(this.data?.deliveryDate){
        html += this.commonDateFormat('Delivery Date',this.data?.deliveryDate)
      }

      // div2 closed
      html +=`</div>`
      // main div closed
      html +=`</div>`

      return html;

    }

    async footerAmountCalculation(){
      let totalTaxAmt =0;
      let receivedOrPaidAmt = 0;
      let isTax=false;
      let sameState = false;
      let el = (this.data?.partyInfo?.profileData || null);

      if(el && (el?.addressState == (this.data?.user?.profileData?.addressState))){
        sameState = true;

       }
       else if((!el?.addressState || !(this.data?.user?.profileData?.addressState))){
        sameState = true;
      }


      if(this.data?.gstAmount || this.data?.cessAmount){
          totalTaxAmt = this.data?.gstAmount + this.data?.cessAmount;
          isTax = true;
        }

        if(this.data?.moneyInInfo || this.data?.moneyOut){
          receivedOrPaidAmt = (this.data?.moneyInInfo?.amount || this.data?.moneyOut?.amount)
        }

      let html = '';

      // close this main div in last
      html += `
      <div style="display: flex;width: 100%;align-items: flex-start;background: #ffffff;padding:0 25px 0;"
        class="padding-002500">`;

      //Naming this div as div1, close it after applying conditions
      html += `<div style="display: flow-root;width: 50%;padding: 0 10px 0 0;" class="padding-00100000">`;

      html += `
      <div style="display: flow-root;font-weight: bold;font-size: 14px;color: #000;text-transform: capitalize;"
      class="f-14 f-b">
         Invoice Amount in Words
      </div>
      <div style="display: flow-root;font-size: 14px;color: #000;text-transform: capitalize;" class="f-14">
        ${commonTempData.convertToIndianCurrency((this.data?.totalAmount).toString())}
        </div>`

        let obj = this.data?.user?.profileData || null;

        if (obj && (obj?.bankName || obj?.bankAccountNo || obj?.accountType || obj?.ifscCode || obj?.upi)) {

          if(obj?.upi && this.data?.qrPayLink){
            let qrCodeBase64 = await commonTempData.generateQR(this.data?.qrPayLink);
      
            html += `
            <div style="width: 30%;float: left;" class="m-l-neg-10 m-l-neg-2">
              <img style="width: 100%;" src="${qrCodeBase64}">
            </div>`
          }
  
          if (obj?.bankAccountNo) {
            html += ` <div style="font-weight:bold;font-size: 13px;width: 100%;" class="f-16">Acc No : ${obj?.bankAccountNo}</div>`
          }
          if (obj?.accountType) {
            html += this.commonBankDetailsFormatForFooter('Acc Type : ' + obj?.accountType)
          }
          if (obj?.ifscCode) {
            html+= `<div style="font-size: 13px;width: 100%;" class="f-16">IFSC : ${obj?.ifscCode}${obj?.bankName?', '+obj?.bankName:''}</div>`
          }
          if (obj?.upi) {
            html += this.commonBankDetailsFormatForFooter(obj?.upi)
          }
          else if (!obj?.upi && obj?.bankAccountNo && obj?.ifscCode) {
            html += this.commonBankDetailsFormatForFooter(obj?.bankAccountNo + '@' + obj?.ifscCode + '.ifsc.npci');
          } 
            
        }    

      //closing div1
      html += `</div>`;

      //Naming this div as div2, close it after applying conditions
      html += ` <div style="display: flow-root;width: 50%;align-items: flex-start;flex-wrap: wrap;">`


      let additionalAmount = this.data?.additionalAmount||0
      if(additionalAmount){
        html +=this.commonAmountCalculationFormatForFooter('Labour/Delivery Charges', additionalAmount);
      }

      if(this.data?.flatDiscount){
        html +=this.commonAmountCalculationFormatForFooter('Invoice Discount', `(${commonTempData.unitAdjuster(this.data?.flatDiscount)})`);
      }

      html +=`
      <div
      style="display: flow-root;font-weight: bold;text-transform:uppercase;font-size: 16px;color: #000;width: 50%;float: left;margin-bottom: 5px;"
      class="f-16 f-b m-5">
        Total Amount
      </div>
      <div
      style="display: flow-root;font-size: 16px;color: #000;font-weight: bold;width: 50%;float: left;text-align: right;margin-bottom: 5px;"
      class="f-16 f-b m-5 dv-inv-temp-total-amount">
        ₹${commonTempData.unitAdjuster(this.data?.totalAmount?this.data?.totalAmount:0)}
      </div>`
      let receivedOrPaid = this.data?.isPurchase? 'Paid Amount': 'Received Amount';
      if(receivedOrPaidAmt){
        html +=this.commonAmountCalculationFormatForFooter(receivedOrPaid, commonTempData.unitAdjuster(receivedOrPaidAmt||0));
      }
      let balanceAmt = ((this.data?.totalAmount||0) - receivedOrPaidAmt);
      if(balanceAmt>0){
        html +=this.commonAmountCalculationFormatForFooter('Balance', commonTempData.unitAdjuster(balanceAmt));
      }
      // if(this.data&&this.data?.partyInfo&&this.data?.partyInfo.credit){
      //   html +=this.commonAmountCalculationFormatForFooter('Net Balance', commonTempData.unitAdjuster(this.data?.partyInfo.credit||0));
      // }
      this.totalSaving = (this.totalSaving||0)+(this.data?.flatDiscount||0) ;
      if(this.totalSaving > 0){
        html +=this.commonAmountCalculationFormatForFooter('Total Saving', commonTempData.unitAdjuster(this.totalSaving));
      }
      // div2 closed
      html +=`</div>`
      // main div closed
      html +=`</div>`

      return html;
    }

    footerBankDetails(){
      let html = '';

      // close this div in last
      html +=`
      <div style="display: flex;width: 100%;align-items: flex-start;background: #ffffff;padding:0 25px 0;"
      class="padding-002500">`

      //Naming this div as div1, close it after applying conditions
      html += `
      <div style="display: flex;width: 46%;float: left;margin-bottom: 5px;" class="m-5">
      `

      //TODO: find method for generating Qr code.
      // html += `
      // <div style="width: 30%;padding:10px 10px 10px 0;float: left;" class="padding-13">
      //   <img style="width: 100%;" src="assets/images/QR.png">
      //   <img style="width: 100%;" src="assets/images/upi.png">
      // </div>`

      if(this.data?.tnc){
        html += `
        <div
        style="display: flex;flex-wrap:wrap;width: 100%;float: left;margin-bottom: 5px;background: #ffffff;"
        class="padding-002525 m-5">
          <div style="font-weight: bold;font-size: 13px;width: 100%;" class="f-13 f-b">Terms and Conditions</div>
          <div style="font-size: 13px;width: 100%;" class="f-13">
            ${this.data?.tnc}
          </div>
        </div>
        `
      }
      // div1 closed
      html +=`</div>`;

      html += this.commonSignatureFormatForFooter(commonTempData.whiteLogo,'Customer Signature');
      html += this.commonSignatureFormatForFooter(commonTempData.whiteLogo,'Authorized Signatory');

    // Main div closed
      html +=`</div>`;

      return html;

    }

    footerTNCAndNotes(){
      let html = '';

      if(this.data?.note){
        html += this.commmonTNCAndNotesFormat('Notes',this.data?.note);
      }

      return html;
    }

    commmonTNCAndNotesFormat(title, value){
     return `
        <div
        style="display: flex;flex-wrap:wrap;width: 100%;float: left;margin-bottom: 5px;background: #ffffff;padding:0 25px 5px;"
        class="padding-002525 m-5">
          <div style="font-weight: bold;font-size: 13px;width: 100%;" class="f-13 f-b">${title}</div>
          <div style="font-size: 13px;width: 100%;" class="f-13">
            ${value}
          </div>
        </div>
        `
    }

    commonBankDetailsFormatForFooter(text){
      return ` <div style="font-size: 14px;width: 100%;" class="f-16">${text}</div>`
    }

    commonSignatureFormatForFooter(imgBase64, title){
      //TODO: Add css and If condition if no img
      return `
      <div style="display: flow-root;width: 27%;float: left;margin-bottom: 5px;padding: 0 20px 0;" class="padding-16 m-5">
      <img style="width: 100%;height: 20px;object-fit: contain;object-position: bottom;margin-bottom:5px;" class="m-5" src="${imgBase64}">
      <div style="width: 100%;text-align: center;font-size: 13px;" class="f-16">${title}</div>
      </div>
      `
    }

    commonAmountCalculationFormatForFooter(title, value){
      return `
      <div class="flex" style="display:flex;flex-wrap:wrap;justify-content:flex-start;width:100%;">
      <div style="display: flow-root;font-size: 14px;color: #000;width: 50%;float: left;"
      class="f-14 m-5">
        ${title}
      </div>
      <div
      style="display: flow-root;font-size: 14px;color: #000;width: 50%;float: left;text-align: right;"
      class="f-14 m-5">
         ₹${value}
      </div>
      </div>
      `
    }

    commonLeftSideFormatForPartyDetails(text){
      return `
      <div style="display: flow-root;font-size: 14px;color: #000;" class="f-14 m-5">
          ${text}
      </div>`
    }

    commonRightSideFormatForPartyDetails(title, value){
      return `
      <div class="flex" style="display:flex;flex-wrap:wrap;justify-content:flex-start;width:100%;">
      <div
      style="display: flow-root;font-weight: bold;font-size: 14px;color: #000;width: 50%;float: left;"
      class="f-14 f-b">
        ${title} :
      </div>

      <div
      style="display: flow-root;font-size: 14px;color: #000;width: 50%;float: left;text-align: right;"
      class="f-14">
         ${value}
      </div></div>`
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

