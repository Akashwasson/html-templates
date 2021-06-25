import { InvoicePrint } from "../models/print.model";
import { commonTempData } from "./commonTempData";

export class LetterHead{

    constructor(
      private data: InvoicePrint,
      ){
      }

    totalSaving = 0;
    finalHsnTableObj={};
    isTax=false;
    sameState = false;

    async main(){
      return `
      <style>
      ${commonTempData.tallyTemplateCss()}
      </style>
      <span class="st-inv-mobi-screen">
        <style>${commonTempData.mobileCss()}</style>
      </span>
      <div class="container-new arial"
      style="width:210mm;background: white;padding: 0;padding-bottom: 70px;visibility: visible;-webkit-print-color-adjust: exact !important;color-adjust: exact !important;">
        ${this.header()}
        ${this.templateBody()}
        ${await this.footer()}
      </div>
      `
    }

    header(){
      return `
        ${this.headerEmptySpace()}
        ${this.invoiceTitle()}
        ${this.partyDetails()}`

    }

    async footer(){
      return `
        ${this.data?.isMoneyIn?this.footerCalculationForMoneyIn():this.footerAmountCalculation()}
        ${this.hsnSacTable()}
        ${await this.footerBankDetails()}
        ${this.footerTNCAndNotes()}
        `
    }


    // S:  HSN Table Code
    addSameTaxPercentageObjs(mainObj){
      let sanitizedObj = {};
      for (const key in mainObj) {
        let holder = {};
        mainObj[key].forEach(function(d) {
          if(d?.taxPercentage != 0){
            if (holder.hasOwnProperty(d?.taxPercentage)) {
              holder[d?.taxPercentage] = {
                "taxAmount":(holder[d?.taxPercentage].taxAmount + d?.taxAmount),
                "itemPrice":(holder[d?.taxPercentage].itemPrice+(d?.itemPrice * d?.quantity)-(d?.isIncTax?d?.taxAmount:0)-(d.discount || 0))
              };
            } else {
              holder[d?.taxPercentage] = {
                "taxAmount":d?.taxAmount,
                "itemPrice":(d?.itemPrice * d?.quantity) - (d?.isIncTax?d?.taxAmount:0)-(d.discount || 0)
              };
            }
          }
        }
        );
        let array = [];
        
        for (let prop in holder) {
          array.push({ taxPercentage: prop, taxAmount: holder[prop]?.taxAmount, taxableValue: holder[prop]?.itemPrice});
        }
        if(array.length){
          sanitizedObj[key] = array;
        }
      }
      
      return sanitizedObj;
    }

    commonHsnTableCode(el){
      let isIncTax = false;

      if(this.data?.isPurchase){
        if(el?.ppIncTax){
          isIncTax = true;
        }
      }else{
        if(el?.spIncTax){
          isIncTax = true;
        }
      }

      return {
        'taxAmount': el?.totalTax ||0,
        'itemPrice': this.data?.isPurchase? el?.purchasePrice: el?.sellPrice,
        'taxPercentage': el?.taxPercentage||0,
        'quantity': el?.quantity ||1,
        'isIncTax':isIncTax,
        'discount': el?.totalDiscount || 0
      }

    }
    calculationForHsnTable(el,hsnTableObj){

      if(el?.hsn ||el?.taxPercentage){ 
        if(el?.hsn){
          if(hsnTableObj[el?.hsn]){
            hsnTableObj[el?.hsn].push({
              ...this.commonHsnTableCode(el)
            })
          } else{
            hsnTableObj[el?.hsn] = [{
              ...this.commonHsnTableCode(el)
            }]
          }
        } else{
          if(el?.taxPercentage || el?.totalAmount){
            if(hsnTableObj['noHsn']){
              hsnTableObj['noHsn'].push({
                ...this.commonHsnTableCode(el)

              })
            }else{
              hsnTableObj['noHsn'] = [{
                ...this.commonHsnTableCode(el)
              }]
            }
          }
        }
      }

      return hsnTableObj;

    }

