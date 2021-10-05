import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Meals } from 'src/app/Enums/meal.enum';
import { Account } from 'src/app/Models/AccountModels';
import { FoodItem } from 'src/app/Models/FoodItem';
import { FoodItemConsumed } from 'src/app/Models/FoodItemConsumedModel';
import { AccountService } from 'src/app/Services/account-service/account-service';
import { FoodItemService } from 'src/app/Services/food-item-service/food-item-service.service';
import { FoodItemConsumedService } from 'src/app/Services/foodItemConsumed-service/food-item-consumed.service';
import { PopupService } from 'src/app/Services/popup-service/popup.service';

@Component({
  selector: 'app-add-edit-food-item-consumed',
  templateUrl: './add-edit-food-item-consumed.component.html',
  styleUrls: ['./add-edit-food-item-consumed.component.scss'],
})
export class AddEditFoodItemConsumedComponent implements OnInit {
  @Input() foodItemConsumedToEdit: FoodItemConsumed;
  @Input() date: Date = new Date(
    new Date().setMilliseconds(
      //substracts timezone offset to get local time
      -new Date().getTimezoneOffset() * 60000
    )
  );

  public meals = Object.keys(Meals).filter((m) => {
    return isNaN(Number(m)) ? m : null;
  });
  public foodItems: FoodItem[] = [];
  public form: FormGroup;
  public selectedFoodItem: FoodItem;
  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private foodItemService: FoodItemService,
    private foodItemConsumedService: FoodItemConsumedService,
    private accountService: AccountService,
    private popupService: PopupService
  ) {}

  ngOnInit() {
    this.BuildForm();
    if (this.foodItemConsumedToEdit != undefined) {
      this.form.controls.id.setValue(
        this.foodItemConsumedToEdit.foodItem.foodItemId
      );
      this.form.controls.quantity.setValue(
        this.foodItemConsumedToEdit.quantity
      );
      this.form.controls.meal.setValue(this.foodItemConsumedToEdit.meal);
      this.selectedFoodItem = this.foodItemConsumedToEdit.foodItem;
    }
  }

  CloseModal(refreshDiary: boolean) {
    this.modalController.dismiss(refreshDiary);
  }

  async SaveFoodItemConsumed() {
    if (this.form.valid) {
      const foodItemConsumed: FoodItemConsumed = {
        foodItemConsumedId: this.foodItemConsumedToEdit
          ? this.foodItemConsumedToEdit.foodItemConsumedId
          : 0,
        foodItemId: this.form.controls.id.value,
        userId: await this.accountService.GetUserId(),
        quantity: this.form.controls.quantity.value,
        meal: this.form.controls.meal.value,
        dateTime: this.foodItemConsumedToEdit
          ? this.foodItemConsumedToEdit.dateTime
          : this.date,
      };

      if (this.foodItemConsumedToEdit == undefined) {
        this.Save(foodItemConsumed);
      } else {
        this.Edit(foodItemConsumed);
      }
    }
  }

  async Save(foodItemConsumed) {
    (
      await this.foodItemConsumedService.AddFoodItemConsumed(foodItemConsumed)
    ).subscribe(
      (rez) => {
        this.popupService.SimplePopup('Success', 1000, 'success');
        this.form.reset();
        this.CloseModal(true);
      },
      (error) => {
        this.popupService.SimplePopup('error', 1000, 'danger');
      }
    );
  }

  async Edit(foodItemConsumed) {
    (
      await this.foodItemConsumedService.EditFoodItemConsumed(foodItemConsumed)
    ).subscribe(
      (rez) => {
        this.popupService.SimplePopup('Success', 1000, 'success');
        this.form.reset();
        this.CloseModal(true);
      },
      (error) => {
        this.popupService.SimplePopup('error', 1000, 'danger');
      }
    );
  }

  BuildForm() {
    this.form = this.formBuilder.group({
      id: ['', Validators.required],
      quantity: [
        '',
        Validators.compose([
          Validators.required,
          this.positiveNumberValidator(),
        ]),
      ],
      meal: ['', Validators.required],
    });

    this.form.controls.meal.setValue(
      this.GetAppropriateMealTime().replace('_', ' ')
    );
  }

  async SearchInput($event) {
    const searchValue = $event.detail.value;
    if (searchValue != '') {
      (await this.foodItemService.GetFoodItemsByName(searchValue)).subscribe(
        (rez) => {
          this.foodItems = rez;
        }
      );
    } else {
      this.foodItems = [];
    }
  }

  SelectFoodItem($event: FoodItem) {
    this.selectedFoodItem = $event;
    this.form.controls.id.setValue($event.foodItemId);
    this.foodItems = [];
  }

  positiveNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const isNotOk = Number(control.value) < 0;
      return isNotOk ? { nonPositive: { value: control.value } } : null;
    };
  }

  GetAppropriateMealTime() {
    const currentHour = new Date().getHours();
    if (this.InRange(currentHour, 22, 5)) {
      return Meals[Meals.Late_Snack];
    }
    if (this.InRange(currentHour, 5, 9)) {
      return Meals[Meals.Breaksfast];
    }
    if (this.InRange(currentHour, 9, 12)) {
      return Meals[Meals.Early_Snack];
    }
    if (this.InRange(currentHour, 12, 15)) {
      return Meals[Meals.Lunch];
    }
    if (this.InRange(currentHour, 15, 18)) {
      return Meals[Meals.Snack];
    }
    if (this.InRange(currentHour, 18, 22)) {
      return Meals[Meals.Dinner];
    }
    return undefined;
  }

  InRange(number: number, min: number, max: number) {
    if (number >= min && number <= max) {
      return true;
    }
    return false;
  }

  ComputeTotalCalories() {
    return Math.round(
      (this.selectedFoodItem.calories * this.form.controls.quantity.value) / 100
    );
  }
  ComputeTotalProtein() {
    return Math.round(
      (this.selectedFoodItem.protein * this.form.controls.quantity.value) / 100
    );
  }
  ComputeTotalCarbohydrates() {
    return Math.round(
      (this.selectedFoodItem.carbohydrates *
        this.form.controls.quantity.value) /
        100
    );
  }
  ComputeTotalFats() {
    return Math.round(
      (this.selectedFoodItem.fats * this.form.controls.quantity.value) / 100
    );
  }
}
