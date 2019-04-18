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
import { OrderService } from './Order.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-order',
  templateUrl: './Order.component.html',
  styleUrls: ['./Order.component.css'],
  providers: [OrderService]
})
export class OrderComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  productID = new FormControl('', Validators.required);
  productName = new FormControl('', Validators.required);
  owner = new FormControl('', Validators.required);
  previousOwner = new FormControl('', Validators.required);
  quantity = new FormControl('', Validators.required);
  pricePerUnit = new FormControl('', Validators.required);
  totalPrice = new FormControl('', Validators.required);

  constructor(public serviceOrder: OrderService, fb: FormBuilder) {
    this.myForm = fb.group({
      productID: this.productID,
      productName: this.productName,
      owner: this.owner,
      previousOwner: this.previousOwner,
      quantity: this.quantity,
      pricePerUnit: this.pricePerUnit,
      totalPrice: this.totalPrice
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceOrder.getAll()
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
      $class: 'cpp.Order',
      'productID': this.productID.value,
      'productName': this.productName.value,
      'owner': this.owner.value,
      'previousOwner': this.previousOwner.value,
      'quantity': this.quantity.value,
      'pricePerUnit': this.pricePerUnit.value,
      'totalPrice': this.totalPrice.value
    };

    this.myForm.setValue({
      'productID': null,
      'productName': null,
      'owner': null,
      'previousOwner': null,
      'quantity': null,
      'pricePerUnit': null,
      'totalPrice': null
    });

    return this.serviceOrder.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'productID': null,
        'productName': null,
        'owner': null,
        'previousOwner': null,
        'quantity': null,
        'pricePerUnit': null,
        'totalPrice': null
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
      $class: 'cpp.Order',
      'productName': this.productName.value,
      'owner': this.owner.value,
      'previousOwner': this.previousOwner.value,
      'quantity': this.quantity.value,
      'pricePerUnit': this.pricePerUnit.value,
      'totalPrice': this.totalPrice.value
    };

    return this.serviceOrder.updateAsset(form.get('productID').value, this.asset)
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

    return this.serviceOrder.deleteAsset(this.currentId)
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

    return this.serviceOrder.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'productID': null,
        'productName': null,
        'owner': null,
        'previousOwner': null,
        'quantity': null,
        'pricePerUnit': null,
        'totalPrice': null
      };

      if (result.productID) {
        formObject.productID = result.productID;
      } else {
        formObject.productID = null;
      }

      if (result.productName) {
        formObject.productName = result.productName;
      } else {
        formObject.productName = null;
      }

      if (result.owner) {
        formObject.owner = result.owner;
      } else {
        formObject.owner = null;
      }

      if (result.previousOwner) {
        formObject.previousOwner = result.previousOwner;
      } else {
        formObject.previousOwner = null;
      }

      if (result.quantity) {
        formObject.quantity = result.quantity;
      } else {
        formObject.quantity = null;
      }

      if (result.pricePerUnit) {
        formObject.pricePerUnit = result.pricePerUnit;
      } else {
        formObject.pricePerUnit = null;
      }

      if (result.totalPrice) {
        formObject.totalPrice = result.totalPrice;
      } else {
        formObject.totalPrice = null;
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
      'productID': null,
      'productName': null,
      'owner': null,
      'previousOwner': null,
      'quantity': null,
      'pricePerUnit': null,
      'totalPrice': null
      });
  }

}
