import { InvoicePrint } from "../models/print.model";
import { commonTempData } from "./commonTempData";

export class Temp23{

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
  

  

      .temp23-font-12-bold {
        font-size: 12px;
        font-weight: bold;
        line-height: 20px;
      }
    
      .temp23-font-12 {
        font-size: 12px;
        line-height: 20px;
      }
    
      .temp23-percent {
        font-size: 10px;
        line-height: 20px;
        color: rgba(0, 0, 0, 0.5);
      }
    
      .temp23-item-name {
        font-size: 12px;
        line-height: 20px;
        font-weight: 500;
      }
    
      .temp23-item-desc {
        font-size: 10px;
        line-height: 20px;
        color: rgba(0, 0, 0, 0.5);
      }
    
      .temp23-party-address-title {
        font-size: 14px;
        line-height: 20px;
        font-weight: 500;
      }
    
      .temp23-party-name {
        font-size: 13px;
        line-height: 15px;
        font-weight: bold;
      }
    
      .temp23-party-address {
        font-size: 12px;
        line-height: 14px;
      }
    
      .inv-detail {
        font-size: 12px;
        line-height: 20px;
        font-weight: 500;
      }
    
      .extra-detail {
        font-size: 12px;
        line-height: 20px;
      }
    
      .company-address,
      .gst-details,
      .temp23-party-address {
        font-size: 12px;
        font-weight: normal;
        line-height: 16px;
      }
    
      .logo {
        width: 100px;
        height: 100px;
      }
    
      .company-name {
        font-size: 16px;
        line-height: 20px;
        font-weight: 500;
      }
    
      .signature {
        height: 61px;
        width: 114px;
        margin-left: auto;
        margin-right: auto;
      }
    
      .signature img {
        width: 100%;
      }
      /*column-section*/
    
      .column-20 {
        width: 20%;
        display: table-cell;
        vertical-align: top;
      }
    
      .column-25 {
        width: 25%;
        display: table-cell;
        vertical-align: top;
      }
    
      .column-30 {
        width: 30%;
        display: table-cell;
        vertical-align: top;
      }
    
      .column-33 {
        width: 33.33%;
        display: table-cell;
        vertical-align: top;
      }
    
      .column-35 {
        width: 35%;
        display: table-cell;
        vertical-align: top;
      }
    
      .column-40 {
        width: 40%;
        display: table-cell;
        vertical-align: top;
      }
    
      .column-45 {
        width: 45%;
        display: table-cell;
        vertical-align: top;
      }
    
      .column-50 {
        width: 50%;
        display: table-cell;
        vertical-align: top;
      }
    
      .column-55 {
        width: 55%;
        display: table-cell;
        vertical-align: top;
      }
    
      .column-60 {
        width: 60%;
        display: table-cell;
        vertical-align: top;
      }
    
      .column-70 {
        width: 70%;
        display: table-cell;
        vertical-align: top;
      }
    
      .column-75 {
        width: 75%;
        display: table-cell;
        vertical-align: top;
      }
    
      .column-80 {
        width: 80%;
        display: table-cell;
        vertical-align: top;
      }
    
      .column-90 {
        width: 80%;
        display: table-cell;
        vertical-align: top;
      }
    
      .column-100 {
        width: 100%;
        display: table-cell;
        vertical-align: top;
      }
    
      .container {
        display: table;
        border-collapse: collapse;
        width: 100%;
      }
    
      /*table display css*/
    
      .table {
        display: table;
      }
    
      .row {
        display: table-row;
      }
    
      .table-cell {
        display: table-cell;
      }
    
      .table-header {
        display: table-cell;
        height: 49px;
        vertical-align: middle;
        padding-left: 5px;
        padding-right: 5px;
        text-align: center;
        font-size: 14px;
        line-height: 20px;
        font-weight: 500;
      }
    
      .table-row-cell,
      .table-amt-cell {
        display: table-cell;
        height: 49px;
        padding-left: 5px;
        padding-right: 5px;
        font-size: 12px;
        line-height: 20px;
        text-align: right;
      }
    
      .multi-row-header {
        display: table-cell;
        height: 49px;
        vertical-align: middle;
        text-align: center;
        font-size: 14px;
        line-height: 20px;
        font-weight: 500;
      }
    
      .multi-row-cell {
        display: table-cell;
        height: 49px;
        vertical-align: middle;
        font-size: 12px;
        line-height: 20px;
        text-align: right;
      }
    
