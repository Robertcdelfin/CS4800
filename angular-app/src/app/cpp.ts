import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace cpp{
   export class Order extends Asset {
      productID: string;
      productName: string;
      owner: string;
      previousOwner: string;
      quantity: number;
      pricePerUnit: number;
      totalPrice: number;
   }
// }
