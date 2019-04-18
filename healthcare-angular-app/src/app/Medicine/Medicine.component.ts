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
import { MedicineService } from './Medicine.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-medicine',
  templateUrl: './Medicine.component.html',
  styleUrls: ['./Medicine.component.css'],
  providers: [MedicineService]
})
export class MedicineComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  productID = new FormControl('', Validators.required);
  productName = new FormControl('', Validators.required);
  productDescription = new FormControl('', Validators.required);
  previousOwner = new FormControl('', Validators.required);
  forTrade = new FormControl('', Validators.required);
  owner = new FormControl('', Validators.required);

  constructor(public serviceMedicine: MedicineService, fb: FormBuilder) {
    this.myForm = fb.group({
      productID: this.productID,
      productName: this.productName,
      productDescription: this.productDescription,
      previousOwner: this.previousOwner,
      forTrade: this.forTrade,
      owner: this.owner
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceMedicine.getAll()
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
      $class: 'cpp.Medicine',
      'productID': this.productID.value,
      'productName': this.productName.value,
      'productDescription': this.productDescription.value,
      'previousOwner': this.previousOwner.value,
      'forTrade': this.forTrade.value,
      'owner': this.owner.value
    };

    this.myForm.setValue({
      'productID': null,
      'productName': null,
      'productDescription': null,
      'previousOwner': null,
      'forTrade': null,
      'owner': null
    });

    return this.serviceMedicine.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'productID': null,
        'productName': null,
        'productDescription': null,
        'previousOwner': null,
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
      $class: 'cpp.Medicine',
      'productName': this.productName.value,
      'productDescription': this.productDescription.value,
      'previousOwner': this.previousOwner.value,
      'forTrade': this.forTrade.value,
      'owner': this.owner.value
    };

    return this.serviceMedicine.updateAsset(form.get('productID').value, this.asset)
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

    return this.serviceMedicine.deleteAsset(this.currentId)
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

    return this.serviceMedicine.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'productID': null,
        'productName': null,
        'productDescription': null,
        'previousOwner': null,
        'forTrade': null,
        'owner': null
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

      if (result.productDescription) {
        formObject.productDescription = result.productDescription;
      } else {
        formObject.productDescription = null;
      }

      if (result.previousOwner) {
        formObject.previousOwner = result.previousOwner;
      } else {
        formObject.previousOwner = null;
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
      'productID': null,
      'productName': null,
      'productDescription': null,
      'previousOwner': null,
      'forTrade': null,
      'owner': null
      });
  }

}