      .hsn .multi-row-cell {
        vertical-align: middle;
      }
    
      .hsn .table-row-cell {
        vertical-align: middle;
      }
    
      .table-amt-cell {
        height: 30px;
      }
    
      .table-header:not(:last-child) {
        border-right: 1px solid black;
      }
    
      .table-row-cell:not(:last-child) {
        border-right: 1px solid black;
      }
    
      .table-amt-cell:not(:last-child) {
        border-right: 1px solid black;
      }
    
      /*padding section*/
      .padding-top-5 {
        padding-top: 5px;
      }
    
      .padding-right-5 {
        padding-right: 5px;
      }
    
      .padding-5-exclude-bt {
        padding-top: 5px;
        padding-left: 5px;
        padding-right: 5px;
      }
    
      .padding-5-exclude-tp {
        padding-bottom: 5px;
        padding-left: 5px;
        padding-right: 5px;
      }
    
      .padding-5 {
        padding: 5px;
      }
    
      .padding-bottom-10 {
        padding-bottom: 10px;
      }
    
      .padding-left-10 {
        padding-left: 10px;
      }
    
      .padding-top-10 {
        padding-top: 10px;
      }
    
      .padding-10 {
        padding: 10px;
      }
    
      /*border-section*/
      .border-top-1 {
        border-top: 1px solid black;
      }
    
      .border-bottom-1 {
        border-bottom: 1px solid black;
      }
    
      .border-left-1 {
        border-left: 1px solid black;
      }
    
      .border-right-1 {
        border-right: 1px solid black;
      }
    
      .border-1 {
        border: 1px solid black;
      }
    
      .border-exclude-top {
        border-right: 1px solid black;
        border-bottom: 1px solid black;
        border-left: 1px solid black;
      }
    
      /*height section*/
    
      .ht-24 {
        height: 24px;
      }
    
      .ht-25 {
        height: 25px;
      }
    
      .ht-49 {
        height: 49px;
      }
    
      .ht-81 {
        height: 81px;
      }
    
      /*widths % section*/
      .width-10 {
        width: 10%;
      }
    
      .width-20 {
        width: 20%;
      }
    
      .width-25 {
        width: 25%;
      }
    
      .width-33 {
        width: 33.33%;
      }
    
      .width-40 {
        width: 40%;
      }
    
      .width-45 {
        width: 45%;
      }
    
      .width-50 {
        width: 50%;
      }
    
      .width-55 {
        width: 55%;
      }
    
      .width-75 {
        width: 75%;
      }
    
      .width-80 {
        width: 80%;
      }
    
      .width-100 {
        width: 100%;
      }
    
      /*width px section*/
      .wdt-30 {
        width: 30px;
      }
    
      .wdt-59 {
        width: 59px;
      }
    
      .wdt-71 {
        width: 71px;
      }
    
      .wdt-78 {
        width: 78px;
      }
    
      .wdt-79 {
        width: 79px;
      }
    
      .wdt-80 {
        width: 80px;
      }
    
      .wdt-86 {
        width: 86px;
      }
    
      .wdt-91 {
        width: 91px;
      }
    
      .wdt-180 {
        width: 180px;
      }
    
      .wdt-103 {
        width: 103px;
      }
    
      .wdt-153 {
        width: 153px;
      }
    
      .wdt-195 {
        width: 195px;
      }
    
      /*utils*/
    
      .text-center {
        text-align: center;
      }
    
      .text-left {
        text-align: left;
      }
    
      .text-right {
        text-align: right;
      }
    
      .vertical-middle {
        vertical-align: middle;
      }
    
      .bold {
        font-weight: bold;
      }
    
      .italic {
        font-style: italic;
      }
    
      /*theme-colors*/
    
      .grey {
        color: #000000;
      }
    
      .grey-bg {
        background: #e2e2e2;
      }
    
      .green {
        color: #407400;
      }
    
      .green-bg {
        background: #dff0ca;
      }
    
      .blue {
        color: #0b6a9f;
      }
    
      .blue-bg {
        background: #cfeaf9;
      }
    
      .violet {
        color: #840bb2;
      }
    
      .violet-bg {
        background: #e9ccf4;
      }
    
      .pink {
        color: #c11111;
      }
    
      .pink-bg {
        background: #f4cccc;
      }
    
      .rich-blue {
        color: #5b57ae;
      }
    
      .rich-blue-bg {
        background: #dbdaf3;
      }
    
