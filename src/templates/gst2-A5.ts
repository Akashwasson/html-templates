import { InvoicePrint } from "../models/print.model";
import { commonTempData } from "./commonTempData";

export class Gst2A5{

    constructor(private data: InvoicePrint){}

    totalSaving = 0;

    async main(){
        return `
        <style>
        ${commonTempData.invoiceHtmlTemplateCss()}
        </style>
        <div class="container-new border-full o-c arial"
        style="display:flow-root;width:210mm;background: white;padding: 0;padding:0;border: 1px solid #4f4f4f;color: #000">
            ${this.header()}
            ${this.templateBody()}
            ${await this.footer()}
        </div>
        `
    }

    header(){
        return `
          ${this.sellerDetails()}
          ${this.partyDetails()}
         `
    }
    async footer(){
        return `
          ${await this.footerAmountCalculation()}
          ${this.footerBankDetails()}
          ${this.footerTNCAndNotes()}
         `
    }
    footerTNCAndNotes() {
      let html = '';

      if (this.data?.note) {
        html += this.commmonTNCAndNotesFormat('Notes', this.data?.note);
      }

      if (this.data?.tnc) {
        html += this.commmonTNCAndNotesFormat('Terms and Conditions', this.data?.tnc);
      }

      return html;
    }

    commmonTNCAndNotesFormat(title, value) {
      return `
          <div
          style="display: flex;flex-wrap:wrap;width: 100%;float: left;margin-bottom: 5px;background: #ffffff;padding:0px 10px;border-top: 1px solid #4f4f4f;"
          class="padding-10 m-5 b-w-t">
            <div style="font-weight: bold;font-size: 13px;width: 100%;" class="f-13 f-b">${title}</div>
            <div style="font-size: 13px;width: 100%;" class="f-13">
              ${value}
            </div>
          </div>
          `
    }