    hsnSacTable(){

      if(!Object.keys(this.finalHsnTableObj)?.length){
        return '';
      }

      let partyEl = this.data?.partyInfo?.profileData || null;

      if(partyEl &&(partyEl.addressState == (this.data?.user?.profileData?.addressState))){
        this.sameState = true;
       }
       else if(!partyEl.addressState || !(this.data?.user?.profileData?.addressState)){
        this.sameState = true;
      }

      let html ='';

      //S: Main div
      html +=`<div class="margin-10" style="margin:0 23px;border: 1px solid #4f4f4f;border-left: 0;">`

      html +=`<table style="width: 100%; text-align: center;table-layout: fixed;">`

      html +=`<thead class="no-b-btm" style="border-bottom: 1px solid #4f4f4f;-webkit-print-color-adjust: exact !important;color-adjust: exact !important;">`

      html +=`
        <tr>
        <td class="font-12 padding-5555" rowspan="2"
          style="text-transform:uppercase;color:#000;text-align: center !important;padding: 2px;border-right:0;border-top:0;">
          HSN/SAC</td>
        <td class="font-12 padding-5555" rowspan="2"
          style="text-transform:uppercase;color:#000;text-align: center !important;padding: 2px;border-right:0;border-top:0;">
          Taxable value</td>
        <td class="font-10 padding-5555" colspan="2"
          style="text-transform:uppercase;color:#000;text-align: center;font-weight: normal;padding: 2px;border-right:0;border-bottom:0;border-top:0;">
          ${(!this.sameState&&this.isTax)?'IGST':'SGST'} 
        </td>`
        if(this.sameState&&this.isTax){
          html +=`<td class="font-10 padding-5555" colspan="2"
          style="text-transform:uppercase;color:#000;text-align: center;font-weight: normal;padding: 2px;border-right:0;border-bottom:0;border-top:0;">
          CGST</td>`
        }

        html +=`<td class="font-12 padding-5555" rowspan="2"
          style="text-transform:uppercase;color:#000;text-align: center;padding: 2px;border-right:0;border-top:0;border-right: 0;">
          Total Tax</td>
        </tr>
        <tr>
          <td class="font-10 padding-5555"
            style="font-weight: normal;text-transform:uppercase;color:#000;text-align: left;padding: 2px;border-right:0;">
            Rate</td>
          <td class="font-10 padding-5555"
            style="font-weight: normal;text-transform:uppercase;color:#000;text-align: right !important;padding: 2px;border-right:0;">
            Amt</td>`

            if(this.sameState && this.isTax){
              html+=`<td class="font-10 padding-5555"
                style="font-weight: normal;text-transform:uppercase;color:#000;text-align: left;padding: 2px;border-right:0;">
                Rate</td>
              <td class="font-10 padding-5555"
                style="font-weight: normal;text-transform:uppercase;color:#000;text-align: right;padding: 2px;border-right:0;">
                Amt</td>`
            }

        html+=`</tr>`
          
      html +=`</thead>`

      html +=`<tbody>`

      html+=this.makeHsnSacRows()

      html +=`</tbody>`

      html +=`</table>`

      //E: Main div
      html +=`</div>`

      return html;
    }

    makeHsnSacRows(){
      let html ='';
      for (const key in this.finalHsnTableObj) {
        if(this.finalHsnTableObj[key]){
          html +=this.hsnSacRow(key,this.finalHsnTableObj[key]);
        }
      }

      return html;
    }