      .gold {
        color: #cd9d23;
      }
    
      .gold-bg {
        background: #f1e7cf;
      }
    
      .orange {
        color: #bf6200;
      }
    
      .orange-bg {
        background: #f9e5cf;
      }
    
      /*margins section*/
    
      .margin-top-5 {
        margin-top: 5px;
      }
    
      .margin-auto {
        margin-left: auto;
        margin-right: auto;
      }
    
      .margin-left-50 {
        margin-left: 60%;
      }
    
      .margin-left-60 {
        margin-left: 60%;
      }
    
      .margin-left-70 {
        margin-left: 70%;
      }
    
      .margin-left-90 {
        margin-left: 90%;
      }
      .main-container{
        padding:5mm;
      }
    </style>

      <div class="main-container print-page-a4">
      <div class="container">
        <div class="row">
          <div class="column-50 bold">TAX INVOICE</div>
          <div class="column-50 text-right">Business Karne Ka Naya Tareeka</div>
        </div>
      </div>
      <div class="container">
        <div class="row border-1">
          <div class="column-50 border-right-1 padding-10">
            <div class="column-20">
              <img class="logo" src="https://img.ezobanks.com/ad54d0e5b3aac207c743df598a8e9d77-1622654484241.jpg">
            </div>
            <div class="column-80 padding-left-10 vertical-middle">
              <div class="company-name padding-bottom-10 text_color grey">
                 My BillBook
              </div>
              <div class="company-address">
                #56, 2nd Floor, 12th Main Road, Sector 6, HSR Layout Land Mark:,
                next to Rasaganga Veg Restaurant, HSR BDA, Bengaluru, Karnataka
                560102
              </div>
              <div class="company-address font-10">Karnataka</div>
              <div class="table width-100 gst-details">
                <div class="row">
                  <div class="table-cell width-50">
                    GSTIN: 29AAGDV9438F1ZR
                  </div>
                  <div class="table-cell width-50">
                    Mobile: 9930261379
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="column-50 vertical-middle">
            <div class="table width-100 inv-detail">
              <div class="column-33 text-center">
                <div>Invoice Number</div>
                <div>157</div>
              </div>
              <div class="column-33 text-center">
                <div>Invoice Date</div>
                <div>10-06-2020</div>
              </div>
              <div class="column-33 text-center">
                <div>Due Date</div>
                <div>10-07-2020</div>
              </div>
            </div>
            <div class="table width-100 extra-detail border-top-1">
              <div class="column-33 text-center padding-top-10">
                <div>PO Bill No</div>
                <div>1234565</div>
              </div>
              <div class="column-33 text-center padding-top-10">
                <div>E-way Bill No</div>
                <div>E123455</div>
              </div>
              <div class="column-33 text-center padding-top-10">
                <div>Vehicle No</div>
                <div>KA-00-9H-6573</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container border-exclude-top ">
        <div class="row">
          <div class="column-50 border-right-1 padding-10">
            <div class="table width-100">
              <div class="row temp23-party-address-title">BILL TO</div>
              <div class="row">
                <div class="temp23-party-name padding-top-5">Rakesh Enterprises</div>
              </div>
              <div class="row width-100">
                <div class="table temp23-party-address width-100">
                  <div class="row">
                    <div class="column-20 padding-top-5">Address</div>
                    <div class="column-80 padding-top-5">
                      2nd Floor, 12th Main Road, Sector 6,Mysore, Karnataka,
                      570001
                    </div>
                  </div>
                </div>
              </div>
              <div class="row temp23-party-address">
                <div class="table width-100">
                  <div class="row">
                    <div class="column-20 padding-top-3">Place of supply:</div>
                    <div class="column-80 padding-top-3">Karnataka</div>
                  </div>
                </div>
              </div>
              <div class="row temp23-party-address">
                <div class="table width-100">
                  <div class="row"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="column-50 padding-10">
            <div class="table width-100">
              <div class="row temp23-party-address-title">SHIP TO</div>
              <div class="row">
                <div class="temp23-party-name padding-top-5">Rakesh Enterprises</div>
              </div>
              <div class="row width-100">
                <div class="table temp23-party-address width-100">
                  <div class="row">
                    <div class="column-20 padding-top-5">Address</div>
                    <div class="column-80 padding-top-5">
                      2nd Floor, 12th Main Road, Sector 6,Mysore, Karnataka,
                      570001
                    </div>
                  </div>
                </div>
              </div>
              <div class="row temp23-party-address">
                <div class="table width-100">
                  <div class="row">
                    <div class="column-20">Mobile</div>
                    <div class="column-80"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container border-exclude-top">
        <div class="row border-bottom-1 bg_color grey-bg">
          <div class="wdt-30 table-header">S.NO</div>
          <div class="wdt-180 table-header">ITEMS</div>
          <div class="wdt-59 table-header">HSN</div>
          <div class="wdt-80 table-header">QUANTITY</div>
          <div class="wdt-71 table-header">MRP</div>
          <div class="wdt-86 table-header">RATE/ITEM</div>
          <div class="wdt-78 table-header">DISCOUNT</div>
          <div class="wdt-79 table-header">TAX</div>
          <div class="wdt-91 table-header">AAMOUNT</div>
        </div>
        <div class="row">
          <!-- items section -->
          <div class="wdt-30 table-row-cell text-center">1</div>
          <div class="wdt-180 table-row-cell text-left">
            <div class="temp23-item-name">Samsung A30</div>
            <div class="temp23-item-desc">
              Imei - 7654rtt11231
            </div>
          </div>
          <div class="wdt-59 table-row-cell">1234</div>
          <div class="wdt-80 table-row-cell">1.0 PCS</div>
          <div class="wdt-71 table-row-cell">
            10000.0
          </div>
          <div class="wdt-86 table-row-cell">
            10000.0
          </div>
          <div class="wdt-78 table-row-cell">
            <div class="amount">200.0</div>
            <div class="temp23-percent">10 %</div>
          </div>
          <div class="wdt-79 table-row-cell">
            <div class="amount">490.0</div>
            <div class="temp23-percent">5.0 %</div>
          </div>
          <div class="wdt-91 table-row-cell">10290.0</div>
        </div>
        <div class="row">
          <!-- items section -->
          <div class="wdt-30 table-row-cell text-center">2</div>
          <div class="wdt-180 table-row-cell text-left">
            <div class="temp23-item-name">Samsung A50</div>
            <div class="temp23-item-desc">
              Imei - 9654rtt11341
            </div>
          </div>
          <div class="wdt-59 table-row-cell">1235</div>
          <div class="wdt-80 table-row-cell">1.0 PCS</div>
          <div class="wdt-71 table-row-cell">
            20000.0
          </div>
          <div class="wdt-86 table-row-cell">
            20000.0
          </div>
          <div class="wdt-78 table-row-cell">
            <div class="amount">400.0</div>
            <div class="temp23-percent">10 %</div>
          </div>
          <div class="wdt-79 table-row-cell">
            <div class="amount">980.0</div>
            <div class="temp23-percent">5.0 %</div>
          </div>
          <div class="wdt-91 table-row-cell">20580.0</div>
        </div>
        <div class="row">
          <!-- items section -->
          <div class="wdt-30 table-row-cell text-center">3</div>
          <div class="wdt-180 table-row-cell text-left">
            <div class="temp23-item-name">Samsung S10</div>
            <div class="temp23-item-desc">
              Imei - 6654r6t11381
            </div>
          </div>
          <div class="wdt-59 table-row-cell">1236</div>
          <div class="wdt-80 table-row-cell">1.0 PCS</div>
          <div class="wdt-71 table-row-cell">
            52000.0
          </div>
          <div class="wdt-86 table-row-cell">
            52000.0
          </div>
          <div class="wdt-78 table-row-cell">
            <div class="amount">0.0</div>
            <div class="temp23-percent">10 %</div>
          </div>
          <div class="wdt-79 table-row-cell">
            <div class="amount">2600.0</div>
            <div class="temp23-percent">5.0 %</div>
          </div>
          <div class="wdt-91 table-row-cell">54600.0</div>
        </div>
        <div class="row">
          <!-- items section -->
          <div class="wdt-30 table-row-cell text-center">4</div>
          <div class="wdt-180 table-row-cell text-left">
            <div class="temp23-item-name">Iphone XR</div>
            <div class="temp23-item-desc">
              Imei - 3654r6t11381
            </div>
          </div>
          <div class="wdt-59 table-row-cell">1237</div>
          <div class="wdt-80 table-row-cell">1.0 PCS</div>
          <div class="wdt-71 table-row-cell">
            56000.0
          </div>
          <div class="wdt-86 table-row-cell">
            56000.0
          </div>
          <div class="wdt-78 table-row-cell">
            <div class="amount">0.0</div>
            <div class="temp23-percent">10 %</div>
          </div>
          <div class="wdt-79 table-row-cell">
            <div class="amount">2800.0</div>
            <div class="temp23-percent">5.0 %</div>
          </div>
          <div class="wdt-91 table-row-cell">58800.0</div>
        </div>
        <!-- empty rows section -->
        <div class="row ht-49">
          <div class="wdt-30 table-row-cell text-center"></div>
          <div class="wdt-180 table-row-cell text-left"></div>
          <div class="wdt-59 table-row-cell"></div>
          <div class="wdt-80 table-row-cell"></div>
          <div class="wdt-71 table-row-cell"></div>
          <div class="wdt-86 table-row-cell"></div>
          <div class="wdt-78 table-row-cell"></div>
          <div class="wdt-79 table-row-cell"></div>
          <div class="wdt-91 table-row-cell"></div>
        </div>
        <div class="row ht-49">
          <div class="wdt-30 table-row-cell text-center"></div>
          <div class="wdt-180 table-row-cell text-left"></div>
          <div class="wdt-59 table-row-cell"></div>
          <div class="wdt-80 table-row-cell"></div>
          <div class="wdt-71 table-row-cell"></div>
          <div class="wdt-86 table-row-cell"></div>
          <div class="wdt-78 table-row-cell"></div>
          <div class="wdt-79 table-row-cell"></div>
          <div class="wdt-91 table-row-cell"></div>
        </div>
        <div class="row ht-49">
          <div class="wdt-30 table-row-cell text-center"></div>
          <div class="wdt-180 table-row-cell text-left"></div>
          <div class="wdt-59 table-row-cell"></div>
          <div class="wdt-80 table-row-cell"></div>
          <div class="wdt-71 table-row-cell"></div>
          <div class="wdt-86 table-row-cell"></div>
          <div class="wdt-78 table-row-cell"></div>
          <div class="wdt-79 table-row-cell"></div>
          <div class="wdt-91 table-row-cell"></div>
        </div>
        <div class="row ht-49">
          <div class="wdt-30 table-row-cell text-center"></div>
          <div class="wdt-180 table-row-cell text-left"></div>
          <div class="wdt-59 table-row-cell"></div>
          <div class="wdt-80 table-row-cell"></div>
          <div class="wdt-71 table-row-cell"></div>
          <div class="wdt-86 table-row-cell"></div>
          <div class="wdt-78 table-row-cell"></div>
          <div class="wdt-79 table-row-cell"></div>
          <div class="wdt-91 table-row-cell"></div>
        </div>
        <!-- extra chages section -->
        <div class="row">
          <div class="wdt-30 table-row-cell text-center"></div>
          <div class="wdt-180 table-row-cell text-right bold padding-right-10 italic">
            Shipping Charge
          </div>
          <div class="wdt-59 table-row-cell text-center">-</div>
          <div class="wdt-80 table-row-cell text-center">-</div>
          <div class="wdt-71 table-row-cell text-center">-</div>
          <div class="wdt-86 table-row-cell text-center">-</div>
          <div class="wdt-78 table-row-cell text-center">-</div>
          <div class="wdt-79 table-row-cell text-center">-</div>
          <div class="wdt-91 table-row-cell">250.0</div>
        </div>
        <div class="row">
          <div class="wdt-30 table-row-cell text-center"></div>
          <div class="wdt-180 table-row-cell text-right bold padding-right-10 italic">
            Discount
          </div>
          <div class="wdt-59 table-row-cell text-center">-</div>
          <div class="wdt-80 table-row-cell text-center">-</div>
          <div class="wdt-71 table-row-cell text-center">-</div>
          <div class="wdt-86 table-row-cell text-center">-</div>
          <div class="wdt-78 table-row-cell text-center">-</div>
          <div class="wdt-79 table-row-cell text-center">-</div>
          <div class="wdt-91 table-row-cell">248.91</div>
        </div>
        <!-- amounts section -->
        <div class="row border-top-1 bg_color grey-bg">
          <div class="wdt-30 table-amt-cell text-center"></div>
          <div class="wdt-180 table-amt-cell text-left temp23-item-name vertical-middle">
            TOTAL AMOUNT
          </div>
          <div class="wdt-59 table-row-cell text-center">-</div>
          <div class="wdt-80 table-amt-cell text-center vertical-middle">
            4.0
          </div>
          <div class="wdt-71 table-amt-cell text-center">-</div>
          <div class="wdt-86 table-amt-cell text-center">-</div>
          <div class="wdt-78 table-amt-cell text-center">-</div>
          <div class="wdt-79 table-amt-cell text-center vertical-middle">
            6870.0
          </div>
          <div class="wdt-91 table-amt-cell bold">144271.09</div>
        </div>

