import { InvoicePrint } from "../models/print.model";
import { commonTempData } from "./commonTempData";

export class TallyGST{

    constructor(
      private data: InvoicePrint,
      ){
      }

    totalSaving = 0; 

    finalTaxPercentageTableObj={};
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
      <div class="container-new border-adj"
      style="display:flow-root;width:210mm;background: white;padding: 0;padding-bottom: 70px;visibility: visible;-webkit-print-color-adjust: exact !important;color-adjust: exact !important;">
      ${this.invoiceTitle()}
        ${this.header()}
        ${this.hsnSacTable()}
        ${await this.footer()}
      </div>
      `
    }

    header(){
      return `
        ${this.sellerAndPartyAndTemplateBody()}
        `
    }


    async footer(){
      return`
      <div class="margin-15" style="margin: 15px;border: 1px solid #4f4f4f;">
      <div style="width: 100%;display:flex;flex-wrap: wrap;">
        ${await this.invoiceAmtAndBankDetails()}
        ${this.notesAndSignature()}
        ${this.termsAndCondition()}
      </div>
      </div>
      `
    }

    termsAndCondition(){
      if(!this.data?.tnc){
        return '';
      }
     
      return `
        <div class="padding-10"
            style="display:flow-root;width: 100%;padding: 5px;border-top: 1px solid #4f4f4f;">
            <div class="f-14" style="font-size: 14px;width: 100%;color:#000;text-transform: uppercase;"><b
                style="color:#000;">Terms and Conditions</b></div>
            <div class="f-14" style="font-size: 14px;width: 100%;color:#000;">${this.data?.tnc}</div>
          </div>
        `
    }

    notesAndSignature(){
      //S:div4
      let html ='';
      html += `
      <div class="padding-10" style="display:flow-root;width: 60%;padding: 5px;border-right: 1px solid #4f4f4f;">`
      if(this.data?.note){
        html += `
        <div class="f-14" style="font-size: 14px;width: 100%;color:#000;text-transform: uppercase;"><b
        style="color:#000;">Notes</b></div>
        <div class="f-14" style="font-size: 14px;width: 100%;color:#000;">${this.data?.note}
        </div>
        `
      }
      //E:div4
      html += '</div>'

      //S:div5
      html += this.commonSignatureFormatForFooter(commonTempData?.whiteLogo,'Customer Signature');
      html += this.commonSignatureFormatForFooter((this.data?.signature || commonTempData?.whiteLogo),'Authorized Signatory');

      return html;
    }
    commonSignatureFormatForFooter(imgBase64, title){
      return `
      <div class="padding-10" style="display: flex;width: 20%;padding: 5px;flex-wrap: wrap;align-items: flex-end;">
        <img src="${imgBase64}" style="width: 30%;height: auto;margin:auto;">
        <div class="f-12" style="font-size: 12px;color: #000;text-align: center;width: 100%;">${title}</div>
      </div>
      `
    }

    async invoiceAmtAndBankDetails(){
      let html = '';
      let obj = this.data?.user?.profileData || null;

      //S: div1
      html +=`<div class="padding-10"style="display:flow-root;width: 50%;border-bottom: 1px solid #4f4f4f;padding: 5px;">`

      html+=`
      <div class="f-14" style="font-size: 14px;color:#000;font-weight:bold;text-transform: uppercase;width: 100%;">
      INVOICE AMOUNT IN WORDS</div>
      <div class="f-14" style="font-size: 14px;color:#000;width: 100%;">
      ${commonTempData.convertToIndianCurrency((this.data?.totalAmount).toString())}
      </div>
      `
      //E: div1
      html+=`</div>`

      //S: div2
      html +=` <div style="width: 50%;display:flow-root;border-bottom: 1px solid #4f4f4f;border-left: 1px solid #4f4f4f;">`

      if(obj && (obj?.bankName || obj?.bankAccountNo || obj?.ifscCode || obj?.upi)){
        if(obj?.upi && this.data?.qrPayLink){
          let qrCodeBase64 = await commonTempData.generateQR(this.data?.qrPayLink);
    
          html += `
          <div style="width: 30%;float: left;">
            <img style="width: 100%;" src="${qrCodeBase64}">
          </div>`
        }
        //S: div3
          html +=`
          <div style="width: 100%;padding: 5px;" class="padding-10">
          <div class="f-14" style="width:100%;text-align: left;color:#000;font-size: 14px;text-transform: uppercase;">
          <b style="color:#000;">Bank Details</b>
          </div>
          `
          if(obj?.bankName){
            html += this.commonBankDetailsFormatForFooter(obj?.bankName)
          }
  
          if(obj?.bankAccountNo){
            html += this.commonBankDetailsFormatForFooter('Acc No : '+obj?.bankAccountNo)
          }
          if(obj?.bankAccountNo && obj?.accountType){
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
        // div3 closed
          html += `</div>`
        }

        //E: div2
        html +=`</div>`
      return html;
    }

    commonBankDetailsFormatForFooter(text){
      return `
      <div class="f-14" style="width:100%;text-align: left;color:#000;font-size: 14px;">${text}</div>
      `
    }

    hsnSacTable(){

      if(!Object.keys(this.finalTaxPercentageTableObj).length){
        return '';
      }

      let partyEl = (this.data?.partyInfo?.profileData || null);

      if(partyEl && (partyEl?.addressState == (this.data?.user?.profileData?.addressState))){
        this.sameState = true;
       }
       else if((!partyEl?.addressState || !(this.data?.user?.profileData?.addressState))){
        this.sameState = true;
      }

      let html ='';

      //S: Main div
      html +=`<div class="margin-15" style="margin:0 15px;border: 1px solid #4f4f4f;border-left: 0;">`

      html +=`<table style="width: 100%; text-align: center;table-layout: fixed;">`

      html +=`<thead class="no-b-btm" style="background-color:#dbdaf3;border-bottom: 1px solid #4f4f4f;-webkit-print-color-adjust: exact !important;color-adjust: exact !important;">`

      html +=`
        <tr>
        <td class="font-12 padding-5555" rowspan="2"
          style="text-transform:uppercase;color:#000;text-align: center !important;padding: 2px;border-top:0;border-right:0;">
          GST%</td>
        <td class="font-12 padding-5555" rowspan="2"
          style="text-transform:uppercase;color:#000;text-align: center !important;padding: 2px;border-top:0;border-right:0;">
          Taxable value</td>
        <td class="font-10 padding-5555" colspan="2"
          style="text-transform:uppercase;color:#000;text-align: center;font-weight: normal;padding: 2px;border-bottom:0;border-top:0;border-right:0;">
          ${(!this.sameState&&this.isTax)?'IGST':'SGST'}
        </td>`
        if(this.sameState&&this.isTax){
          html +=`<td class="font-10 padding-5555" colspan="2"
          style="text-transform:uppercase;color:#000;text-align: center;font-weight: normal;padding: 2px;border-bottom:0;border-top:0;border-right:0;">
          CGST</td>`
        }

        html +=`<td class="font-12 padding-5555" rowspan="2"
          style="text-transform:uppercase;color:#000;text-align: center;padding: 2px;border-top:0;border-right:0;">
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

