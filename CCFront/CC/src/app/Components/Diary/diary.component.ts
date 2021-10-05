import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Meals } from 'src/app/Enums/meal.enum';
import { FoodItem } from 'src/app/Models/FoodItem';
import { FoodItemConsumed } from 'src/app/Models/FoodItemConsumedModel';
import { AccountService } from 'src/app/Services/account-service/account-service';
import { FoodItemConsumedService } from 'src/app/Services/foodItemConsumed-service/food-item-consumed.service';
import { PopupService } from 'src/app/Services/popup-service/popup.service';
import { AddEditFoodItemConsumedComponent } from './AddEditFoodItemConsumed/add-edit-food-item-consumed/add-edit-food-item-consumed.component';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss'],
})
export class DiaryComponent implements OnInit {
  public foodItemConsumedData: FoodItemConsumed[];
  public meals: string[] = [];
  public selectedDate: Date = new Date();
  constructor(
    private accountService: AccountService,
    private foodItemConsumedService: FoodItemConsumedService,
    private popupService: PopupService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.GetData();
  }

  ChangeDateEvent($event: Date) {
    this.selectedDate = $event;
    this.GetData();
  }

  GetData() {
    this.foodItemConsumedService
      .GetFoodItemsConsumedByDate(this.selectedDate)
      .then((val) => {
        val.subscribe((rez) => {
          this.foodItemConsumedData = rez;
          this.ExtractMeals();
        });
      });
  }

  RefreshDiary($event) {
    console.log($event);

    if ($event == true) {
      this.GetData();
    }
  }

  GetItemsIn(meal) {
    return this.foodItemConsumedData.filter((fic) => {
      return fic.meal == meal;
    });
  }

  async EditFoodItemConsumed(itemToEdit) {
    const modal = await await this.modalController.create({
      component: AddEditFoodItemConsumedComponent,
      componentProps: {
        foodItemConsumedToEdit: itemToEdit,
      },
    });
    modal.onDidDismiss().then((rez) => {
      this.RefreshDiary(rez.data as boolean);
    });

    await modal.present();
  }

  ExtractMeals() {
    var meals = [];
    this.foodItemConsumedData.forEach((fic) => {
      meals.push(fic.meal);
    });
    meals = [...new Set(meals)]; //remove duplicates
    var allPossibleMeals: string[] = [];

    Object.keys(Meals)
      .filter((m) => {
        return isNaN(Number(m)) ? m : null;
      })
      .forEach((e) => {
        allPossibleMeals.push(e.replace('_', ' '));
      });

    var orderedMeals: string[] = [];
    allPossibleMeals.forEach((e) => {
      if (meals.includes(e)) {
        orderedMeals.push(e);
      }
    });
    this.meals = orderedMeals;
  }

  async DeleteFoodItemEaten(item: FoodItemConsumed) {
    (
      await this.foodItemConsumedService.RemoveFoodItemConsumed(
        item.foodItemConsumedId
      )
    ).subscribe(
      (rez) => {
        this.popupService.SimplePopup('Success', 1000, 'success');
        this.RefreshDiary(true);
      },
      (error) => {
        this.popupService.SimplePopup('error', 1000, 'danger');
      }
    );
  }

  async AddFoodItemConsumed() {
    const modal = await await this.modalController.create({
      component: AddEditFoodItemConsumedComponent,
      componentProps: {
        date: this.selectedDate,
      },
    });
    modal.onDidDismiss().then((rez) => {
      this.RefreshDiary(rez.data as boolean);
    });

    await modal.present();
  }

  ComputeTotalCaloriesPerMeal(meal) {
    var totalCalories = 0;
    this.foodItemConsumedData.forEach((fic) => {
      if (fic.meal == meal) {
        totalCalories += (fic.foodItem.calories * fic.quantity) / 100;
      }
    });
    return Math.round(totalCalories).toString();
  }

  ComputeTotalProteinPerMeal(meal) {
    var totalProtein = 0;
    this.foodItemConsumedData.forEach((fic) => {
      if (fic.meal == meal) {
        totalProtein += (fic.foodItem.protein * fic.quantity) / 100;
      }
    });
    return Math.round(totalProtein).toString();
  }

  ComputeTotalCarbohydratesPerMeal(meal) {
    var totalCarbohydrates = 0;
    this.foodItemConsumedData.forEach((fic) => {
      if (fic.meal == meal) {
        totalCarbohydrates += (fic.foodItem.carbohydrates * fic.quantity) / 100;
      }
    });
    return Math.round(totalCarbohydrates).toString();
  }

  ComputeTotalFatsPerMeal(meal) {
    var totalFats = 0;
    this.foodItemConsumedData.forEach((fic) => {
      if (fic.meal == meal) {
        totalFats += (fic.foodItem.fats * fic.quantity) / 100;
      }
    });
    return Math.round(totalFats).toString();
  }
}