        <div class="row border-top-1">
          <div class="wdt-30 table-amt-cell text-center"></div>
          <div class="wdt-180 table-amt-cell text-left temp23-item-name vertical-middle">
            RECEIVED AMOUNT
          </div>
          <div class="wdt-59 table-row-cell text-center">-</div>
          <div class="wdt-80 table-amt-cell text-center">-</div>
          <div class="wdt-71 table-amt-cell text-center">-</div>
          <div class="wdt-86 table-amt-cell text-center">-</div>
          <div class="wdt-78 table-amt-cell text-center">-</div>
          <div class="wdt-79 table-row-cell text-center">-</div>
          <div class="wdt-91 table-amt-cell bold vertical-middle">2500.0</div>
        </div>
        <div class="row border-top-1">
          <div class="wdt-30 table-amt-cell text-center"></div>
          <div class="wdt-180 table-amt-cell text-left temp23-item-name vertical-middle">
            BALANCE AMOUNT
          </div>
          <div class="wdt-59 table-row-cell text-center">-</div>
          <div class="wdt-80 table-amt-cell text-center">-</div>
          <div class="wdt-71 table-amt-cell text-center">-</div>
          <div class="wdt-86 table-amt-cell text-center">-</div>
          <div class="wdt-78 table-amt-cell text-center">-</div>
          <div class="wdt-79 table-row-cell text-center">-</div>
          <div class="wdt-91 table-amt-cell bold vertical-middle">
            141771.09
          </div>
        </div>
      </div>
      <div class="container border-1 margin-top-5 hsn">
        <div class="row border-bottom-1 bg_color grey-bg">
          <div class="wdt-103 table-header">HSN/SAC</div>
          <div class="wdt-153 table-header">TAXABLE VALUE</div>
          <div class="wdt-195 multi-row-header border-right-1">
            <div class="ht-24 border-bottom-1 vertical-middle">SGST</div>
            <div class="table width-100 ht-25">
              <div class="row">
                <div class="column-30 border-right-1 vertical-middle">RATE</div>
                <div class="column-70 vertical-middle">AMOUNT</div>
              </div>
            </div>
          </div>
          <div class="wdt-195 multi-row-header border-right-1">
            <div class="ht-24 border-bottom-1 vertical-middle">CGST</div>
            <div class="table width-100 ht-25">
              <div class="row">
                <div class="column-30 border-right-1 vertical-middle">RATE</div>
                <div class="column-70 vertical-middle">AMOUNT</div>
              </div>
            </div>
          </div>
          <div class="wdt-195 table-header">TOTAL TAX</div>
        </div>
        <div class="row">
          <div class="wdt-103 table-row-cell">1234</div>
          <div class="wdt-153 table-row-cell">9800.0</div>
          <div class="wdt-195 multi-row-cell border-right-1">
            <div class="table width-100 ht-49">
              <div class="row">
                <div class="column-30 border-right-1 vertical-middle padding-right-5">
                  2.5 %
                </div>
                <div class="column-70 vertical-middle padding-right-5">
                  245.0
                </div>
              </div>
            </div>
          </div>
          <div class="wdt-195 multi-row-cell border-right-1">
            <div class="table width-100 ht-49">
              <div class="row">
                <div class="column-30 border-right-1 vertical-middle padding-right-5">
                  2.5 %
                </div>
                <div class="column-70 vertical-middle padding-right-5">
                  245.0
                </div>
              </div>
            </div>
          </div>
          <div class="wdt-153 table-row-cell">490.0</div>
        </div>
        <div class="row">
          <div class="wdt-103 table-row-cell">1235</div>
          <div class="wdt-153 table-row-cell">19600.0</div>
          <div class="wdt-195 multi-row-cell border-right-1">
            <div class="table width-100 ht-49">
              <div class="row">
                <div class="column-30 border-right-1 vertical-middle padding-right-5">
                  2.5 %
                </div>
                <div class="column-70 vertical-middle padding-right-5">
                  490.0
                </div>
              </div>
            </div>
          </div>
          <div class="wdt-195 multi-row-cell border-right-1">
            <div class="table width-100 ht-49">
              <div class="row">
                <div class="column-30 border-right-1 vertical-middle padding-right-5">
                  2.5 %
                </div>
                <div class="column-70 vertical-middle padding-right-5">
                  490.0
                </div>
              </div>
            </div>
          </div>
          <div class="wdt-153 table-row-cell">980.0</div>
        </div>
        <div class="row">
          <div class="wdt-103 table-row-cell">1236</div>
          <div class="wdt-153 table-row-cell">52000.0</div>
          <div class="wdt-195 multi-row-cell border-right-1">
            <div class="table width-100 ht-49">
              <div class="row">
                <div class="column-30 border-right-1 vertical-middle padding-right-5">
                  2.5 %
                </div>
                <div class="column-70 vertical-middle padding-right-5">
                  1300.0
                </div>
              </div>
            </div>
          </div>
          <div class="wdt-195 multi-row-cell border-right-1">
            <div class="table width-100 ht-49">
              <div class="row">
                <div class="column-30 border-right-1 vertical-middle padding-right-5">
                  2.5 %
                </div>
                <div class="column-70 vertical-middle padding-right-5">
                  1300.0
                </div>
              </div>
            </div>
          </div>
          <div class="wdt-153 table-row-cell">2600.0</div>
        </div>
        <div class="row">
          <div class="wdt-103 table-row-cell">1237</div>
          <div class="wdt-153 table-row-cell">56000.0</div>
          <div class="wdt-195 multi-row-cell border-right-1">
            <div class="table width-100 ht-49">
              <div class="row">
                <div class="column-30 border-right-1 vertical-middle padding-right-5">
                  2.5 %
                </div>
                <div class="column-70 vertical-middle padding-right-5">
                  1400.0
                </div>
              </div>
            </div>
          </div>
          <div class="wdt-195 multi-row-cell border-right-1">
            <div class="table width-100 ht-49">
              <div class="row">
                <div class="column-30 border-right-1 vertical-middle padding-right-5">
                  2.5 %
                </div>
                <div class="column-70 vertical-middle padding-right-5">
                  1400.0
                </div>
              </div>
            </div>
          </div>
          <div class="wdt-153 table-row-cell">2800.0</div>
        </div>
      </div>
      <div class="container border-1 margin-top-5">
        <div class="row width-100">
          <div class="column-100 bold">
            <div class="padding-5-exclude-bt temp23-font-12-bold">
              Invoice Amount in Words
            </div>
          </div>
        </div>
        <div class="row">
          <div class="column-100">
            <div class="padding-5-exclude-tp font-12">
              One Lakh Forty Four Thousand Two Hundred Seventy One Rupees And
              Nine Paise
            </div>
          </div>
        </div>
      </div>
      <div class="container border-exclude-top">
        <div class="row">
          <div class="column-40 padding-5 border-right-1 ht-81">
            <div class="temp23-font-12-bold">BANK DETAILS</div>
            <div class="table width-100 font-12">
              <div class="row">
                <div class="column-40">Account Number:</div>
                <div class="column-60">123455667788990</div>
              </div>
              <div class="row">
                <div class="column-40">IFSC code:</div>
                <div class="column-60">SBIN0000811</div>
              </div>
              <div class="row">
                <div class="column-40">Bank &amp; Branch:</div>
                <div class="column-60">State Bank of India, AVANIGADDA</div>
              </div>
            </div>
          </div>
          <div class="column-25 padding-5">
            <div class="table width-100 font-12">
              <div class="row">
                <div class="column-55">
                  <div class="bold">Scan QR code with UPI app to pay</div>
                  <div>UPI Id</div>
                  <div>pmcares@sbi</div>
                </div>
                <div class="column-45 padding-left-10">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container border-exclude-top">
        <div class="row">
          <div class="column-75 border-right-1 padding-5">
            <div class="temp23-font-12-bold">Terms and Conditions</div>
            <div class="font-12">
              10 days return policy. Damaged items won't be taken back Bill
              is compulsory for returning items
            </div>
          </div>
          <div class="column-25 padding-5">
            <div class="signature ">
              <img src="https://assets.ezobanks.com/temp/signature.png">
            </div>
            <div class="temp23-font-12  text-center ">Authorised Signature</div>
          </div>
        </div>
      </div>
    </div>
      `
    }



}

