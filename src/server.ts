import express from "express";
import * as expressHbs from "express-handlebars";
import path from "path";
import { Request, Response } from "express";
import {HtmlTemplates} from "../src/index";
import * as billObjects from "./utils/mockData.json";

const app = express();

const hbs = expressHbs.create({
	helpers: {},
	defaultLayout: "layout",
	partialsDir: ["src/views/partials"],
	extname: ".hbs",
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

const viewsDir = path.join(__dirname, "views");
app.set("views", viewsDir);
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));
app.get('/',async (req:Request,res:Response)=>{
	let obj:any ={
		"localId": "nypnj6mRngMkdiiQ36AZ",
		"parentId": null,
		"profileId": 1,
		"invoiceNo": "INV_042",
		"partyIdLocal": "V2Z8ZaSAb27yt5fBDXg1",
		"invoiceDateStamp": 1624492800000,
		"dueDateStamp": 0,
		"isRecurring": false,
		"recurringDays": null,
		"purOrderNo": null,
		"poId": 0,
		"trmAndCnd": false,
		"description": null,
		"itemAmount": 0,
		"additionalAmount": 0,
		"discountAmount": 0,
		"tdsAmount": 0,
		"tdsPercentage": null,
		"gstAmount": 0,
		"cessAmount": 0,
		"totalAmount": 1000,
		"paidStamp": null,
		"cancelStamp": null,
		"createdStamp": 1624522772160,
		"gstEnabled": false,
		"template": "temp6",
		"transDistance": "",
		"color": "#3498db",
		"url": null,
		"invoiceReadStamp": null,
		"openCount": null,
		"additinalAttr": null,
		"acceptStamp": null,
		"acceptSignature": null,
		"device": null,
		"creditPeriodInDay": null,
		"updatedStamp": null,
		"estId": null,
		"receivedPayment": null,
		"moneyinId": null,
		"tnc": "Thank you for doing business with us, Visit Again!",
		"seenStamp": 0,
		"flatDiscount": 0,
		"moneyIn": {
			"txnMode": "cash",
			"invoiceIdLocal": "nypnj6mRngMkdiiQ36AZ",
			"dateStamp": 1624522772137,
			"receiptNo": "Rec_023",
			"amount": 1000,
			"partyIdLocal": "V2Z8ZaSAb27yt5fBDXg1"
		},
		"moneyinIdLocal": "FNXMmukCFlnpMbaoB8xv",
		"roundOffValue": 0,
		"invoiceItems": [
			{
				"item": {
					"uid": 293514,
					"spIncTax": 1,
					"primaryUnit": "PCS",
					"createdStamp": 1624515559559,
					"mrp": 200,
					"itemName": "Second Unit",
					"localId": "W1PCOC5oXaTTn8vn5zEl",
					"isTaxExempted": 0,
					"additionalDateFieldTitle": "add Date field name",
					"additionalInputFieldTitle": "add input field name",
					"sellPrice": 100,
					"profileId": 296294,
					"state": "added",
					"isTaxZero": 0,
					"convertRatioR": 10,
					"onlineDukanItem": 1,
					"secondaryUnit": "BOX",
					"convertRatio": 0.1,
					"variants": {
						"color": [],
						"size": []
					},
					"type": "product",
					"purchasePrice": 80
				},
				"itemName": "Second Unit",
				"spIncTax": 1,
				"purchasePrice": 80,
				"index": 1,
				"additionalDateFieldValue": 0,
				"sellPrice": 1000,
				"totalAmount": 1000,
				"totalTax": 0,
				"totalDiscount": 0,
				"quantity": 1,
				"discountPercent": 0,
				"totalCess": 0,
				"discountFlat": 0,
				"isTaxExempted": 0,
				"itemIdLocal": "W1PCOC5oXaTTn8vn5zEl",
				"isTaxZero": 0,
				"unit": "BOX",
				"additionalInputFieldTitle": "add input field name",
				"ppIncTax": 0,
				"additionalDateFieldTitle": "add Date field name",
				"convertRatio": 0.1,
				"mrp": 2000,
				"itemDes": ""
			}
		],
		"shareHashUrl": "",
		"user": {
			"moneyOutTimeSpan": null,
			"orderReportHashUrl": "https://ezobanks.com:5001/api/reports/orderReport/296294/1186178400",
			"pin": false,
			"id": 1,
			"saleWisePnlHashUrl": "https://ezobanks.com:5001/api/reports/saleWisePnl/296294/1186178400",
			"saleReportHashUrl": "https://ezobanks.com:5001/api/reports/saleReport/296294/1186178400",
			"dayBookHashUrl": "https://ezobanks.com:5001/api/reports/dayBook/296294/1186178400",
			"profileDataId": 647984,
			"cashFlowReportHashUrl": "https://ezobanks.com:5001/api/reports/cashFlowReport/296294/1186178400",
			"summaryTimeSpan": null,
			"device": {
				"uid": 293514,
				"activeStamp": 1624286995820,
				"deviceName": "Laptop/Desktop Chrome Linux ",
				"updateStamp": 0,
				"createdStamp": 1624286995820,
				"inactiveStamp": 0,
				"id": 101942
			},
			"moneyInTimeSpan": null,
			"optionalAttr": null,
			"createdStamp": 1624107626290,
			"deletedStamp": null,
			"user": {
				"uid": 293514,
				"phone": "5234567890",
				"verified": 1624107626241,
				"blocked": 0,
				"lastActive": 0,
				"partyProcessedStamp": 0,
				"isActive": true,
				"waStamp": 0,
				"registrationStamp": 1624107621002
			},
			"purchaseReportHashUrl": "https://ezobanks.com:5001/api/reports/purchaseReport/296294/1186178400",
			"state": "modified",
			"uid": 293514,
			"profileData": {
				"listFilters": {
					"invoices": "last30Days",
					"purchases": "last30Days"
				},
				"isGstEnabled": false,
				"contactPersonPhone": "5234567891",
				"pdfViewFooter": 1,
				"wholeSalerRate": 1,
				"odEnableCod": 1,
				"reduceQty": 0,
				"profileName": "Bill Book Non GST",
				"createdStamp": 1624107626251,
				"additionalItemFormFields": {
					"dateFieldTitle": "add Date field name",
					"inputFieldTitle": "add input field name"
				},
				"termsCondition": "Thank you for doing business with us, Visit Again!",
				"monthlyAlertDate": 0,
				"isPrimary": false,
				"id": 647984,
				"tags": {
					"expense": [],
					"itemUnit": [],
					"parties": [],
					"items": [
						"All"
					]
				},
				"additionalData": {
					"isItemvariant": 0,
					"isBulkUnit": 1,
					"enableAddNewItemBtn": 1,
					"isCessTax": 0,
					"lastBillRate": 1,
					"showSignatureInTemplates": 1,
					"itemBeepSound": 1,
					"defaultCashInvoice": 0,
					"showSignatureNotRequiredText": 1,
					"smsToBusinessOwner": 1,
					"autoFillAmtReceived": 1,
					"invoiceSmsToUser": 1,
					"makeItemNameBold": 1
				},
				"zeroInventoryItem": 1,
				"legalName": "Apple Store",
				"updatedStamp": 1624286499577,
				"creditLimit": 0,
				"odEnableUpi": 1,
				"accountType": "current"
			},
			"expenseTimeSpan": null,
			"itemSaleReportHashUrl": "https://ezobanks.com:5001/api/reports/itemSaleReport/296294/1186178400",
			"invoiceTimeSpan": null,
			"purchaseTimeSpan": null,
			"onlineDukanData": {
				"domain": "hkjhjk",
				"deliveryCharges": {
					"isChargesApplicable": 0
				}
			},
			"source": "server",
			"accessControl": {},
			"isActive": true,
			"totalSaleReportHashUrl": "https://ezobanks.com:5001/api/reports/stockValueReport/296294/1186178400",
			"fcmToken": null,
			"profileId": 296294,
			"updatedStamp": 1624523395795,
			"itemOrderReportHashUrl": "https://ezobanks.com:5001/api/reports/itemOrderReport/296294/1186178400"
		},
		"partyInfo": {
			"state": "",
			"paymentReminderDateStamp": 1624300200000,
			"profileId": 296294,
			"credit": 180854,
			"updatedStamp": 1624522773550,
			"createdStamp": 1624107627715,
			"searchIndex": "demo customer 2  5234567890",
			"profileData": {
				"contactPersonName": "Demo Customer 2",
				"gstNumber": "01DEMOA1234Z1ZI",
				"addressLine1": "Customer Address Line 1, Address Line 2, Address Line 3",
				"contactPersonPhone": "5234567890",
				"addressState": "Maharashtra"
			},
			"uid": 293514,
			"localId": "V2Z8ZaSAb27yt5fBDXg1",
			"id": -2
		},
		"moneyInInfo": {
			"invoiceIdLocal": "nypnj6mRngMkdiiQ36AZ",
			"profileId": 296294,
			"uid": 293514,
			"receiptNo": "Rec_023",
			"partyIdLocal": "V2Z8ZaSAb27yt5fBDXg1",
			"createdStamp": 1624522772158,
			"txnMode": "cash",
			"localId": "FNXMmukCFlnpMbaoB8xv",
			"dateStamp": 1624522772137,
			"amount": 1000,
			"state": "added"
		},
		"addressTo": "ORIGINAL FOR RECIPIENT",
		"showSignatureInTemplates": true,
		"showSignatureNotRequiredText": true,
		"makeItemNameBold": true
	}
    res.render("index",{
		data: await HtmlTemplates.getTemplateHtml(obj,("temp9"))
	});
})

app.listen(9000, () => {
    console.log('Server started on port: ' + 9000);  
});