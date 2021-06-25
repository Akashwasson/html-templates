import { InvoicePrint } from "./models/print.model";
import { Gst1A5 } from "./templates/gst1-A5";
import { Gst2A5 } from "./templates/gst2-A5";
import { LetterHead } from "./templates/letter-head";
import { ModernA5 } from "./templates/modern-A5";
import { TallyGST } from "./templates/tallyGST";
import { TallyHSN } from "./templates/tallyHSN";
import { Temp1 } from "./templates/temp1";
import { Temp17 } from "./templates/temp17";
import { Temp2 } from "./templates/temp2";
import { Temp23 } from "./templates/temp23";
import { Temp3 } from "./templates/temp3";


export  class  HtmlTemplates{
  
  public static async getTemplateHtml(data: InvoicePrint, invoicePref: any) {
    try {
  
      const templateObj = {
        temp6: (x) => new Temp1(x).main(),
        temp2: (x) => new Temp2(x).main(),
        temp3: (x) => new Temp3(x).main(),
        temp9: (x) => new ModernA5(x).main(),
        temp10: (x) => new Gst1A5(x).main(),
        temp11: (x) => new Gst2A5(x).main(),
        temp12: (x) => new TallyHSN(x).main(),
        temp13: (x) => new TallyGST(x).main(),
        temp14: (x) => new LetterHead(x).main(),
        temp17: (x) => new Temp17(x).main(),
        temp23: (x) => new Temp23(x).main(),
      };
      if (templateObj[invoicePref]) {
        return await templateObj[invoicePref](data);
      }
      return await templateObj.temp6(data);
    } catch (error) {}
  }

}