    hsnSacRow(hsnCode,hsnData){
      let html ='';
      for (let i = 0; i < hsnData.length; i++) {
        const element = hsnData[i];
        html +=`
          <tr>
          <td class="padding-5555 font-12" style="color:#000;border-bottom: 0;border-top: 0;padding: 2px;border-right:0;text-align: center;">
            ${(hsnCode !='noHsn')?hsnCode:''}</td>
          <td class="padding-5555 font-12"
            style="color:#000;border-bottom: 0;border-top: 0;padding: 2px;border-right:0;text-align: center !important;">
            ${commonTempData.unitAdjuster(element?.taxableValue || 0)}</td>
          <td class="padding-5555 font-12" style="color:#000;border-bottom: 0;border-top: 0;padding: 2px;border-right:0;text-align: left;">
          ${(!this.sameState&&this.isTax)?(+element?.taxPercentage)?.toFixed(2):(+element?.taxPercentage/2)?.toFixed(2)}%
          </td>
          <td class="padding-5555 font-12" style="color:#000;border-bottom: 0;border-top: 0;padding: 2px;border-right:0;text-align: right;">
          ${(!this.sameState&&this.isTax)?(element?.taxAmount)?.toFixed(2):(element?.taxAmount/2)?.toFixed(2)}</td>
          `
          if(this.sameState&&this.isTax){
            html+=`<td class="padding-5555 font-12" style="color:#000;border-bottom: 0;border-top: 0;padding: 2px;border-right:0;text-align: left;">
            ${(+element?.taxPercentage/2)?.toFixed(2)}%
            </td>
            <td class="padding-5555 font-12" style="color:#000;border-bottom: 0;border-top: 0;padding: 2px;border-right:0;text-align: right;">
            ${(element?.taxAmount/2)?.toFixed(2)}</td>
            `
          }
          html+=`<td class="padding-5555 font-12"
            style="color:#000;border-bottom: 0;border-top: 0;padding: 2px;border-right:0;text-align: right;border-right: 0;">
            ${(element?.taxAmount)?.toFixed(2)}</td>
            </tr>
            `       
      }
    
      return html;
    }

    // E:  HSN Table Code

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
      let isAdditionlDateField = false;
      let isAdditionlInputField = false;
      let additionlDateFieldTitle = '';
      let additionlInputFieldTitle = '';
      let isDiscount =false;
      let dynamicColumnCount = 0;
      let dynamicColWidthCss;
      let sellOrPurchasePrice;

      let hsnTableObj={};


