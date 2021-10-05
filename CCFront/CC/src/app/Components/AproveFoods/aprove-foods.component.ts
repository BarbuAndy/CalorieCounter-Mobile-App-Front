import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from 'src/app/Models/AccountModels';
import { FoodItem } from 'src/app/Models/FoodItem';
import { AccountService } from 'src/app/Services/account-service/account-service';
import { FoodItemService } from 'src/app/Services/food-item-service/food-item-service.service';
import { PopupService } from 'src/app/Services/popup-service/popup.service';

@Component({
  selector: 'app-aprove-foods',
  templateUrl: './aprove-foods.component.html',
  styleUrls: ['./aprove-foods.component.scss'],
})
export class AproveFoodsComponent implements OnInit {
  public suggestedFoodItems: FoodItem[] = [];

  constructor(
    private accountService: AccountService,
    private router: Router,
    private foodItemService: FoodItemService,
    private popupService: PopupService
  ) {}

  ngOnInit() {
    this.accountService.isAdmin().then((rez) => {
      if (rez == false) {
        this.router.navigate(['Diary']);
      } else {
        this.GetData();
      }
    });
  }

  async GetData() {
    (await this.foodItemService.GetSuggestedFoodItems()).subscribe((rez) => {
      this.suggestedFoodItems = rez;
    });
  }

  async ApproveSuggestion($event: FoodItem) {
    const foodItem = this.Approve($event);

    (await this.foodItemService.ApproveSuggestion(foodItem)).subscribe(
      (rez) => {
        this.popupService.SimplePopup('Succes', 1000, 'success');
        this.RemoveFoodFromList(foodItem);
      },
      (error) => {
        this.popupService.SimplePopup('error', 1000, 'danger');
      }
    );
  }

  async RejectSuggestion($event: FoodItem) {
    (await this.foodItemService.RejectSuggestion($event)).subscribe(
      (rez) => {
        this.popupService.SimplePopup('Succes', 1000, 'success');
        this.RemoveFoodFromList($event);
      },
      (error) => {
        this.popupService.SimplePopup('error', 1000, 'danger');
      }
    );
  }

  Approve(foodItemToAprove: FoodItem) {
    foodItemToAprove.published = true;
    return foodItemToAprove;
  }

  RemoveFoodFromList(foodItemToRemove: FoodItem) {
    this.suggestedFoodItems = this.suggestedFoodItems.filter((fis) => {
      return fis.foodItemId != foodItemToRemove.foodItemId;
    });
  }
}
