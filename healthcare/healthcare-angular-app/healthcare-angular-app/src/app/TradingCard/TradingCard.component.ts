/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { TradingCardService } from './TradingCard.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-tradingcard',
  templateUrl: './TradingCard.component.html',
  styleUrls: ['./TradingCard.component.css'],
  providers: [TradingCardService]
})
export class TradingCardComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  cardId = new FormControl('', Validators.required);
  cardName = new FormControl('', Validators.required);
  cardDescription = new FormControl('', Validators.required);
  cardType = new FormControl('', Validators.required);
  forTrade = new FormControl('', Validators.required);
  owner = new FormControl('', Validators.required);

  constructor(public serviceTradingCard: TradingCardService, fb: FormBuilder) {
    this.myForm = fb.group({
      cardId: this.cardId,
      cardName: this.cardName,
      cardDescription: this.cardDescription,
      cardType: this.cardType,
      forTrade: this.forTrade,
      owner: this.owner
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceTradingCard.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.example.biznet.TradingCard',
      'cardId': this.cardId.value,
      'cardName': this.cardName.value,
      'cardDescription': this.cardDescription.value,
      'cardType': this.cardType.value,
      'forTrade': this.forTrade.value,
      'owner': this.owner.value
    };

    this.myForm.setValue({
      'cardId': null,
      'cardName': null,
      'cardDescription': null,
      'cardType': null,
      'forTrade': null,
      'owner': null
    });

    return this.serviceTradingCard.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'cardId': null,
        'cardName': null,
        'cardDescription': null,
        'cardType': null,
        'forTrade': null,
        'owner': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.example.biznet.TradingCard',
      'cardName': this.cardName.value,
      'cardDescription': this.cardDescription.value,
      'cardType': this.cardType.value,
      'forTrade': this.forTrade.value,
      'owner': this.owner.value
    };

    return this.serviceTradingCard.updateAsset(form.get('cardId').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceTradingCard.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceTradingCard.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'cardId': null,
        'cardName': null,
        'cardDescription': null,
        'cardType': null,
        'forTrade': null,
        'owner': null
      };

      if (result.cardId) {
        formObject.cardId = result.cardId;
      } else {
        formObject.cardId = null;
      }

      if (result.cardName) {
        formObject.cardName = result.cardName;
      } else {
        formObject.cardName = null;
      }

      if (result.cardDescription) {
        formObject.cardDescription = result.cardDescription;
      } else {
        formObject.cardDescription = null;
      }

      if (result.cardType) {
        formObject.cardType = result.cardType;
      } else {
        formObject.cardType = null;
      }

      if (result.forTrade) {
        formObject.forTrade = result.forTrade;
      } else {
        formObject.forTrade = null;
      }

      if (result.owner) {
        formObject.owner = result.owner;
      } else {
        formObject.owner = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'cardId': null,
      'cardName': null,
      'cardDescription': null,
      'cardType': null,
      'forTrade': null,
      'owner': null
      });
  }

}
