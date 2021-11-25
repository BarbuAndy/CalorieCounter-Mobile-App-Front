import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FoodItem } from 'src/app/Models/FoodItem';
import { AccountService } from 'src/app/Services/account-service/account-service';
import { FoodItemService } from 'src/app/Services/food-item-service/food-item-service.service';
import { PopupService } from 'src/app/Services/popup-service/popup.service';

@Component({
  selector: 'app-addeditfood',
  templateUrl: './addeditfood.component.html',
  styleUrls: ['./addeditfood.component.scss'],
})
export class AddeditfoodComponent implements OnInit {
  public form: FormGroup;
  public isAdminCheck = false;
  constructor(
    private formBuilder: FormBuilder,
    private foodItemService: FoodItemService,
    private popupService: PopupService,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.BuildForm();
    this.accountService.isAdmin().then((rez) => {
      this.isAdminCheck = rez;
    });
  }

  BuildForm() {
    this.form = this.formBuilder.group({
      name: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(30)]),
      ],
      calories: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(3)]),
      ],
      protein: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(3)]),
      ],
      carbohydrates: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(3)]),
      ],
      fats: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(3)]),
      ],
      note: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(40)]),
      ],
    });
  }

  async AddFoodSugestion() {
    if (this.form.valid) {
      const foodItem: FoodItem = {
        foodItemId: 0,
        name: this.form.controls.name.value,
        calories: this.form.controls.calories.value,
        protein: this.form.controls.protein.value,
        carbohydrates: this.form.controls.carbohydrates.value,
        fats: this.form.controls.fats.value,
        note: this.form.controls.note.value,
      };

      (await this.foodItemService.AddFoodItemSugestion(foodItem)).subscribe(
        async (rez) => {
          await this.popupService.SimplePopup('Success', 2000, 'success');
          this.form.reset();
        },
        async (error) => {
          await this.popupService.SimplePopup('error', 2000, 'danger');
        }
      );
    }
  }

  async AddFood() {
    if (this.form.valid) {
      const foodItem: FoodItem = {
        foodItemId: 0,
        name: this.form.controls.name.value,
        calories: this.form.controls.calories.value,
        protein: this.form.controls.protein.value,
        carbohydrates: this.form.controls.carbohydrates.value,
        fats: this.form.controls.fats.value,
        note: this.form.controls.note.value,
      };

      (await this.foodItemService.AddFoodItem(foodItem)).subscribe(
        async (rez) => {
          await this.popupService.SimplePopup('Success', 2000, 'success');
          this.form.reset();
        },
        async (error) => {
          await this.popupService.SimplePopup('error', 2000, 'danger');
        }
      );
    }
  }
}
