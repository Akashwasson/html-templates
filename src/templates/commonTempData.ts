import QRCode from 'qrcode'
export class commonTempData {

  static billType(data) {
    let billType='';
    if (data.isMoneyIn) {
      return billType= 'moneyIn';
    }
    if(data.isMoneyOut){
      return billType='moneyOut';
    }
    if (data.isSaleReturn) {
      return billType='saleReturn';
    }
    if (data.isPurchaseReturn) {
      return billType='purchaseReturn';
    }
    if (data.isEstimate) {
      return billType='estimate';
    }
    if (data.isPurchase) {
      return billType='purchase'
    }
    if (data.invoiceTitle) {
      return billType='sale';
    }
    if (data.user.profileData.invoiceTitle) {
      return billType='sale';
    }
    return billType='sale';
  }

  static  generateQR = async (text) => {
    try {
      let qrCode = await QRCode.toDataURL(text);
      return qrCode;
    } catch (err) {
      console.error(err)
    }
  }
  static dateToDDMMYYY(date: number, seperator?: string) {
    if (!seperator) seperator = '/';
    const d = new Date(date);
    const dd = d.getDate() > 9 ? d.getDate() : '0' + d.getDate();
    const mm = d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1);
    const yyyy = d.getFullYear();
    return dd + seperator + mm + seperator + yyyy
  }

  static whiteLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAA1BMVEX///+nxBvIAAAAR0lEQVR4nO3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPBgxUwAAU+n3sIAAAAASUVORK5CYII="
  static upiLogo = "data:image/png;base64,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"
  static convertToIndianCurrency(numberAsString: any) {
    numberAsString = parseFloat(numberAsString);
    numberAsString = (numberAsString.toFixed(2)).toString();

    if (parseInt(numberAsString) === 0) {
      return 'Rupees Zero Only';
    }
    let inputNumber;
    let no = ~~numberAsString;
    const decimal = ~~(numberAsString.split('.')[1]);
    const digitsLength = no.toString().length;
    let i = 0;
    const str = [];
    const words = {
      0: '',
      1: 'One',
      2: 'Two',
      3: 'Three',
      4: 'Four',
      5: 'Five',
      6: 'Six',
      7: 'Seven',
      8: 'Eight',
      9: 'Nine',
      10: 'Ten',
      11: 'Eleven',
      12: 'Twelve',
      13: 'Thirteen',
      14: 'Fourteen',
      15: 'Fifteen',
      16: 'Sixteen',
      17: 'Seventeen',
      18: 'Eighteen',
      19: 'Nineteen',
      20: 'Twenty',
      30: 'Thirty',
      40: 'Forty',
      50: 'Fifty',
      60: 'Sixty',
      70: 'Seventy',
      80: 'Eighty',
      90: 'Ninety',
    };
    const digits = ['', 'Hundred', 'Thousand', 'Lakh', 'Crore'];
    while (i < digitsLength) {
      const divider = (i == 2) ? 10 : 100;
      inputNumber = ~~(no % divider);
      no = no / divider;
      i += divider == 10 ? 1 : 2;
      if (inputNumber > 0) {
        const counter = str.length;
        const plural = (counter > 0 && inputNumber > 9) ? 's' : '';
        const tmp = (inputNumber < 21) ?
          words[~~inputNumber] + ' ' + digits[counter] + plural :
          words[Math.floor(inputNumber / 10) * 10] + ' ' + words[~~(inputNumber % 10)] + ' ' + digits[counter] + plural;
        str.push(tmp);
      } else {
        str.push('');
      }
    }
    str.reverse();
    const rupees = str.join(' ').trim();

    const paise = (decimal) > 0 ? ' And ' +
      words[(decimal - decimal % 10)] +
      (words[(decimal % 10)] ? ' ' : '') + words[(decimal % 10)] + ' Paise' : '';

    return 'Rupees ' + rupees + paise + ' Only';
  }

  static unitAdjuster(data) {
    const count = +data
    let decimalCount = count.toString().split(".")[1] ? count.toString().split(".")[1].length : 0;
    return data = decimalCount && decimalCount > 0 ? count.toFixed(2) : count;

  }

  static getInvoiceTitle(data) {
    let invoiceTitle = '';
    if (data.isMoneyIn) {
      return invoiceTitle = 'Payment Receipt';
    }
    if(data.isMoneyOut){
      return invoiceTitle = 'Payment Receipt';
    }
    if (data.isSaleReturn) {
      return invoiceTitle = 'Sale Return';
    }
    if (data.isPurchaseReturn) {
      return invoiceTitle = 'Purchase Return';
    }
    if (data.isEstimate) {
      return invoiceTitle = data?.user?.profileData?.estimateTitle ||'Estimate';
    }
    if (data.isPurchase) {
      return invoiceTitle = 'Purchase Invoice';
    }
    if (data.invoiceTitle) {
      return invoiceTitle = data.invoiceTitle;
    }
    if (data.user.profileData.invoiceTitle) {
      return invoiceTitle = data.user.profileData.invoiceTitle;
    }
    return false;
  }

  
  static mobileCss(){
    return `
    @media (max-width: 480px) and (min-width: 320px) {
      
      .m-l-neg-2{
        margin-left: -2px !important;
      }
      .padding-252500 {
        padding: 3vw 3vw 0 !important;
      }
      .padding-002525 {
        padding: 0 3vw 3vw !important;
      }
      .padding-002525-new {
        padding: 0 3vw 0vw !important;
      }
      .padding-002510 {
        padding: 0 3vw 2vw !important;
      }
      .padding-20 {
        padding: 2.4vw !important;
      }
      .padding-16 {
        padding: 1.8vw !important;
      }
      .padding-25 {
        padding: 3vw !important;
      }
      .padding-002500 {
        padding: 0 3vw 0 !important;
      }
      .padding-1055{
        padding: 1.3vw 1vw !important;
      }
      .padding-15 {
        padding: 1.3vw !important;
      }
      .padding-13 {
        padding: 1vw 1vw 1vw 0 !important;
      }
      .f-16 {
        font-size: 2vw !important;
      }
      .f-14 {
        font-size: 1.4vw !important;
      }
      .f-10{
        font-size: 1.1vw !important;
      }
      .margin-10{
        margin: 10px !important;
      }
      .margin-15{
        margin: 1.45vw !important;
      }
      .margin-16{
        margin-left: 1.55vw !important;
      }
      .f-12 {
        font-size: 1.2vw !important;
      }
      .f-18 {
        font-size: 2.2vw !important;
      }
      .f-22 {
        font-size: 2.6vw !important;
      }
      .f-20 {
        font-size: 2.4vw !important;
      }
      .mt-20 {
        margin-top: 3vw !important;
      }
      .border-full thead.border,
      .border-full thead {
        border-color: #000 !important;
      }
      .padding-1301 {
        padding: 3vw 1vw !important;
      }
      .border-full {
        border: 0.3vw solid #4f4f4f !important;
      }
      .b-w-l {
        border-left: 0.3vw solid #4f4f4f !important;
      }
      .b-w-r {
        border-right: 0.3vw solid #4f4f4f !important;
      }
      .b-w-b {
        border-bottom: 0.3vw solid #4f4f4f !important;
      }
      .b-w-t {
        border-top: 0.3vw solid #4f4f4f !important;
      }
      .o-c.border-full {
        border-color: #808080 !important;
      }
      .o-c .b-w-r {
        border-right: 0.3vw solid #808080 !important;
      }
      .o-c .b-w-l {
        border-left: 0.3vw solid #808080 !important;
      }
      .o-c .b-w-t {
        border-top: 0.3vw solid #808080 !important;
      }
      .o-c .b-w-b {
        border-bottom: 0.3vw solid #808080 !important;
      }
      .padding-0510 {
        padding: 0.3vw 1.2vw !important;
      }
      .padding-00150015{
        padding: 0 1.3vw 0 1.3vw !important;
      }
      .padding-00100000{
        padding: 0 1.3vw 0 0 !important;
      }
      .f-30 {
        font-size: 4.3vw !important;
      }
      .padding-10 {
        padding: 0.6vw !important;
      }
      .padding-00000010{
        padding:0 0 0 0.6vw !important;
      }
      table {
        font-size: 2vw;
      }
      .container-new {
        width: calc(100% - 2vw) !important;
        margin: 1vw;
        padding-bottom: 7vw !important;
      }
      .m-5 {
        margin-bottom: 0.6vw !important;
      }
      th,
      td {
        padding: 0.6vw !important;
        font-size: 1.6vw;
      }
      .border-right-0 tr th:last-child{
        border-right: 0 !important;
      }
      td.padding-0515 {
        padding: 0.6vw 1.8vw !important;
      }
      .padding-25.top {
        padding: 7vw 3vw 3vw !important;
      }
      .padding-102525 {
        padding: 2vw 3vw 3vw !important;
      }
      thead {
        border-bottom: 0.25vw solid #4f4f4f !important;
      }
      thead.border {
        border-top: 0.25vw solid #4f4f4f !important;
        border-bottom: 0.25vw solid #4f4f4f !important;
      }
      thead.border.bb-00 {
        border-top: 0.25vw solid #4f4f4f !important;
        border-bottom: 0.25vw solid #4f4f4f !important;
      }
      .bb-a2 {
        border-bottom: 0.25vw solid #a24646 !important;
      }
    }
    
    @media (max-width: 480px) and (min-width: 320px) {
      .m-l-neg-2{
        margin-left: -2px !important;
      }
      .padding-252500 {
        padding: 3vw 3vw 0 !important;
      }
      .padding-002525 {
        padding: 0 3vw 3vw !important;
      }
      .padding-002525-new {
        padding: 0 3vw 0vw !important;
      }
      .padding-002510 {
        padding: 0 3vw 2vw !important;
      }
      .padding-000010{
        padding: 0 0 2vw !important;
      }
      .padding-0005{
        padding: 0 1vw !important;
      }
      .padding-20 {
        padding: 2.4vw !important;
      }
      .padding-16 {
        padding: 1.8vw !important;
      }
      .padding-25 {
        padding: 3vw !important;
      }
      .padding-002500 {
        padding: 0 3vw 0 !important;
      }
      .padding-15 {
        padding: 1.3vw !important;
      }
      .padding-13 {
        padding: 1vw 1vw 1vw 0 !important;
      }
      .f-10 {
        font-size: 1.4vw !important;
      }
      .f-13 {
        font-size: 1.7vw !important;
      }
      .f-14 {
        font-size: 1.8vw !important;
      }
      .f-16 {
        font-size: 2vw !important;
      }
      .f-18 {
        font-size: 2.2vw !important;
      }
      .f-22 {
        font-size: 2.6vw !important;
      }
      .f-24 {
        font-size: 2.8vw !important;
      }
      .f-20 {
        font-size: 2.4vw !important;
      }
      .mt-20 {
        margin-top: 3vw !important;
      }
      .border-full thead.border,
      .border-full thead {
        border-color: #000 !important;
      }
      .padding-1301 {
        padding: 3vw 1vw !important;
      }
      .border-full {
        border: 0.3vw solid #4f4f4f !important;
      }
      .b-w-l {
        border-left: 0.3vw solid #4f4f4f !important;
      }
      .b-w-r {
        border-right: 0.3vw solid #4f4f4f !important;
      }
      .b-w-b {
        border-bottom: 0.3vw solid #4f4f4f !important;
      }
      .b-w-t {
        border-top: 0.3vw solid #4f4f4f !important;
      }
      .o-c.border-full {
        border-color: #808080 !important;
      }
      .o-c .b-w-r {
        border-right: 0.3vw solid #808080 !important;
      }
      .o-c .b-w-l {
        border-left: 0.3vw solid #808080 !important;
      }
      .o-c .b-w-t {
        border-top: 0.3vw solid #808080 !important;
      }
      .o-c .b-w-b {
        border-bottom: 0.3vw solid #808080 !important;
      }
      .padding-0510 {
        padding: 0.3vw 1.2vw !important;
      }
      .padding-00150015{
        padding: 0 1.3vw 0 1.3vw !important;
      }
      .padding-00100000{
        padding: 0 1.3vw 0 0 !important;
      }
      .padding-0010{
        padding: 0 1.3vw !important;
      }
      .padding-1000{
        padding: 1.3vw 0 !important;
      }
      .f-30 {
        font-size: 4.3vw !important;
      }
      .padding-10 {
        padding: 0.6vw !important;
      }
      table {
        font-size: 2vw;
      }
      .container-new {
        width: calc(100% - 2vw) !important;
        margin: 1vw;
        padding-bottom: 7vw !important;
      }
      .timesNewRoman{
        margin: 0;
        padding: 0;
        outline: none !important;
        font-family: "Times New Roman", Times, serif !important;
        color: #545454;
        color: #4f4f4f;
      }
      .openSans{
        margin: 0;
        padding: 0;
        outline: none !important;
        font-family: 'Open Sans', sans-serif !important;
        color: #545454;
        color: #4f4f4f;
      }
      .arial{
        margin: 0;
        padding: 0;
        outline: none !important;
        font-family:  Arial, Helvetica, sans-serif !important;
        color: #545454;
        color: #4f4f4f;
      }
      .m-5 {
        margin-bottom: 0.6vw !important;
      }
      th,
      td {
        padding: 0.6vw !important;
        font-size: 1.6vw !important;
      }
      td.padding-0515 {
        padding: 0.6vw 1.8vw !important;
      }
      .padding-25.top {
        padding: 7vw 3vw 3vw !important;
      }
      .padding-102525 {
        padding: 2vw 3vw 3vw !important;
      }
    
      thead.border {
        border-top: 0.25vw solid #4f4f4f !important;
      }
      thead.border.bb-00 {
        border-top: 0.25vw solid #4f4f4f !important;
        border-bottom: 0.25vw solid #4f4f4f !important;
      }
      .bb-a2 {
        border-bottom: 0.25vw solid #a24646 !important;
      }
    }

    @media (min-width: 480px){
      .m-l-neg-10{
        margin-left: -10px !important;
      }
      .font-10{
        font-size: 10px !important;
      }
      .font-12{
        font-size: 12px !important;
      }
      .font-24{
        font-size: 24px !important;
      }
      .new-padding{
        padding: 0 22px !important;
      }
      
      
      .m-l-neg-10{
        margin-left: -10px !important;
      }

    }

    @media (max-width: 1150px) and (min-width: 992px) {
      .container-new {
        width: 100%;
      }
      .padding-252500 {
        padding: 22px 22px 0 !important;
      }
      .padding-002525 {
        padding: 0 22px 22px !important;
      }
      .padding-002525-new {
        padding: 0 22px 0px !important;
      }
      .padding-002510 {
        padding: 0 22px 14px !important;
      }
      .padding-20 {
        padding: 18px !important;
      }
      .padding-16 {
        padding: 14px !important;
      }
      .padding-002500 {
        padding: 0 22px 0 !important;
      }
      .padding-102525 {
        padding: 14px 22px 22px !important;
      }
      .padding-25 {
        padding: 22px !important;
      }
      .padding-15 {
        padding: 12px !important;
      }
      .padding-13 {
        padding: 8px 8px 8px 0 !important;
      }
      .f-16 {
        font-size: 14px !important;
      }
      .f-14 {
        font-size: 12px !important;
      }
      .f-10{
        font-size: 8px !important;
      }
      .margin-15{
        margin: 13px !important;
      }
      .f-12 {
        font-size: 10px !important;
      }
      .f-18 {
        font-size: 16px !important;
      }
      .f-22 {
        font-size: 20px !important;
      }
      table {
        font-size: 12px;
      }
      .container-new {
        width: calc(100% - 20px) !important;
        margin: 10px;
        padding-bottom: 70px !important;
      }
      .m-5 {
        margin-bottom: 4px !important;
      }
      .padding-25.top {
        padding: 70px 22px 22px !important;
      }
    }

    @media (min-width: 992px) {
      .preview-body {
        margin: 0;
      }
      .footer a,
      .footer a:hover,
      .footer a:focus {
        padding: 5px 60px;
        font-size: 15px;
      }
      .sprite-preview {
        cursor: pointer;
      }
    }

  
    `
  }

  static tallyTemplateCss() {
      return `
            table,
      th,
      td {
        border: 1px solid #4f4f4f;
        border-collapse: collapse;
      }

    table {
      border: 0;
    }

    table tr:last-child td {
      border-bottom: 0;
    }

    table tr th,
    table tr td {
      width: 12.5% !important;
      word-break: break-all;
      text-align: center;
    }
    table tr th:nth-child(1),
    table tr td:nth-child(1) {
      width: 5% !important;
      text-align: left;
    }
    table tr th:nth-child(2),
    table tr td:nth-child(2) {
      width: 20% !important;
      word-break: break-word;
      text-align: left !important;
      overflow: initial !important;
      white-space: normal !important;
    }
    table tr th:last-child,
    table tr td:last-child {
      text-align: right;
    }
    .container-new {
      -webkit-print-color-adjust: exact;
    }
    .no-b-btm{
      border-bottom: 0 !important;
    }

    .icons-height{
      height: 10px !important;
    }

    @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 2) {
      .padding-252500 {
        padding: 3vw 3vw 0 !important;
      }
      .padding-002525 {
        padding: 0 3vw 3vw !important;
      }
      .padding-002525-new {
        padding: 0 3vw 0vw !important;
      }
      .padding-002510 {
        padding: 0 3vw 2vw !important;
      }
      .padding-20 {
        padding: 2.4vw !important;
      }
      .padding-16 {
        padding: 1.8vw !important;
      }
      .padding-002500 {
        padding: 0 3vw 0 !important;
      }
      .padding-102525 {
        padding: 2vw 3vw 3vw !important;
      }
      .padding-25 {
        padding: 3vw !important;
      }
      .padding-15 {
        padding: 1.3vw !important;
      }
      .padding-1055{
        padding: 1.3vw 1vw !important;
      }
      .padding-13 {
        padding: 1vw 1vw 1vw 0 !important;
      }
      .f-16 {
        font-size: 2vw !important;
      }
      .f-14 {
        font-size: 1.7vw !important;
      }
      .f-10{
        font-size: 1.2vw !important;
      }
      .margin-15{
        margin: 1.45vw !important;
      }
      .margin-16{
        margin-left: 1.55vw !important;
      }
      .f-12 {
        font-size: 1.2vw !important;
      }
      .f-18 {
        font-size: 2.2vw !important;
      }
      .f-22 {
        font-size: 2.6vw !important;
      }
      .f-20 {
        font-size: 2.4vw !important;
      }
      .mt-20 {
        margin-top: 3vw !important;
      }
      .padding-10101010 {
        padding: 1vw !important;
      }
      .border-full {
        border: 0.3vw solid #4f4f4f !important;
      }
      .b-w-l {
        border-left: 0.3vw solid #4f4f4f !important;
      }
      .b-w-r {
        border-right: 0.3vw solid #4f4f4f !important;
      }
      .b-w-b {
        border-bottom: 0.3vw solid #4f4f4f !important;
      }
      .b-w-t {
        border-top: 0.3vw solid #4f4f4f !important;
      }
      .o-c.border-full {
        border-color: #808080 !important;
      }
      .o-c .b-w-r {
        border-right: 0.3vw solid #808080 !important;
      }
      .o-c .b-w-l {
        border-left: 0.3vw solid #808080 !important;
      }
      .o-c .b-w-t {
        border-top: 0.3vw solid #808080 !important;
      }
      .o-c .b-w-b {
        border-bottom: 0.3vw solid #808080 !important;
      }
      .f-30 {
        font-size: 4.3vw !important;
      }
      .padding-0510 {
        padding: 0.3vw 1.2vw !important;
      }
      .padding-00150015{
        padding: 0 1.3vw 0 1.3vw !important;
      }
      .padding-00100000{
        padding: 0 1.3vw 0 0 !important;
      }
      .padding-10 {
        padding: 0.6vw !important;
      }
      .padding-00000010{
        padding:0 0 0 0.6vw !important;
      }
      .padding-10101010 {
        padding: 1vw !important;
      }
      .border-full thead.border,
      .border-full thead {
        border-color: #000 !important;
      }
      .padding-1301 {
        padding: 3vw 1vw !important;
      }
      table {
        font-size: 2vw;
      }
      .container-new {
        width: calc(100% - 2vw) !important;
        margin: 1vw;
        padding-bottom: 7vw !important;
      }
      .m-5 {
        margin-bottom: 0.6vw !important;
      }
      .padding-25.top {
        padding: 7vw 3vw 3vw !important;
      }
      thead {
        border-bottom: 0.25vw solid #4f4f4f !important;
      }
      thead.border {
        border-top: 0.25vw solid #4f4f4f !important;
        border-bottom: 0.25vw solid #4f4f4f !important;
      }
      .bb-a2 {
        border-bottom: 0.25vw solid #a24646 !important;
      }
    }


    /*
    table tbody tr:nth-child(even) td {
      background-color: #f5f5f5 !important;
      color-adjust: exact;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    */
    .header-invoice {
      display: flex;
      align-items: center;
      left: 0;
      padding: 12px;
      border-bottom: 1px solid #ebebeb;
      position: fixed;
      top: 0;
      z-index: 9999;
      background: white;
      width: 100%;
    }
    .preview-body {
      width: 100%;
      display: flow-root;
      color-adjust: exact;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .header-invoice span {
      width: max-content;
      margin: 0 15px;
      font-size: 16px;
      color: #000;
    }
    .footer {
      position: fixed;
      bottom: 0;
      display: flex;
      align-items: center;
      left: 0;
      width: 100%;
      background: white;
      border-top: 1px solid #ebebeb;
      left: 0;
    }
    .footer a,
    .footer a:hover,
    .footer a:focus {
      background-image: linear-gradient(
        to right,
        #606ced,
        #5370ef,
        #4374f1,
        #3078f3,
        #0c7bf4
      );
      display: flex;
      color: white;
      padding: 1vw 6vw;
      font-size: 3.5vw;
      text-decoration: none;
    }
    .footer .sprite-preview {
      margin: auto;
    }
    .sprite-preview {
      background: url("/assets/icons/preview-sprite-10.png") no-repeat;
      width: 26px;
      height: 25px;
      background-position: 0 0;
      background-size: cover;
      margin: 0;
    }
    .sprite-preview.palette-selector {
      background-position: -37px 0;
      margin-left: auto;
    }
    .sprite-preview.edit-options {
      background-position: -73px 0;
      margin: 0 15px;
    }
    .sprite-preview.more-options {
      background-position: -86px 0;
      margin-right: 0;
      height: 20px;
    }
    .sprite-preview.whatsapp {
      background-position: -194px 0;
      width: 39px;
      height: 35px;
    }
    .sprite-preview.print {
      background-position: -212px 0;
      width: 35px;
      height: 30px;
    }
    .sprite-preview.download {
      background-position: -260px 0;
      width: 40px;
      height: 30px;
    }
    .item-scroll {
      display: flex;
      padding: 0;
      overflow: auto;
      margin: 10px 0;
    }
    .item-scroll::-webkit-scrollbar {
      display: none;
    }
    .item-scroll button {
      margin: 0 5px;
      padding: 5px 20px;
      background: #ffffff;
      border: 1px solid #ebebeb;
      border-radius: 100px;
      color: #9babc2;
      min-height: 33px;
      font-size: 13px;
      min-width: max-content;
    }
    .item-scroll button.active {
      color: #4285f4;
      background: #d2e2fb;
      border-color: #d2e2fb;
    }
    .preview-body .c-i {
      width: 100%;
      display: flex;
      border: 1px solid #ebebeb;
      background: #fbfbfb;
      padding: 5px;
      border-radius: 30px;
      position: relative;
      align-items: center;
      justify-content: space-between;
      margin: 5px 0 10px;
    }
    .preview-body .c-i span {
      margin-left: 10px;
      margin-right: auto;
      color: #000;
    }
    .preview-body .c-i .picker {
      width: 33px;
      height: 33px;
      overflow: hidden;
      border-radius: 50%;
    }
    .preview-body .c-i .picker input {
      width: 100px;
      height: 100px;
      margin: -11px;
    }
    .preview-body .c-i button,
    .preview-body .c-i button:focus,
    .preview-body .c-i button:hover {
      border-radius: 20px;
      background-image: linear-gradient(
        to right,
        #606ced,
        #5370ef,
        #4374f1,
        #3078f3,
        #0c7bf4
      );
      color: white;
      padding: 8px 20px;
      border: 0;
      font-size: 12px;
    }
    .sprite-preview.arrow-left {
      width: 21px;
      height: 23px;
    }
    
    .nav-dropdown {
      position: fixed;
      z-index: 99999;
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
      display: block;
      right: 0px;
      top: 46px;
      padding: 0;
      background: #fff;
    }
    .nav-dropdown li {
      min-width: 190px;
      border-bottom: 1px solid gainsboro;
      list-style: none;
    }
    .nav-dropdown li a {
      padding: 15px;
      line-height: 20px;
      padding-left: 25px;
      display: block;
      line-height: 15px;
      background: #ffffff;
      color: #463f3f;
      text-decoration: none;
      font-size: 16px;
    }
    .nav-dropdown li a i {
      margin-right: 5px;
      font-size: 15px;
    }
    .c-i img {
      position: absolute;
      width: 30px;
      top: 7px;
      left: 5px;
      transform: rotate(-56deg);
    }
    .border-full {
      padding: 0 !important;
    }
    .container-new {
      margin: auto !important;
    }

    table,
    table.border-full {
      border-collapse: collapse !important;
      table-layout: fixed !important;
      width: 100% !important;
    } 
            `
  }

  static invoiceHtmlTemplateCss(){
    return `
    .timesNewRoman{
      margin: 0;
      padding: 0;
      outline: none !important;
      font-family: "Times New Roman", Times, serif !important;
      color: #545454;
      color: #4f4f4f;
    }
    .arial{
      margin: 0;
      padding: 0;
      outline: none !important;
      font-family:  Arial, Helvetica, sans-serif !important;
      color: #545454;
      color: #4f4f4f;
    }
    .openSans{
      margin: 0;
      padding: 0;
      outline: none !important;
      font-family: 'Open Sans', sans-serif !important;
      color: #545454;
      color: #4f4f4f;
    }
    div{
      color: #000;
    }
    table tr th,
    table tr td {
      width: 12.5% !important;
      word-break: break-all;
      text-align: center;
      color: #000;
    }
    table tr th:nth-child(1),
    table tr td:nth-child(1) {
      width: 5% !important;
      text-align: left;
    }
    table tr th:nth-child(2),
    table tr td:nth-child(2) {
      width: 20% !important;
      word-break: break-word;
      text-align: left !important;
      overflow: initial !important;
      white-space: normal !important;
    }
    table tr th:last-child,
    table tr td:last-child {
      text-align: right;
    }
    .container-new {
      -webkit-print-color-adjust: exact;
    }

    
    @media only screen and (min-device-width: 768px) and (max-device-width: 1450px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 2) {
      .padding-252500 {
        padding: 3vw 3vw 0 !important;
      }
      .padding-002525 {
        padding: 0 3vw 3vw !important;
      }
      .padding-002525-new {
        padding: 0 3vw 0vw !important;
      }
      .padding-002510 {
        padding: 0 3vw 2vw !important;
      }
      .padding-000010{
        padding: 0 0 2vw !important;
      }
      .padding-0005{
        padding: 0 1vw !important;
      }
      .padding-20 {
        padding: 2.4vw !important;
      }
      .padding-16 {
        padding: 1.8vw !important;
      }
      .padding-002500 {
        padding: 0 3vw 0 !important;
      }
      .padding-102525 {
        padding: 2vw 3vw 3vw !important;
      }
      .padding-25 {
        padding: 2vw !important;
      }
      .padding-15 {
        padding: 1.3vw !important;
      }
      .padding-13 {
        padding: 1vw 1vw 1vw 0 !important;
      }
      .f-13 {
        font-size: 1.7vw !important;
      }
      .f-14{
        font-size: 1.8vw !important;
      }
      .f-16 {
        font-size: 2vw !important;
      }
      .f-18 {
        font-size: 2.2vw !important;
      }
      .f-22 {
        font-size: 2.6vw !important;
      }
      .f-24 {
        font-size: 2.8vw !important;
      }
      .f-20 {
        font-size: 2.4vw !important;
      }
      .mt-20 {
        margin-top: 3vw !important;
      }
      .padding-10101010 {
        padding: 1vw !important;
      }
      .border-full {
        border: 0.3vw solid #4f4f4f !important;
      }
      .b-w-l {
        border-left: 0.3vw solid #4f4f4f !important;
      }
      .b-w-r {
        border-right: 0.3vw solid #4f4f4f !important;
      }
      .b-w-b {
        border-bottom: 0.3vw solid #4f4f4f !important;
      }
      .b-w-t {
        border-top: 0.3vw solid #4f4f4f !important;
      }
      .o-c.border-full {
        border-color: #808080 !important;
      }
      .o-c .b-w-r {
        border-right: 0.3vw solid #808080 !important;
      }
      .o-c .b-w-l {
        border-left: 0.3vw solid #808080 !important;
      }
      .o-c .b-w-t {
        border-top: 0.3vw solid #808080 !important;
      }
      .o-c .b-w-b {
        border-bottom: 0.3vw solid #808080 !important;
      }
      .f-30 {
        font-size: 4.3vw !important;
      }
      .padding-0510 {
        padding: 0.3vw 1.2vw !important;
      }
      .padding-00150015{
        padding: 0 1.3vw 0 1.3vw !important;
      }
      .padding-00100000{
        padding: 0 1.3vw 0 0 !important;
      }
      .padding-0010{
        padding: 0 1.3vw !important;
      }
      .padding-1000{
        padding: 1.3vw 0 !important;
      }
      .padding-10 {
        padding: 0.6vw !important;
      }
      .padding-10101010 {
        padding: 1vw !important;
      }
      .border-full thead.border,
      .border-full thead {
        border-color: #000 !important;
      }
      .padding-1301 {
        padding: 3vw 1vw !important;
      }
      table {
        font-size: 2vw;
      }
      .container-new {
        width: calc(100% - 2vw) !important;
        margin: 1vw;
        padding-bottom: 7vw !important;
      }
      .timesNewRoman{
        margin: 0;
        padding: 0;
        outline: none !important;
        font-family: "Times New Roman", Times, serif !important;
        color: #545454;
        color: #4f4f4f;
      }
      .openSans{
        margin: 0;
        padding: 0;
        outline: none !important;
        font-family: 'Open Sans', sans-serif !important;
        color: #545454;
        color: #4f4f4f;
      }
      .arial{
        margin: 0;
        padding: 0;
        outline: none !important;
        font-family:  Arial, Helvetica, sans-serif !important;
        color: #545454;
        color: #4f4f4f;
      }
      .m-5 {
        margin-bottom: 0.6vw !important;
      }
      .padding-25.top {
        padding: 7vw 3vw 3vw !important;
      }
      
      thead.border {
        border-top: 0.25vw solid #4f4f4f !important;
      }
      .bb-a2 {
        border-bottom: 0.25vw solid #a24646 !important;
      }
    }
    /*
    table tbody tr:nth-child(even) td {
      background-color: #f5f5f5 !important;
      color-adjust: exact;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    */
    .header-invoice {
      display: flex;
      align-items: center;
      left: 0;
      padding: 12px;
      border-bottom: 1px solid #ebebeb;
      position: fixed;
      top: 0;
      z-index: 9999;
      background: white;
      width: 100%;
    }
    .preview-body {
      width: 100%;
      display: flow-root;
      margin-top: 50px;
      color-adjust: exact;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .header-invoice span {
      width: max-content;
      margin: 0 15px;
      font-size: 16px;
      color: #000;
    }
    .footer {
      position: fixed;
      bottom: 0;
      display: flex;
      align-items: center;
      left: 0;
      width: 100%;
      background: white;
      border-top: 1px solid #ebebeb;
      left: 0;
    }
    .footer a,
    .footer a:hover,
    .footer a:focus {
      background-image: linear-gradient(
        to right,
        #606ced,
        #5370ef,
        #4374f1,
        #3078f3,
        #0c7bf4
      );
      display: flex;
      color: white;
      padding: 1vw 6vw;
      font-size: 3.5vw;
      text-decoration: none;
    }
    .footer .sprite-preview {
      margin: auto;
    }
    .sprite-preview {
      background: url("/assets/icons/preview-sprite-10.png") no-repeat;
      width: 26px;
      height: 25px;
      background-position: 0 0;
      background-size: cover;
      margin: 0;
    }
    .sprite-preview.palette-selector {
      background-position: -37px 0;
      margin-left: auto;
    }
    .sprite-preview.edit-options {
      background-position: -73px 0;
      margin: 0 15px;
    }
    .sprite-preview.more-options {
      background-position: -86px 0;
      margin-right: 0;
      height: 20px;
    }
    .sprite-preview.whatsapp {
      background-position: -194px 0;
      width: 39px;
      height: 35px;
    }
    .sprite-preview.print {
      background-position: -212px 0;
      width: 35px;
      height: 30px;
    }
    .sprite-preview.download {
      background-position: -260px 0;
      width: 40px;
      height: 30px;
    }
    .item-scroll {
      display: flex;
      padding: 0;
      overflow: auto;
      margin: 10px 0;
    }
    .item-scroll::-webkit-scrollbar {
      display: none;
    }
    .item-scroll button {
      margin: 0 5px;
      padding: 5px 20px;
      background: #ffffff;
      border: 1px solid #ebebeb;
      border-radius: 100px;
      color: #9babc2;
      min-height: 33px;
      font-size: 13px;
      min-width: max-content;
    }
    .item-scroll button.active {
      color: #4285f4;
      background: #d2e2fb;
      border-color: #d2e2fb;
    }
    .preview-body .c-i {
      width: 100%;
      display: flex;
      border: 1px solid #ebebeb;
      background: #fbfbfb;
      padding: 5px;
      border-radius: 30px;
      position: relative;
      align-items: center;
      justify-content: space-between;
      margin: 5px 0 10px;
    }
    .preview-body .c-i span {
      margin-left: 10px;
      margin-right: auto;
      color: #000;
    }
    .preview-body .c-i .picker {
      width: 33px;
      height: 33px;
      overflow: hidden;
      border-radius: 50%;
    }
    .preview-body .c-i .picker input {
      width: 100px;
      height: 100px;
      margin: -11px;
    }
    .preview-body .c-i button,
    .preview-body .c-i button:focus,
    .preview-body .c-i button:hover {
      border-radius: 20px;
      background-image: linear-gradient(
        to right,
        #606ced,
        #5370ef,
        #4374f1,
        #3078f3,
        #0c7bf4
      );
      color: white;
      padding: 8px 20px;
      border: 0;
      font-size: 12px;
    }
    .sprite-preview.arrow-left {
      width: 21px;
      height: 23px;
    }
    
    .nav-dropdown {
      position: fixed;
      z-index: 99999;
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
      display: block;
      right: 0px;
      top: 46px;
      padding: 0;
      background: #fff;
    }
    .nav-dropdown li {
      min-width: 190px;
      border-bottom: 1px solid gainsboro;
      list-style: none;
    }
    .nav-dropdown li a {
      padding: 15px;
      line-height: 20px;
      padding-left: 25px;
      display: block;
      line-height: 15px;
      background: #ffffff;
      color: #463f3f;
      text-decoration: none;
      font-size: 16px;
    }
    .nav-dropdown li a i {
      margin-right: 5px;
      font-size: 15px;
    }
    .c-i img {
      position: absolute;
      width: 30px;
      top: 7px;
      left: 5px;
      transform: rotate(-56deg);
    }
    .border-full {
      padding: 0 !important;
    }
    .container-new {
      margin: auto !important;
    }
    
    table,
    table.border-full {
      border-collapse: collapse !important;
      table-layout: fixed !important;
      width: 100% !important;
    }
    
    `
  }

  }
