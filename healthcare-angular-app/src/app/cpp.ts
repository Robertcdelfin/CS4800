import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace cpp{
   export class Medicine extends Asset {
      productID: string;
      productName: string;
      productDescription: string;
      previousOwner: string;
      forTrade: boolean;
      owner: Owner;
   }
   export class Owner extends Participant {
      ownerID: string;
      ownerName: string;
   }
   export class SellMedicine extends Transaction {
      medicine: Medicine;
      newOwner: Owner;
   }
   export class TradeNotification extends Event {
      medicine: Medicine;
   }
// }
