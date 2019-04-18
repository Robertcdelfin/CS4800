import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.example.biznet{
   export class TradingCard extends Asset {
      cardId: string;
      cardName: string;
      cardDescription: string;
      cardType: GameType;
      forTrade: boolean;
      owner: Trader;
   }
   export enum GameType {
      Baseball,
      FootBall,
      Cricket,
   }
   export class Trader extends Participant {
      traderId: string;
      traderName: string;
   }
   export class TradeCard extends Transaction {
      card: TradingCard;
      newOwner: Trader;
   }
   export class TradeNotification extends Event {
      card: TradingCard;
   }
// }