    async footerAmountCalculation(){
        let totalTaxAmt =0;
        let receivedOrPaidAmt = 0;
        let isTax=false;
        let sameState = false;
        let obj = this.data?.user?.profileData || null;
        
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

        //Close this Main div in last

        html +=`<div
        style="display: flex;width: 100%;align-items: flex-start;background: #ffffff;padding:0;border-bottom: 1px solid #4f4f4f;border-top: 1px solid #4f4f4f;overflow:hidden;"
        class="padding-00 b-w-b">`
       //S: Naming this div as div1
        html +=`<div class="padding-10" style="display: flow-root;width: 50%;padding: 10px;">`
        html +=`
        <div style="display: flow-root;font-weight: bold;font-size: 14px;color: #000;text-transform: capitalize;"
        class="f-14 f-b">
        Invoice Amount in Words
        </div>
        <div style="display: flow-root;font-size: 14px;color: #000;text-transform: capitalize;" class="f-14">
        ${commonTempData.convertToIndianCurrency((this.data?.totalAmount).toString())}
        </div>
        `
        if (obj && (obj?.bankName || obj?.bankAccountNo || obj?.accountType || obj?.ifscCode || obj?.upi)) {
  
          if(obj?.upi && this.data?.qrPayLink){
            let qrCodeBase64 = await commonTempData.generateQR(this.data?.qrPayLink);
      
            html += `
            <div style="width: 30%;float: left;" class="m-l-neg-10 m-l-neg-2">
              <img style="width: 100%;" src="${qrCodeBase64}">
            </div>`
          }

          if (obj?.bankAccountNo) {
            html += ` <div style="font-weight:bold;font-size: 14px;width: 100%;" class="f-16">Acc No : ${obj?.bankAccountNo}</div>`
          }
          if (obj?.accountType) {
            html += this.commonBankDetailsFormatForFooter('Acc Type : ' + obj?.accountType)
          }
          if (obj?.ifscCode) {
            html+= `<div style="font-size: 14px;width: 100%;" class="f-16">IFSC : ${obj?.ifscCode}${obj?.bankName?', '+obj?.bankName:''}</div>`
          }
          if (obj?.upi) {
            html += this.commonBankDetailsFormatForFooter(obj?.upi)
          }
          else if (!obj?.upi && obj?.bankAccountNo && obj?.ifscCode) {
            html += this.commonBankDetailsFormatForFooter(obj?.bankAccountNo + '@' + obj?.ifscCode + '.ifsc.npci');
          } 
            
        }
        //E: Naming this div as div1
        html +=`</div>`
        //Naming this div as div2, close it after applying conditions
        html += `<div class="b-w-l"
        style="display: flow-root;max-width: 50%;width: 50%;min-width: 50%;align-items: flex-start;flex-wrap: wrap;border-left: 1px solid #4f4f4f;">`


        let additionalAmount = this.data?.additionalAmount || 0;
        if(additionalAmount){
          html +=this.commonAmountCalculationFormatForFooter('Labour/Delivery Charges', additionalAmount);
        }

        if(this.data.flatDiscount){
            html +=this.commonAmountCalculationFormatForFooter('Invoice Discount', `(${commonTempData.unitAdjuster(this.data?.flatDiscount)})`);
        }

        html +=`<div style="display:flex;width:100%;">
        <div
        style="padding:0 10px;display: flow-root;font-size: 16px;font-weight: bold;color: #000;width: 50%;float: left;"
           class="f-16 padding-0010 f-b">
            Total Amount
        </div>
        <div
        style="padding:0 10px;display: flow-root;font-size: 16px;font-weight: bold;color: #000;width: 50%;float: left;text-align: right;"
        class="f-16 padding-0010 f-b">
            ₹${commonTempData.unitAdjuster(this.data?.totalAmount || 0)}
        </div></div>`

        let receivedOrPaid = this.data?.isPurchase? 'Paid Amount': 'Received Amount';
        if(receivedOrPaidAmt){
          html +=this.commonAmountCalculationFormatForFooter(receivedOrPaid, commonTempData.unitAdjuster(receivedOrPaidAmt||0));
        }
        let balanceAmt = ((this.data?.totalAmount||0) - receivedOrPaidAmt);
        if(balanceAmt>0){
          html +=this.commonAmountCalculationFormatForFooter('Balance', commonTempData.unitAdjuster(balanceAmt));
        }
        // if(this.data?.partyInfo.credit){
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
        <div style="display: flex;width: 100%;background: #ffffff;flex-direction: row;align-items: stretch;">`

        //Naming this div as div1, close it after applying conditions
        html += `
        <div style="display: flex;width: 50%;float: left;margin-bottom: 5px;" class="m-5">
        `
        // div1 closed
        html +=`</div>`;
        //Naming this div as div3
        html += ` <div class="bdbtm" style="display: flex;border-left: 1px solid #4f4f4f;width: 50%;" class="b-w-l">`
        html += this.commonSignatureFormatForFooter(commonTempData.whiteLogo,'Customer Signature');
        html += this.commonSignatureFormatForFooter(commonTempData.whiteLogo,'Authorized Signatory');

        // div3 closed
         html += `</div>`
      // Main div closed
        html +=`</div>`;

        return html;

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
            if(!el.spIncTax){
              //Exclusive
              this.totalSaving += (((el?.mrp ||el?.item?.mrp) - el?.sellPrice + (el.discountFlat||0))*el.quantity)-((el.totalCess||0) + (el.totalTax||0));
            } else {
              //Inclusive
              this.totalSaving += ((el?.mrp ||el?.item?.mrp) - el?.sellPrice + (el.discountFlat||0))*el.quantity;
            }
          }

          if(el.hsn && !isHsn){
              isHsn = true;
              dynamicColumnCount++;
          }

          if((el.totalTax || el?.cess) && !isTax){
              isTax = true;
              dynamicColumnCount++;
          }
          if((el.mrp || el?.item?.mrp) && !isMrp){
            isMrp=true;
            dynamicColumnCount++;
          }
          if(el.totalDiscount && !isDiscount){
            isDiscount = true;
            dynamicColumnCount++;
          }

          if(el.additionalDateFieldTitle && el?.additionalDateFieldValue && !isAdditionlDateField){
            isAdditionlDateField = true;
            additionlDateFieldTitle = el?.additionalDateFieldTitle
            dynamicColumnCount++;
          }
  
          if(el.additionalInputFieldTitle && el?.additionalInputFieldValue && !isAdditionlInputField){
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
        html += `<div style="width: 100%" >`;

        // Table close it before main div closing
        html += `<table style="width: 100%; text-align: center;table-layout: fixed; border-collapse: collapse !important;" ${dynamicColumnCount? `class='${dynamicColWidthCss}'`:''}>`;

        html+=`
        <thead style="border-bottom: 1px solid #4f4f4f !important;background-color: ${this.data?.color} !important;-webkit-print-color-adjust: exact !important; -webkit-princolor-adjust: exact !important;">
          <th style="text-align: center;padding:5px;font-size:13px;color: #ffffff !important;">#</th>
          <th style="text-align: center;width: 50%;padding:5px;font-size:13px;color: #ffffff !important;">Item Names</th>
          <th style="text-align: center;padding:5px;font-size:13px;color: #ffffff !important;${!isHsn?'display: none':''}">HSN Code</th>
          <th style="text-align: center;padding:5px;font-size:13px;color: #ffffff !important;">Qty</th>
          <th style="text-align: center;padding:5px;font-size:13px;color: #ffffff !important;${!isAdditionlInputField?'display: none':''}">${additionlInputFieldTitle}</th>
          <th style="text-align: center;padding:5px;font-size:13px;color: #ffffff !important;${!isAdditionlDateField?'display: none':''}">${additionlDateFieldTitle}</th>
          <th style="text-align: center;padding:5px;font-size:13px;color: #ffffff !important;${!isMrp?'display: none':''}">MRP</th>
          <th style="text-align: center;padding:5px;font-size:13px;color: #ffffff !important;">₹/Unit</th>
          <th style="text-align: center;padding:5px;font-size:13px;color: #ffffff !important;${!isDiscount?'display: none':''}">Discount</th>
          <th style="text-align: center;padding:5px;font-size:13px;color: #ffffff !important;${!isTax?'display: none':''}">Tax Amt</th>
          <th style="text-align: right;padding:5px;font-size:13px;color: #ffffff !important;">Total</th>
        </thead>
        `
        // close it after applying conditions
        html += `<tbody>`

        for (let i = 0; i < this.data?.invoiceItems?.length; i++) {

          let el = this.data?.invoiceItems[i] ;
          totalQty= totalQty + (+el?.quantity);
          totalCess = totalCess + el?.totalCess;
          sellOrPurchasePrice = this.data.isPurchase? el?.purchasePrice: el?.sellPrice ;

          html += `
          <tr>
            <td style="text-align: center;padding:5px;font-size:13px;">${i+1}</td>
            <td class="padding-0515"
              style="font-size:13px;text-align: center;width: 50%;overflow: hidden;text-overflow: ellipsis;padding: 5px;white-space: nowrap;">
              ${(el?.item?.itemName||'') + (el?.itemDes?'<br>('+el?.itemDes+')':'')}
            </td>
            <td style="text-align: center;padding:5px;font-size:13px;${!isHsn?'display: none':''};-webkit-print-color-adjust: exact !important; -webkit-princolor-adjust: exact !important;">${el?.hsn|| ''}</td>
            <td style="text-align: center;padding:5px;font-size:13px;-webkit-print-color-adjust: exact !important; -webkit-princolor-adjust: exact !important;">${(el?.quantity||0)+" "+(el?.unit||'')}</td>
            <td style="text-align: center;padding:5px;font-size:13px;-webkit-print-color-adjust: exact !important; -webkit-princolor-adjust: exact !important;${!isAdditionlInputField?'display: none':''}">${el?.additionalInputFieldValue||''}</td>
            <td style="text-align: center;padding:5px;font-size:13px;-webkit-print-color-adjust: exact !important; -webkit-princolor-adjust: exact !important;${!isAdditionlDateField?'display: none':''}">${el?.additionalDateFieldValue?commonTempData.dateToDDMMYYY(el?.additionalDateFieldValue):''}</td>
            <td style="text-align: center;padding:5px;font-size:13px;-webkit-print-color-adjust: exact !important; -webkit-princolor-adjust: exact !important;${!isMrp?'display: none':''}">${(el?.mrp ||el?.item?.mrp)||''}</td>
            <td style="text-align: center;padding:5px;font-size:13px;-webkit-print-color-adjust: exact !important; -webkit-princolor-adjust: exact !important;">${sellOrPurchasePrice}</td>
            <td style="text-align: center;padding:5px;font-size:13px;${!isDiscount?'display: none':''};-webkit-print-color-adjust: exact !important; -webkit-princolor-adjust: exact !important;">${(el?.totalDiscount?(el?.totalDiscount) +'<br>'+'('+el?.discountPercent+'%'+')':'')}</td>
            <td style="text-align: center;padding:5px;font-size:13px;${!isTax?'display: none':''};-webkit-print-color-adjust: exact !important; -webkit-princolor-adjust: exact !important;">
            ${(((el?.totalTax ||0)+(el?.totalCess||0))>0?commonTempData.unitAdjuster((el?.totalTax|| 0)+(el?.totalCess|| 0))+'<br>'+'('+(el?.taxPercentage||0)+(el?.cess?(el?.taxPercentage?'+':'')+el?.cess:'')+')%':'')}
            </td>
            <td style="text-align: right;padding:5px;font-size:13px;-webkit-print-color-adjust: exact !important; -webkit-princolor-adjust: exact !important;">${el?.totalAmount}</td>
          </tr>
          `
        }
        // tbody tag closed
        html += `</tbody>`

        html +=`
        <thead class="border" style="border-top: 1px solid #4f4f4f;border-bottom: 0 !important;">
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


    partyDetails(){
        let html ='';

        //Close this main div at last
        html  += `<div class="flex b-w-b" style="display: flex;border-bottom: 1px solid #4f4f4f;align-items: stretch;">`;
        //S:Naming this div as div1
        html += `<div class="h50 b-w-r" style="width: 50%;border-right: 1px solid #4f4f4f;">`;

        let billTitle = this.data?.isPurchase? 'Bill From': 'Bill To';
        html += `
        <div class="f-14 f-b padding-10 b-w-b"
        style="padding: 2px 10px;font-size: 14px;font-weight:bold;color: #ffffff !important;background-color: ${this.data?.color} !important;border-bottom: 1px solid #4f4f4f;-webkit-print-color-adjust: exact !important;color-adjust: exact !important;">
            ${billTitle}:
        </div>
        `
        let el = this.data?.partyInfo?.profileData;
        if(el?.legalName){
          html+= ` <div class="f-14 padding-0010" style="font-weight:bold;padding:0px 10px;font-size: 14px;color: #000;">M/s. ${el?.legalName}</div>`
        }

        if(el?.contactPersonName == el?.contactPersonPhone){
          html +=this.commonLeftSideFormatforPartyDetails('Phone',el?.contactPersonPhone)
        } else {
            if(el?.contactPersonName){
              if(el?.contactPersonName == "Party Not Available"){
                html+= ` <div class="f-14 padding-0010" style="font-weight:bold;padding:0px 10px;font-size: 14px;color: red;">Party Has Been Deleted</div>`
              }else{
                html+= ` <div class="f-14 padding-0010" style="font-weight:bold;padding:0px 10px;font-size: 14px;color: #000;">${el?.contactPersonName}</div>`
              }
            }

           if(el?.contactPersonPhone){
               html +=this.commonLeftSideFormatforPartyDetails('Phone',el?.contactPersonPhone)
           }

         }

        if(el?.contactPersonEmail){
            html +=this.commonLeftSideFormatforPartyDetails('Email',el?.contactPersonEmail)

        }

        if(el?.addressLine1 || el?.addressState){
            html +=this.commonLeftSideFormatforPartyDetails('Address',`${el?.addressLine1?el?.addressLine1: ''}${el?.addressState? ', '+el?.addressState:''}${el?.addressPincode? ', '+el?.addressPincode:''}`)
        }

        if(el?.gstNumber){
            html +=this.commonLeftSideFormatforPartyDetails('GST',el?.gstNumber)
        }
        if(el?.udf1T && el?.udf1V){
            html +=this.commonLeftSideFormatforPartyDetails(el?.udf1T,el?.udf1V)
        }
        if(el?.udf2T && el?.udf2V){
            html +=this.commonLeftSideFormatforPartyDetails(el?.udf2T,el?.udf2V)
        }
        if(el?.udf3T && el?.udf3V){
            html +=this.commonLeftSideFormatforPartyDetails(el?.udf3T,el?.udf3V)
        }

        //E:Naming this div as div1

        html +=`</div>`

        //S:CLose these two divs at last
        html +=`<div class="h50" style="width: 50%;">
            <div style="display: flow-root;width: 100%;align-items: flex-start;flex-wrap: wrap;">
        `;
        html += `
        <div class="f-14 f-b padding-10 b-w-b"
        style="padding: 2px 10px;font-size: 14px;font-weight:bold;color: #ffffff !important;background-color: ${this.data?.color} !important;border-bottom: 1px solid #4f4f4f;-webkit-print-color-adjust: exact !important;color-adjust: exact !important;">
            Ship To:
        </div>
        `
        if(el?.legalName){
          html+= ` <div class="f-14 padding-0010" style="font-weight:bold;padding:0px 10px;font-size: 14px;color: #000;">M/s. ${el?.legalName}</div>`
        }

        if(el?.contactPersonName == el?.contactPersonPhone){
          html +=this.commonLeftSideFormatforPartyDetails('Phone',el?.contactPersonPhone)
        } else {

            if(el?.contactPersonName){
              html+= ` <div class="f-14 padding-0010" style="font-weight:bold;padding:0px 10px;font-size: 14px;color: #000;">${el?.contactPersonName}</div>`
            }

           if(el?.contactPersonPhone){
               html +=this.commonLeftSideFormatforPartyDetails('Phone',el?.contactPersonPhone)
           }

         }

        if(el?.contactPersonEmail){
            html +=this.commonLeftSideFormatforPartyDetails('Email',el?.contactPersonEmail)

        }


        if(el?.gstNumber){
            html +=this.commonLeftSideFormatforPartyDetails('GST',el?.gstNumber)
        }
        if(el?.udf1T && el?.udf1V){
            html +=this.commonLeftSideFormatforPartyDetails(el?.udf1T,el?.udf1V)
        }
        if(el?.udf2T && el?.udf2V){
            html +=this.commonLeftSideFormatforPartyDetails(el?.udf2T,el?.udf2V)
        }
        if(el?.udf3T && el?.udf3V){
            html +=this.commonLeftSideFormatforPartyDetails(el?.udf3T,el?.udf3V)
        }

        if(this.data.deliveryState || el?.addressOneLine1 || el?.addressOneState) {
          let deliveryState = this.data.deliveryState || el?.addressOneState;
            html +=this.commonLeftSideFormatforPartyDetails(' Delivery Address', `${el?.addressOneLine1? el?.addressOneLine1: ''}${deliveryState? ', '+deliveryState:''}${el?.addressOnePincode? ', '+el?.addressOnePincode:''}`);
        }


        //E:CLose these two divs at last
        html += `</div></div>`
        //Closing main div at last
        html += `</div>`

        return html;
    }

    commonSignatureFormatForFooter(imgBase64, title){
        return`
        <div style="display: flow-root;width: 50%;float: left;" class="padding-1301">
        <img style="width: 100%;height: 25px;object-fit: contain;object-position: bottom;margin-bottom: 5px;" src="${imgBase64}">
        <div style="width: 100%;text-align: center;font-size: 16px;color: #000;" class="f-16">${title}
        </div>
        </div>
        `
      }

    commonBankDetailsFormatForFooter(text){
    return ` <div style="font-size: 14px;width: 100%;color: #000;" class="f-16">${text}</div>`
    }
    commonAmountCalculationFormatForFooter(title, value){
        return `<div style="display:flex;width: 100%;">
        <div style="display: flow-root;font-size: 14px;color: #000;width: 50%;float: left;padding:0 10px;"
        class="f-14 padding-0010">
        ${title}
        </div>
        <div
        style="padding:0 10px;display: flow-root;font-size: 14px;color: #000;width: 50%;float: left;text-align: right;"
        class="f-14 padding-0010">
        ₹${value}
        </div></div>
        `
      }

    commonRightSideFormatForPartyDetails(title,value){

        return `<div style="display:flex;width:100%;">
        <div
        style="padding:0px 10px;font-weight:bold;display: flow-root;font-size: 14px;color: #000;width: 50%;float: left;"
        class="f-14 f-b padding-0010">
        ${title} : </div>
        <div
        style="padding:0px 10px;display: flow-root;font-size: 14px;color: #000;width: 50%;float: left;text-align: right;"
        class="f-14 padding-0010">
        ${value}</div></div>
        `
    }

    commonForInvoiceTitle(title,value){
      

      return `<div style="display:flex;width:100%;">
      <div
      style="padding:0px 10px;font-weight:bold;display: flow-root;font-size: 16px;color: ${this.data?.color};width: 50%;float: left;"
      class="f-14 f-b padding-0010">
      ${title}  </div>
      <div
      style="padding:0px 10px;display: flow-root;font-size: 14px;color: ${this.data?.color};width: 50%;float: left;text-align: right;"
      class="f-14 padding-0010">
      ${value}</div></div>
      `
  }

    commonDateFormat(dateName, timeStamp){

        return `<div style="display:flex;width:100%;">
        <div
        style="padding:0px 10px;font-weight:bold;display: flow-root;font-size: 14px;color: #000;width: 50%;float: left;"
        class="f-14 f-b padding-0010">
        ${dateName} : </div>
        <div
        style="padding:0px 10px;display: flow-root;font-size: 14px;color: #000;width: 50%;float: left;text-align: right;"
        class="f-14 padding-0010">
        ${commonTempData.dateToDDMMYYY(timeStamp)} </div></div>
        `
    }

    commonLeftSideFormatforPartyDetails(title,value){
        // return`
        // <div class="f-16 padding-0010" style="padding:0px 10px;font-size: 16px;color: #000;">${title}: ${value}</div>
        // `

        return `
        <div class="f-14 padding-0010" style="padding:0px 10px;font-size: 14px;color: #000;">${value}</div>
        `
    }



    invoiceTitle(){
        let html = '';
        let invoiceTitle = commonTempData.getInvoiceTitle(this.data);

        if(invoiceTitle){
            html += `
            <div class="f-b f-20 padding-15"
            style="width: 100%;padding: 15px;text-align: center;font-size: 16px;font-weight: bold;color: ${this.data?.color};">
                ${invoiceTitle}
            </div>
            `
        }
        else {
            html += `
            <div class="f-20 f-b padding-1000" style="width: 100%;padding:10px 0;text-align: center;font-size: 16px;color: ${this.data?.color};font-weight: bold;">
                Tax Invoice
            </div>
            `
        }
        return html;
    }

    sellerDetails(){
        let html = '';

        //close this main div at last
        html +=` <div class="flex b-w-b" style="display: flex;flex-wrap:wrap;border-bottom: 1px solid #4f4f4f;align-items: stretch;">
        <span class="f-16 padding-0010" style="padding-right:10px;float:right;width:100%;text-align:right;font-size: 12px;color: #d3d3d3;">${this.data.addressTo}</span>`;

        //S:Naming this div as div1
        html +=`<div class="h50 padding-000010" style="width: 50%;padding-bottom:10px;">`;
      
        if(this.data?.user?.profileData?.legalName){
            html += `
            <div class="f-24 f-b padding-10" style="padding: 0 10px;font-size: 16px;font-weight: bold;color: ${this.data?.color};">
             <img src="${this.data.logo ||''}"  width="70" height="70">
              <p style="width:25%;padding-left: 10px;display: inline;margin-top: -6px;position: absolute;">
                ${this.data?.user?.profileData?.legalName}
              </p>

            </div>
            `
        }

      if(this.data?.user?.profileData?.contactPersonPhone && this.data?.user?.profileData?.contactPersonPhone!='0'){
          html += this.commonLeftSideFormatforSellerDetails('Phone', this.data?.user?.profileData?.contactPersonPhone);
      }

      if(this.data?.user?.profileData?.contactPersonEmail){
          html += this.commonLeftSideFormatforSellerDetails('Email', this.data?.user?.profileData?.contactPersonEmail);
      }

      if(this.data?.user?.profileData?.gstNumber){
          html += this.commonLeftSideFormatforSellerDetails('GST', this.data?.user?.profileData?.gstNumber);
      }
      if(this.data?.user?.profileData?.addressLine1){
          html += this.commonLeftSideFormatforSellerDetails('Address', this.data?.user?.profileData?.addressLine1);
      }

      if(this.data?.user?.profileData?.addressState){
        html += this.commonLeftSideFormatforSellerDetails('State',this.data?.user?.profileData?.addressState);
      }


      //E:Naming this div as div1
      html+=`</div>`;

      html +=`<div class="h50" style="width: 50%;padding-top:25px;">
      <div style="display: flow-root;width: 100%;align-items: flex-start;flex-wrap: wrap;">
     `
     let invoiceTitle = commonTempData.getInvoiceTitle(this.data)
     if(invoiceTitle){
      html += this.commonForInvoiceTitle(invoiceTitle, '');
     }else{
      html += this.commonForInvoiceTitle('Tax Invoice', '');
     }
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

     //E:CLose these two divs at last
     html += `</div></div>`
     //Closing main div at last
     html += `</div>`

        return html

    }

    commonLeftSideFormatforSellerDetails(title,value){
        return`
        <div class="f-16 padding-0005" style="padding:0 10px;font-size:14px;color:black;">${value}</div>
        `
    }

}