      html+=this.makeGSTRows()

      html +=`</tbody>`

      html +=`</table>`

      //E: Main div
      html +=`</div>`

      return html;
    }

    makeGSTRows(){
      let html ='';
      for (const key in this.finalTaxPercentageTableObj) {
        if(this.finalTaxPercentageTableObj[key]){
          html +=this.gstSacRow(key,this.finalTaxPercentageTableObj[key]);
        }
      }

      return html;
    }

    gstSacRow(taxPercentage,gstData){
      let html ='';
      for (let i = 0; i < gstData.length; i++) {
        const element = gstData[i];
        html +=`
          <tr>
          <td class="padding-5555 font-12" style="color:#000;border-bottom: 0;border-top: 0;padding: 2px;border-right:0;text-align: center;">
            ${taxPercentage}%</td>
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

    invoiceTitle(){
      let html = '';
      let invoiceTitle = commonTempData.getInvoiceTitle(this.data);

      //S: div1
      html+=`<div class="margin-15" style="display: flex;margin: 15px;margin-bottom: 0 !important;">`;

      if(invoiceTitle){
        html += `
        <div class="f-14" style="font-size: 14px;text-transform: uppercase;color: #000;">${invoiceTitle}</div>
        `
      }
      else {
        html += `
        <div class="f-14" style="font-size: 14px;text-transform: uppercase;color: #000;">TAX INVOICE</div>
        `
      }

      if(this.data?.addressTo){
        html+= `
        <div class="f-14 margin-16" style="font-size: 14px;text-transform: uppercase;color: grey;margin-left: 16px;">
            ${this.data?.addressTo}
        </div>
        `
      }

      //E: div1
      html+=`</div>`
      return html;
    }

    sellerAndPartyAndTemplateBody(){
      let html ='';
      html +=`<div class="margin-15" style="border: 1px solid #4f4f4f;margin: 15px;margin-top: 0 !important;border-bottom:0px;">
      <div style="width: 100%;display:flex;flex-wrap: wrap;">
        <div class="padding-10" style="display:flex;width: 50%;border-right: 1px solid #4f4f4f;padding: 5px;align-items: flex-start;">
      `;
      if(this.data?.logo){
        html += `
        <div style="width: 25%;height: auto;">
          <img src="${this.data?.logo}" style="display: block;margin-left: auto;width:100%;">
        </div>
        `
      }else{
        html +=`
        <div  class="addLogo" style="display: flow-root;float:left;background: white;width: 20%;margin: 5px 0 7px;height:auto;padding: 5px;display: flex;flex-wrap: wrap;border-radius: 6px;border: 2px dashed #dbb73F;">
          <img src="./assets/icons/upload-photo.png" style="display: block;width:40%;margin: 5px auto;">
          <span style="font-size:14px;width:100%;text-align:center;color: #000;" class="f-16">Upload Logo</span>
        </div>
        `
      }
      html+=`<div class="padding-00000010" style="width:75%;padding-left: 10px;">`
      if(this.data?.user?.profileData?.legalName){
        html +=`<div class="f-18" style="font-size: 18px;color:${this.data?.color};">${this.data?.user?.profileData?.legalName}</div>`
      }
      if(this.data?.user?.profileData?.addressLine1){
        html += this.commonLeftSideOfSellerDetails(this.data?.user?.profileData?.addressLine1);    
      }

      if(this.data?.user?.profileData?.contactPersonPhone && this.data?.user?.profileData?.contactPersonPhone!='0'){
        html += this.commonLeftSideOfSellerDetails(this.data?.user?.profileData?.contactPersonPhone);
      }

      if(this.data?.user?.profileData?.contactPersonEmail){
        html += this.commonLeftSideOfSellerDetails(this.data?.user?.profileData?.contactPersonEmail);
      }

      if(this.data?.user?.profileData?.gstNumber){
          html += this.commonLeftSideOfSellerDetails(`${this.data?.user?.profileData?.gstNumber}${this.data?.user?.profileData?.addressState?', '+this.data?.user?.profileData?.addressState:''}`);
      }
      html+=`</div>`

      html+=`</div>`

      //S: div1
      html+=`<div style="width: 50%;display:flex;flex-wrap: wrap;">`
      if(this.data?.invoiceNo){
        let title = `${this.data?.isEstimate ? 'Estimate No':'Invoice No'}`
        html +=
        `<div class="padding-10"
          style="width:33.33%;padding: 5px;display:flow-root;">
          <div class="f-14" style="width:100%;text-align: center;color:#000;font-size: 14px;">${title}</div>
          <div class="f-14" style="width:100%;text-align: center;color:#000;font-size: 14px;font-weight:bold;">${this.data?.invoiceNo}</div>
        </div>    
        `  
      }


      if(this.data?.invoiceDateStamp){
        html +=
        `<div class="padding-10"
        style="width:33.33%;padding: 5px;display:flow-root;">
           <div class="f-14" style="width:100%;text-align: center;color:#000;font-size: 14px;">Bill Date</div>
           <div class="f-14" style="width:100%;text-align: center;color:#000;font-size: 14px;font-weight:bold">${commonTempData.dateToDDMMYYY(this.data?.invoiceDateStamp)}</div>
         </div>    
      `
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
        html += this.commonRightSideOfSellerDetails(salePurReturnBillTitle, this.data?.billNo);
      }

      if((this.data?.isSaleReturn || this.data?.isPurchaseReturn) && this.data?.billDateStamp){
        html += this.commonRightSideDateFormatOfSellerDetails(salePurReturnDateTitle, this.data?.billDateStamp);
      }

      if(this.data?.dueDateStamp){
        html += this.commonRightSideDateFormatOfSellerDetails('Due Date', this.data?.dueDateStamp);
      }

      if(this.data?.purOrderNo && this.data?.purOrderNo != ' ' ){
        html += this.commonRightSideOfSellerDetails('PO No',this.data?.purOrderNo);
      }

      if(this.data?.eWayBillNo){
        html += this.commonRightSideOfSellerDetails('E-way Bill No',this.data?.eWayBillNo);
      }

      if(this.data?.eWayBillDate){
        html += this.commonRightSideDateFormatOfSellerDetails('E-way Bill Date', this.data?.eWayBillDate)

      }

      if(this.data?.vehicleNumber){
        html += this.commonRightSideOfSellerDetails('Vehicle No',this.data?.vehicleNumber);
      }

      if(this.data?.transporterName){
        html += this.commonRightSideOfSellerDetails('Transporter Name',this.data?.transporterName);
      }

      if(this.data?.deliveryDate){
        html += this.commonRightSideDateFormatOfSellerDetails('Delivery Date',this.data?.deliveryDate)
      }
      //E: div1
      html +=`</div>`

      html +=this.partyDetails();

      html+=`</div>`

      //template body here
      html += this.templateBody();
      html +=`</div>`
      return html;

    }

    templateBody(){
      if(!this.data?.invoiceItems.length){
        return '';
      }

      let html = '';
      let totalQty = 0;
      let totalCess = 0;
      let isHsn = false;
      let isMrp = false;
      let isAdditionlDateField = false;
      let isAdditionlInputField = false;
      let additionlDateFieldTitle = '';
      let additionlInputFieldTitle = '';
      let isDiscount =false;
      let dynamicColumnCount = 0;
      let dynamicColWidthCss;
      let sellOrPurchasePrice;
      let receivedOrPaidAmt = 0;


      let gstTableObj={};

      for (let i = 0; i <  this.data?.invoiceItems.length; i++) {
        let el = this.data?.invoiceItems[i] ;

        gstTableObj = this.calculationForHsnTable(el,gstTableObj);
        
        if(this.data?.moneyInInfo || this.data?.moneyOut){
          receivedOrPaidAmt = (this.data?.moneyInInfo?.amount || this.data?.moneyOut?.amount)
       }

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

        if((el?.totalTax || el?.cess) && !this.isTax){
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

      this.finalTaxPercentageTableObj = this.addSameTaxPercentageObjs(gstTableObj);

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

      let dynamicBoldCss = '';
      if(this.data.makeItemNameBold){
        dynamicBoldCss = 'font-weight: bold;';
      }

      let bodyObj ={isHsn,isTax:this.isTax,isMrp,isDiscount,isAdditionlInputField,isAdditionlDateField};


      html +=`<table style="width: 100%;color:#4f4f4f ;text-align: center;table-layout: fixed;border-bottom:1px solid">`

      html+=`
      <thead class="no-b-btm"
      style="background-color:#dbdaf3;border-bottom: 1px solid #4f4f4f;-webkit-print-color-adjust: exact !important;color-adjust: exact !important;color:#000;">
        <th class="f-14" style="border-left:0px;font-size:14px;color:#000;text-align: center;padding:2px;border-right:0;">#</th>
        <th class="f-14" style="font-size:14px;color:#000;text-align: left;width: 30%;padding:2px;border-right:0;text-transform: uppercase;word-break: break-word;">Item Names</th>
        <th class="f-14" style="font-size:14px;color:#000;text-align: right;padding:2px;border-right:0;text-transform: uppercase;word-break: break-word;${!isHsn?'display: none':''}">HSN Code</th>
        <th class="f-14" style="font-size:14px;color:#000;text-align: right;padding:2px;border-right:0;text-transform: uppercase;word-break: break-word;">Qty</th>
        <th class="f-14" style="font-size:14px;color:#000;text-align: right;padding:2px;border-right:0;text-transform: uppercase;word-break: break-word;${!isAdditionlInputField?'display: none':''}">${additionlInputFieldTitle}</th>
        <th class="f-14" style="font-size:14px;color:#000;text-align: right;padding:2px;border-right:0;text-transform: uppercase;word-break: break-word;word-break: inherit;${!isAdditionlDateField?'display: none':''}">${additionlDateFieldTitle}</th>
        <th class="f-14" style="font-size:14px;color:#000;text-align: right;padding:2px;border-right:0;text-transform: uppercase;word-break: break-word;${!isMrp?'display: none':''}">MRP</th>
        <th class="f-14" style="font-size:14px;color:#000;text-align: right;padding:2px;border-right:0;text-transform: uppercase;word-break: break-word;">₹/Unit</th>
        <th class="f-14" style="font-size:14px;color:#000;text-align: right;padding:2px;border-right:0;text-transform: uppercase;word-break: break-word;${!isDiscount?'display: none':''}">Discount</th>
        <th class="f-14" style="font-size:14px;color:#000;text-align: right;padding:2px;border-right:0;text-transform: uppercase;word-break: break-word;${!this.isTax?'display: none':''}">Tax Amt</th>
        <th  class="f-14" style="border-right:0;font-size:14px;color:#000;text-align: right;padding:2px;border-right:0;text-transform: uppercase;word-break: break-word;">Total</th>
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
          <td class="f-14 padding-1055" style="font-size:14px;border-left:0px;text-align: center;padding:2px;border-right:0;border-bottom:0;border-top: 0;">${i+1}</td>
          <td class="f-14 padding-1055"
          style="font-size:14px;text-align: left;width: 30%;padding:2px;border-right:0;border-bottom:0;border-top: 0;${dynamicBoldCss}">
            ${(el.item?.itemName ||'')}
            <span class="f-10" style="display: block;color: grey;font-size: 10px;">${(el?.itemDes?'('+el.itemDes+')':'')}</span>
          </td>
          <td class="f-14 padding-1055" style="font-size:14px;text-align: right;padding:2px;border-right:0;border-bottom:0;border-top: 0;${!isHsn?'display: none':''}">${el?.hsn|| ''}</td>
          <td class="f-14 padding-1055" style="font-size:14px;text-align: right;padding:2px;border-right:0;border-bottom:0;border-top: 0;">${(el?.quantity||0)+" "+(el?.unit||'')}</td>
          <td class="f-14 padding-1055" style="font-size:14px;text-align: right;padding:2px;border-right:0;border-bottom:0;border-top: 0;${!isAdditionlInputField?'display: none':''}">${el?.additionalInputFieldValue||''}</td>
          <td class="f-14 padding-1055" style="font-size:14px;text-align: right;padding:2px;border-right:0;border-bottom:0;border-top: 0;${!isAdditionlDateField?'display: none':''}">${el?.additionalDateFieldValue?commonTempData.dateToDDMMYYY(el?.additionalDateFieldValue):''}</td>
          <td class="f-14 padding-1055" style="font-size:14px;text-align: right;padding:2px;border-right:0;border-bottom:0;border-top: 0;${!isMrp?'display: none':''}">${(el?.mrp ||el?.item?.mrp)||''}</td>
          <td class="f-14 padding-1055" style="font-size:14px;text-align: right;padding:2px;border-right:0;border-bottom:0;border-top: 0;">${sellOrPurchasePrice}</td>
          <td class="f-14 padding-1055" style="font-size:14px;text-align: right;padding:2px;border-right:0;border-bottom:0;border-top: 0;${!isDiscount?'display: none':''}">${(el?.totalDiscount?(el?.totalDiscount) +'<br>'+'('+el?.discountPercent+'%'+')':'')}</td>
          <td class="f-14 padding-1055" style="font-size:14px;text-align: right;padding:2px;border-right:0;border-bottom:0;border-top: 0;${!this.isTax?'display: none':''}">
          ${(((el?.totalTax ||0)+(el?.totalCess||0))>0?commonTempData.unitAdjuster((el?.totalTax|| 0)+(el?.totalCess|| 0))+' ('+(el?.taxPercentage||0)+(el?.cess?(el?.taxPercentage?'+':'')+el?.cess:'')+')%':'')}
          </td>
          <td class="f-14 padding-1055" style="font-size:14px;border-right:0;text-align: right;padding:2px;border-right:0;border-bottom:0;border-top: 0;${dynamicBoldCss}">${el?.totalAmount}</td>
        </tr>
        `
      }
      // tbody tag closed
      html += `</tbody>`
      let receivedOrPaid = this.data?.isPurchase? 'Paid Amount': 'Received Amount';

      this.totalSaving = (this.totalSaving||0)+(this.data?.flatDiscount||0) ;
      let additionalAmount = this.data?.additionalAmount?this.data?.additionalAmount:0;
      let balanceAmt = +(commonTempData.unitAdjuster(this.data?.totalAmount )) - receivedOrPaidAmt;

      html +=`
      <thead class="no-b-btm border-right-0"
      style="-webkit-print-color-adjust: exact !important;color-adjust: exact !important;">
      ${this.commonTemplatebody({...bodyObj,title:'Labour/Delivery Charges',amount:additionalAmount})}
      ${this.commonTemplatebody({...bodyObj,amount:this.data?.flatDiscount,title:'Invoice Discount'})}
        <tr style="background-color:#dbdaf3;">
        <th class="f-14 padding-5555" style="font-size:14px;color:#4f4f4f;text-align: right;padding:2px;border-right:0;border-bottom:0;text-transform: uppercase;border-left:0;"></th>
        <th class="f-14 padding-5555" style="font-weight:normal;font-size:14px;color:#4f4f4f;text-align: left;padding:2px;border-right:0;border-bottom:0;text-transform: uppercase;font-weight:bold">Total Amount</th>
        <th class="f-14 padding-5555" style="font-size:14px;color:#4f4f4f;text-align: right;padding:2px;border-right:0;border-bottom:0;text-transform: uppercase;${!isHsn?'display: none':''}"></th>
        <th class="f-14 padding-5555" style="font-size:14px;color:#4f4f4f;text-align: right;padding:2px;border-right:0;border-bottom:0;text-transform: uppercase;">${totalQty}</th>
        <th class="f-14 padding-5555" style="font-size:14px;color:#4f4f4f;text-align: right;padding:2px;border-right:0;border-bottom:0;text-transform: uppercase;${!isAdditionlInputField?'display: none':''}"></th>
        <th class="f-14 padding-5555" style="font-size:14px;color:#4f4f4f;text-align: right;padding:2px;border-right:0;border-bottom:0;text-transform: uppercase;${!isAdditionlDateField?'display: none':''}"></th>
        <th class="f-14 padding-5555" style="font-size:14px;color:#4f4f4f;text-align: right;padding:2px;border-right:0;border-bottom:0;text-transform: uppercase;${!isMrp?'display: none':''}"></th>
        <th class="f-14 padding-5555" style="font-size:14px;color:#4f4f4f;text-align: right;padding:2px;border-right:0;border-bottom:0;text-transform: uppercase;"></th>
        <th class="f-14 padding-5555" style="font-size:14px;color:#4f4f4f;text-align: right;padding:2px;border-right:0;border-bottom:0;text-transform: uppercase;${!isDiscount?'display: none':''}">
        ${(this.data?.discountAmount?'₹'+this.data?.discountAmount:'')}
        </th>
        <th class="f-14 padding-5555" style="font-size:14px;color:#4f4f4f;text-align: right;padding:2px;border-right:0;border-bottom:0;text-transform: uppercase;${!this.isTax?'display: none':''}">
        ${((this.data?.gstAmount||0)+(totalCess))>0?'₹'+commonTempData.unitAdjuster((this.data?.gstAmount||0)+(totalCess)):''}
        </th>
        <th class="f-14 padding-5555" style="font-weight:bold;font-size:14px;color:#4f4f4f;text-align: right;padding:2px;border-right:0;border-bottom:0;text-transform: uppercase;">
        ₹${commonTempData.unitAdjuster((this.data?.totalAmount||0) - (this.data?.additionalAmount||0) + (this.data?.flatDiscount||0))}
        </th>
      </tr>
      
      ${this.commonTemplatebody({...bodyObj,amount:receivedOrPaidAmt,title:receivedOrPaid,isBold:true})}
      ${this.commonTemplatebody({...bodyObj,amount:balanceAmt,title:'Balance',isBold:true})}
      ${this.commonTemplatebody({...bodyObj,amount:this.totalSaving,title:'Total Saving',isBold:true})}

      </thead>
      `
      html +=`</table>`;


      return html;
    }

    commonTemplatebody(data){
      if(!data?.amount){
        return ''
      }
      let dynamicBoldCss = '';
      if(data?.isBold){
        dynamicBoldCss = 'font-weight: bold;';
      }
      return`
      <tr>
      <th class="f-14 padding-5555" style="font-size:14px;color:#4f4f4f;text-align: right;padding:2px;border-right:0;border-bottom:0;text-transform: uppercase;border-left:0;"></th>
      <th class="f-14 padding-5555" style="font-weight:normal;font-size:14px;color:#4f4f4f;text-align: left;padding:2px;border-right:0;border-bottom:0;text-transform: uppercase;${dynamicBoldCss}">${data?.title}</th>
      <th class="f-14 padding-5555" style="font-size:14px;color:#4f4f4f;text-align: right;padding:2px;border-right:0;border-bottom:0;text-transform: uppercase;${!data?.isHsn?'display: none':''}"></th>
      <th class="f-14 padding-5555" style="font-size:14px;color:#4f4f4f;text-align: right;padding:2px;border-right:0;border-bottom:0;text-transform: uppercase;"></th>
      <th class="f-14 padding-5555" style="font-size:14px;color:#4f4f4f;text-align: right;padding:2px;border-right:0;border-bottom:0;text-transform: uppercase;${!data?.isAdditionlInputField?'display: none':''}"></th>
      <th class="f-14 padding-5555" style="font-size:14px;color:#4f4f4f;text-align: right;padding:2px;border-right:0;border-bottom:0;text-transform: uppercase;${!data?.isAdditionlDateField?'display: none':''}"></th>
      <th class="f-14 padding-5555" style="font-size:14px;color:#4f4f4f;text-align: right;padding:2px;border-right:0;border-bottom:0;text-transform: uppercase;${!data?.isMrp?'display: none':''}"></th>
      <th class="f-14 padding-5555" style="font-size:14px;color:#4f4f4f;text-align: right;padding:2px;border-right:0;border-bottom:0;text-transform: uppercase;"></th>
      <th class="f-14 padding-5555" style="font-size:14px;color:#4f4f4f;text-align: right;padding:2px;border-right:0;border-bottom:0;text-transform: uppercase;${!data?.isDiscount?'display: none':''}"></th>
      <th class="f-14 padding-5555" style="font-size:14px;color:#4f4f4f;text-align: right;padding:2px;border-right:0;border-bottom:0;text-transform: uppercase;${!data?.isTax?'display: none':''}"></th>
      <th class="f-14 padding-5555" style="font-weight:normal;font-size:14px;color:#4f4f4f;text-align: right;padding:2px;border-right:0;border-bottom:0;text-transform: uppercase;${dynamicBoldCss}">
      ₹${commonTempData?.unitAdjuster(data?.amount ||0)}
      </th>
      `
    }

    commonFormatBillToAndShipTo(text){
      return `<div class="f-14" style="font-size: 14px;width: 100%;color:#000;">
        ${text}
      </div>`    
    }

    commonRightSideDateFormatOfSellerDetails(title,timeStamp){
      return `
      <div class="padding-10"
      style="width:33.33%;padding: 5px;display:flow-root;">
        <div class="f-14" style="width:100%;text-align: center;color:#000;font-size: 14px;">${title}</div>
        <div class="f-14" style="width:100%;text-align: center;color:#000;font-size: 14px;">${commonTempData.dateToDDMMYYY(timeStamp)}</div>
      </div>    
      `
    }

    commonRightSideOfSellerDetails(title,value){
      return `
      <div class="padding-10"
      style="width:33.33%;padding: 5px;display:flow-root;">
        <div class="f-14" style="width:100%;text-align: center;color:#000;font-size: 14px;">${title}</div>
        <div class="f-14" style="width:100%;text-align: center;color:#000;font-size: 14px;">${value}</div>
      </div>    
      `
    }

    commonLeftSideOfSellerDetails(text:string){
      return `
      <div class="f-14" style="font-size: 14px;color:#000;">${text}</div>
      `
    }

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
    calculationForHsnTable(el,gstTableObj){

      if(el?.taxPercentage){ 
          if(gstTableObj[el?.taxPercentage]){
            gstTableObj[el?.taxPercentage].push({
              ...this.commonHsnTableCode(el)
            })
          } else{
            gstTableObj[el?.taxPercentage] = [{
              ...this.commonHsnTableCode(el)
            }]
          }
      }

      return gstTableObj;

    }


    partyDetails(){
      let html ='';
      let el = this.data?.partyInfo?.profileData || null;
      //S: div2
      html +=`<div class="padding-10"
      style="display:flex;width: 50%;border-right: 1px solid #4f4f4f;border-top: 1px solid #4f4f4f;padding: 5px;flex-wrap: wrap;">`
      
      let billTitle = this.data?.isPurchase? 'Bill From': 'Bill To';

      html +=`<div class="f-14" style="font-size: 14px;width: 100%;color:#000;font-weight:bold">
                ${billTitle}:
           </div>`

      if(el?.legalName){
        html +=this.commonFormatBillToAndShipTo(el?.legalName);
      }

      if(el?.contactPersonName == el?.contactPersonPhone){
        html +=this.commonFormatBillToAndShipTo(el?.contactPersonPhone)
      } else {

        if(el?.contactPersonName){
          if(el?.contactPersonName == "Party Not Available"){
            html+=`<div class="f-14" style="font-size: 14px;width: 100%;color:red;font-weight:bold;">
                      Party Has Been Deleted
                    </div>`  
          }else{
            html+=`<div class="f-14" style="font-size: 14px;width: 100%;color:#000;font-weight:bold;">
                      ${el?.contactPersonName}
                    </div>`
          }
        }

        if(el?.contactPersonPhone){
          html +=this.commonFormatBillToAndShipTo(el?.contactPersonPhone)
        }
      }


      if(el?.contactPersonEmail){
        html +=this.commonFormatBillToAndShipTo(el?.contactPersonEmail);
      }

      if(el?.addressLine1 || el?.addressState){
        html +=this.commonFormatBillToAndShipTo(
          `${el?.addressLine1?el?.addressLine1: ''}${el?.addressState? ', '+el?.addressState:''}${el?.addressPincode?', '+el?.addressPincode:''}`
        );
      }

      if(el?.gstNumber){
        html +=this.commonFormatBillToAndShipTo(el?.gstNumber);
      }
      if(el?.udf1T && el?.udf1V){
        let text = `${el?.udf1T? el?.udf1T: ''}${el?.udf1V? ' : '+el?.udf1V:''}`
        html +=this.commonFormatBillToAndShipTo(text);
      }
      if(el?.udf2T && el?.udf2V){
        let text = `${el?.udf2T? el?.udf2T: ''}${el?.udf2V? ' : '+el?.udf2V:''}`
        html +=this.commonFormatBillToAndShipTo(text);
      }
      if(el?.udf3T && el?.udf3V){
        let text = `${el?.udf3T? el?.udf3T: ''}${el?.udf3V? ' : '+el?.udf3V:''}`
        html +=this.commonFormatBillToAndShipTo(text);
      }
      //E:div2
      html+=`</div>`

      //S:div3
      html+=`<div class="padding-10"
      style="display:flex;width: 50%;border-top: 1px solid #4f4f4f;padding: 5px;flex-wrap: wrap;">`

      html +=`<div class="f-14" style="font-size: 14px;width: 100%;color:#000;font-weight:bold">
                    ${this.data?.isPurchase?'Ship From':'Ship To'}:
              </div>`

      if(el?.legalName){
        html +=this.commonFormatBillToAndShipTo(`M/s. ${el?.legalName}`);
      }

      if(el?.contactPersonName == el?.contactPersonPhone){
        html +=this.commonFormatBillToAndShipTo(el?.contactPersonPhone);
      } else {

        if(el?.contactPersonName == "Party Not Available"){
          html+=`<div class="f-14" style="font-size: 14px;width: 100%;color:red;font-weight:bold;">
                    Party Has Been Deleted
                  </div>`  
        }else{
          html+=`<div class="f-14" style="font-size: 14px;width: 100%;color:#000;font-weight:bold;">
                    ${el?.contactPersonName}
                  </div>`
        }

         if(el?.contactPersonPhone){
            html +=this.commonFormatBillToAndShipTo(el?.contactPersonPhone);
         }

       }

      if(el?.contactPersonEmail){
        html +=this.commonFormatBillToAndShipTo(el?.contactPersonEmail);
      }


      if(el?.gstNumber){
          html +=this.commonFormatBillToAndShipTo(el?.gstNumber);
      }
      if(el?.udf1T && el?.udf1V){
        let text = `${el?.udf1T? el?.udf1T: ''}${el?.udf1V? ' : '+el?.udf1V:''}`
        html +=this.commonFormatBillToAndShipTo(text)
      }
      if(el?.udf2T && el?.udf2V){
        let text = `${el?.udf2T? el?.udf2T: ''}${el?.udf2V? ' : '+el?.udf2V:''}`
        html +=this.commonFormatBillToAndShipTo(text)
      }
      if(el?.udf3T && el?.udf3V){
        let text = `${el?.udf3T? el?.udf3T: ''}${el?.udf3V? ' : '+el?.udf3V:''}`
        html +=this.commonFormatBillToAndShipTo(text)
      }

      if(this.data?.deliveryState || el?.addressOneLine1 || el?.addressOneState) {
        let deliveryState = this.data?.deliveryState || el?.addressOneState;
        html +=this.commonFormatBillToAndShipTo(`${el?.addressOneLine1? el?.addressOneLine1: ''}${deliveryState? ', '+deliveryState:''}${el?.addressOnePincode? ', '+el?.addressOnePincode:''}`);
      }

      //E:div3
      html +=`</div>`

      return html;
    }

}