      for (let i = 0; i <  this.data?.invoiceItems?.length; i++) {
        let el = this.data?.invoiceItems[i] ;
        hsnTableObj = this.calculationForHsnTable(el,hsnTableObj);


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
        if((el?.mrp || el?.item?.mrp) && !isMrp){
          isMrp=true;
          dynamicColumnCount++;
        }

        if((el?.totalTax || el?.cess) && !isTax){
            isTax = true;
            this.isTax = true;
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

      this.finalHsnTableObj = this.addSameTaxPercentageObjs(hsnTableObj);

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
        <th style="text-align: center;color: #ffffff !important;padding:5px;border-right:0;">#</th>
        <th style="text-align: center;color: #ffffff !important;width: 50%;padding:5px;border-right:0;">Item Names</th>
        <th style="text-align: center;color: #ffffff !important;padding:5px;border-right:0;${!isHsn?'display: none':''}">HSN Code</th>
        <th style="text-align: center;color: #ffffff !important;padding:5px;border-right:0;">Qty</th>
        <th style="text-align: center;color: #ffffff !important;padding:5px;border-right:0;${!isAdditionlInputField?'display: none':''}">${additionlInputFieldTitle}</th>
        <th style="text-align: center;color: #ffffff !important;padding:5px;border-right:0;${!isAdditionlDateField?'display: none':''}">${additionlDateFieldTitle}</th>
        <th style="text-align: center;color: #ffffff !important;padding:5px;border-right:0;${!isMrp?'display: none':''}">MRP</th>
        <th style="text-align: center;color: #ffffff !important;padding:5px;border-right:0;">₹/Unit</th>
        <th style="text-align: center;color: #ffffff !important;padding:5px;border-right:0;${!isDiscount?'display: none':''}">Discount</th>
        <th style="text-align: center;color: #ffffff !important;padding:5px;border-right:0;${!isTax?'display: none':''}">Tax Amt</th>
        <th style="text-align: right;color: #ffffff !important;padding:5px;">Total</th>
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
          <td style="text-align: center;border-bottom:0;border-top: 0;padding:5px;border-right:0;-webkit-print-color-adjust: exact !important;color-adjust: exact !important">${i+1}</td>
          <td class="padding-0515"
            style="text-align: center;border-bottom:0;border-right:0;border-top: 0;width: 50%;overflow: hidden;text-overflow: ellipsis;padding: 5px;white-space: nowrap;-webkit-print-color-adjust: exact !important;color-adjust: exact !important">
            ${(el?.item?.itemName||'') + (el?.itemDes?'<br>('+el?.itemDes+')':'')}
          </td>
          <td style="-webkit-print-color-adjust: exact !important;color-adjust: exact !important;text-align: center;border-bottom:0;border-top: 0;padding:5px;border-right:0;${!isHsn?'display: none':''}">${el?.hsn|| ''}</td>
          <td style="-webkit-print-color-adjust: exact !important;color-adjust: exact !important;text-align: center;border-bottom:0;border-top: 0;padding:5px;border-right:0;">${(el?.quantity||0)+" "+(el?.unit||'')}</td>
          <td style="-webkit-print-color-adjust: exact !important;color-adjust: exact !important;text-align: center;border-bottom:0;border-top: 0;padding:5px;border-right:0;${!isAdditionlInputField?'display: none':''}">${el?.additionalInputFieldValue||''}</td>
          <td style="-webkit-print-color-adjust: exact !important;color-adjust: exact !important;text-align: center;border-bottom:0;border-top: 0;padding:5px;border-right:0;${!isAdditionlDateField?'display: none':''}">${el?.additionalDateFieldValue?commonTempData.dateToDDMMYYY(el?.additionalDateFieldValue):''}</td>
          <td style="-webkit-print-color-adjust: exact !important;color-adjust: exact !important;text-align: center;border-bottom:0;border-top: 0;padding:5px;border-right:0;${!isMrp?'display: none':''}">${(el?.mrp ||el?.item?.mrp)||''}</td>
          <td style="-webkit-print-color-adjust: exact !important;color-adjust: exact !important;text-align: center;border-bottom:0;border-top: 0;padding:5px;border-right:0;">${sellOrPurchasePrice}</td>
          <td style="-webkit-print-color-adjust: exact !important;color-adjust: exact !important;text-align: center;border-bottom:0;border-top: 0;padding:5px;border-right:0;${!isDiscount?'display: none':''}">${(el?.totalDiscount?(el?.totalDiscount) +'<br>'+'('+el?.discountPercent+'%'+')':'')}</td>
          <td style="-webkit-print-color-adjust: exact !important;color-adjust: exact !important;text-align: center;border-bottom:0;border-top: 0;padding:5px;border-right:0;${!isTax?'display: none':''}">
          ${(((el?.totalTax ||0)+(el?.totalCess||0))>0?commonTempData.unitAdjuster((el?.totalTax|| 0)+(el?.totalCess|| 0))+'<br>'+'('+(el?.taxPercentage||0)+(el?.cess?(el?.taxPercentage?'+':'')+el?.cess:'')+')%':'')}
          </td>
          <td style="-webkit-print-color-adjust: exact !important;color-adjust: exact !important;text-align: right;padding:5px;border-bottom:0;border-top: 0;">${el?.totalAmount}</td>
        </tr>
        `
      }
      // tbody tag closed
      html += `</tbody>`

      html +=`
      <thead class="border" style="border-top: 1px solid #4f4f4f;border-bottom: 1px solid #4f4f4f;border-color:${this.data?.color} !important;-webkit-print-color-adjust: exact !important;color-adjust: exact !important;">
         <th style="text-align: center;padding:5px;border-right:0;"></th>
         <th style="text-align: center;width: 50%;padding:5px;border-right:0;">Total</th>
         <th style="text-align: center;padding:5px;border-right:0;${!isHsn?'display: none':''}"></th>
         <th style="text-align: center;padding:5px;border-right:0;">${totalQty}</th>
         <th style="text-align: center;padding:5px;border-right:0;${!isAdditionlInputField?'display: none':''}"></th>
         <th style="text-align: center;padding:5px;border-right:0;${!isAdditionlDateField?'display: none':''}"></th>
         <th style="text-align: center;padding:5px;border-right:0;${!isMrp?'display: none':''}"></th>
         <th style="text-align: center;padding:5px;border-right:0;"></th>
         <th style="text-align: center;padding:5px;border-right:0;${!isDiscount?'display: none':''}">
         ${(this.data?.discountAmount?'₹'+this.data?.discountAmount:'')}
         </th>
         <th style="text-align: center;padding:5px;border-right:0;${!isTax?'display: none':''}">
         ${((this.data?.gstAmount||0)+(totalCess))>0?'₹'+commonTempData.unitAdjuster((this.data?.gstAmount||0)+(totalCess)):''}
         </th>
         <th style="text-align: right;padding:5px;">
         ₹${commonTempData.unitAdjuster((this.data?.totalAmount||0) - (this.data?.additionalAmount||0) + (this.data?.flatDiscount||0))}
         </th>
       </thead>
      `
      html += `</table>`
      html += `</div>`
      return html;
    }

    headerEmptySpace(){
      let html="";

      html +=`
      <div style="height:150px;">
      </div>    
      `
      return html
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
      let el = this.data?.partyInfo?.profileData ||null;
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
      if(this.data?.isMoneyIn){
        billTitle = 'Received From :';
      }

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
            html+= `
            <div style="display: flow-root;font-size: 14px;color: red;font-weight:bold" class="f-14 m-5">
                Party Has Been Deleted
            </div>`
          }else{
            html+= `
            <div style="display: flow-root;font-size: 14px;color: #000;font-weight:bold" class="f-14 m-5">
            ${el?.contactPersonName}
            </div>`
          }
        }

        if(el?.contactPersonPhone){
          html +=this.commonLeftSideFormatForPartyDetails(el?.contactPersonPhone)
        }
      }


      if(el?.contactPersonEmail){
        html +=`
        <div style="display: flow-root;font-size: 14px;color: #000;margin-bottom: 5px;" class="f-14 m-5">
          ${el?.contactPersonEmail}
        </div>`
      }

      if(el?.addressLine1 || el?.addressState){
        html +=`
        <div style="display: flow-root;font-weight: bold;font-size: 14px;color: #000;" class="f-14 f-b">
         Billing Address
      </div>
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
        let deliveryState = this.data?.deliveryState || el?.addressOneState;
        html +=`
        <div style="display: flow-root;font-weight: bold;font-size: 14px;color: #000;margin-top: 5px;" class="f-14 f-b">
           Delivery Address
        </div>
        <div style="display: flow-root;font-size: 14px;color: #000;" class="f-14 m-5">
           ${el?.addressOneLine1? el?.addressOneLine1: ''}${deliveryState? ', '+deliveryState:''}${el?.addressOnePincode?', '+el?.addressOnePincode:''}
        </div>`
      }

      // div1 closed
      html +=`</div>`

    // This is Right side of party Details
    //Naming this div as div2, close it after applying conditions
      html +=`<div style="display: flow-root;width: 42%;align-items: flex-start;flex-wrap: wrap;">`

      if(this.data?.isMoneyIn && this.data?.moneyInInfo){
        html += this.commonRightSideFormatForPartyDetails("Receipt No", this.data?.moneyInInfo.receiptNo);
        html += this.commonDateFormat('Date', this.data?.moneyInInfo.dateStamp);

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
      // div2 closed
      html +=`</div>`
      // main div closed
      html +=`</div>`

      return html;

    }

    footerCalculationForMoneyIn(){
      let html = '';
      if(!this.data?.moneyInInfo && !this.data?.moneyInInfo?.amount){
        return '';
      }
      // close this main div in last
      html += `
      <div style="display: flex;width: 100%;align-items: flex-start;background: #ffffff;padding:0 25px 0;"
        class="padding-002500">`;

      //Naming this div as div1, close it after applying conditions
      html += `<div style="display: flow-root;width: 50%;padding: 0 10px 0 0;" class="padding-00100000">`;

      html += `
      <div style="display: flow-root;font-weight: bold;font-size: 14px;color: #000;text-transform: capitalize;"
      class="f-14 f-b">
        Amount in Words
      </div>
      <div style="display: flow-root;font-size: 14px;color: #000;text-transform: capitalize;" class="f-14">
        ${commonTempData.convertToIndianCurrency((this.data?.moneyInInfo?.amount).toString())}
        </div>`

      //closing div1
      html += `</div>`;

       //Naming this div as div2, close it after applying conditions
      html += ` <div style="display: flow-root;width: 50%;align-items: flex-start;flex-wrap: wrap;">`

      
      html +=this.commonAmountCalculationFormatForFooterForMoneyIn('Received:', commonTempData.unitAdjuster(this.data?.moneyInInfo?.amount||0));
      html +=this.commonAmountCalculationFormatForFooterForMoneyIn('Mode:',this.data?.moneyInInfo?.txnMode);
      if(this.data?.moneyInInfo?.txnRef){
        html +=this.commonAmountCalculationFormatForFooterForMoneyIn('Cheque No:',this.data?.moneyInInfo?.txnRef);
      }
      
      html += `</div>`;
      //closing main div
      html += `</div>`;

      return html;
    }

    footerAmountCalculation(){
      if(this.data?.isMoneyIn){
        return '';
      }
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

      //closing div1
      html += `</div>`;

      //Naming this div as div2, close it after applying conditions
      html += ` <div style="display: flow-root;width: 50%;align-items: flex-start;flex-wrap: wrap;">`
      
      let roundOffVal = 0;
      if(this.data?.roundOffValue){
        roundOffVal = this.data?.roundOffValue ;
      }
      let subTotalAmt = commonTempData.unitAdjuster((this.data?.totalAmount||0) - (this.data?.additionalAmount||0) - totalTaxAmt + (this.data?.flatDiscount||0) + roundOffVal)

      html += `
      <div class="flex" style="display:flex;flex-wrap:wrap;justify-content:flex-start;width:100%;">
      <div style="display: flow-root;font-size: 14px;color: #000;width: 50%;float: left;"
      class="f-14 m-5">
        Sub Total
         <span style="font-size: 10px"
         class="f-10 m-5"> without Tax</span>
      </div>
      <div
      style="display: flow-root;font-size: 14px;color: #000;width: 50%;float: left;text-align: right;"
      class="f-14 m-5">
         ₹${subTotalAmt}
      </div>
      </div>
      `

      if(!sameState&&isTax){
        html += this.commonAmountCalculationFormatForFooter('IGST',commonTempData.unitAdjuster(this.data?.gstAmount));
      }
      if(sameState&&isTax){
        html += this.commonAmountCalculationFormatForFooter('SGST',commonTempData.unitAdjuster(this.data?.gstAmount/2));
      }

      if(sameState&&isTax){
        html += this.commonAmountCalculationFormatForFooter('CGST',commonTempData.unitAdjuster(this.data?.gstAmount/2));
      }

      if(this.data?.cessAmount){
        html += this.commonAmountCalculationFormatForFooter('CESS',commonTempData.unitAdjuster(this.data?.cessAmount));
      }

      let additionalAmount = this.data?.additionalAmount?this.data?.additionalAmount:0
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
      if(this.totalSaving >0){
        html +=this.commonAmountCalculationFormatForFooter('Total Saving', commonTempData.unitAdjuster(this.totalSaving));
      }
      // div2 closed
      html +=`</div>`
      // main div closed
      html +=`</div>`

      return html;
    }

    async footerBankDetails(){

      let obj = this.data?.user?.profileData || null;
      let html = '';

      // close this div in last
      html +=`
      <div style="display: flex;width: 100%;align-items: flex-start;background: #ffffff;padding:0 25px 0;"
      class="padding-002500">`

      //Naming this div as div1, close it after applying conditions
      html += `
      <div style="display: flex;width: 46%;float: left;margin-bottom: 5px;" class="m-5">
      `

      if(obj && (obj?.bankName || obj?.bankAccountNo || obj?.accountType || obj?.ifscCode || obj?.upi)&& !this.data?.isMoneyIn){
        if(obj?.upi && this.data?.qrPayLink){
          let qrCodeBase64 = await commonTempData.generateQR(this.data?.qrPayLink);
    
          html += `
          <div style="width: 30%;float: left;" class="m-l-neg-10 m-l-neg-2">
            <img style="width: 100%;" src="${qrCodeBase64}">
          </div>`
        }
      //Naming this div as div2, close it after applying conditions
        html +=`
        <div style="width: 70%;float: left;padding: 0;" class="">
        <div style="font-weight: bold;font-size: 14px;width: 100%;" class="f-16 f-b">Bank Details</div>
        `
        if(obj?.bankName){
          html += this.commonBankDetailsFormatForFooter(obj?.bankName)
        }

        if(obj?.bankAccountNo){
          html += this.commonBankDetailsFormatForFooter('Acc No : '+obj?.bankAccountNo)
        }
        if(obj?.accountType){
          html += this.commonBankDetailsFormatForFooter('Acc Type : '+obj?.accountType)
        }
        if(obj?.ifscCode){
          html += this.commonBankDetailsFormatForFooter('IFSC :'+obj?.ifscCode)
        }
        if(obj?.upi){
          html += this.commonBankDetailsFormatForFooter(obj?.upi)
        }
        else if(!obj?.upi && obj?.bankAccountNo && obj?.ifscCode){
          html += this.commonBankDetailsFormatForFooter(obj?.bankAccountNo+'@'+obj?.ifscCode+'.ifsc.npci');
        }
      // div2 closed
        html += `</div>`
      }
      // div1 closed
      html +=`</div>`;

      html += this.commonSignatureFormatForFooter(commonTempData.whiteLogo,'Customer Signature');
      html += this.commonSignatureFormatForFooter((this.data?.signature || commonTempData?.whiteLogo),'Authorized Signatory');

    // Main div closed
      html +=`</div>`;

      return html;

    }

    footerTNCAndNotes(){
 
      let html = '';

      if(this.data?.note){
        html += this.commmonTNCAndNotesFormat('Notes',this.data?.note);
      }

      if(this.data?.tnc && !this.data?.isMoneyIn){
        html += this.commmonTNCAndNotesFormat('Terms and Conditions',this.data?.tnc);
      }

      return html;
    }

    commmonTNCAndNotesFormat(title, value){
     return `
        <div
        style="display: flex;flex-wrap:wrap;width: 100%;float: left;margin-bottom: 5px;background: #ffffff;padding:0 25px 5px;"
        class="padding-002525 m-5">
          <div style="font-weight: bold;width: 100%;" class="f-14 f-b">${title}</div>
          <div style="width: 100%;" class="f-14">
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
      <img style="width: 100%;height: 50px;object-fit: contain;object-position: bottom;margin-bottom:5px;" class="m-5" src="${imgBase64}">
      <div style="width: 100%;text-align: center;font-size: 14px;" class="f-16">${title}</div>
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

    commonAmountCalculationFormatForFooterForMoneyIn(title, value){
      return `
      <div class="flex" style="display:flex;flex-wrap:wrap;justify-content:flex-start;width:100%;">
      <div style="display: flow-root;font-size: 14px;color: #000;width: 50%;float: left; font-weight:bold"
      class="f-14 m-5">
        ${title}
      </div>
      <div
      style="display: flow-root;font-size: 14px;color: #000;width: 50%;float: left;text-align: right;"
      class="f-14 m-5">
         ${value}
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

