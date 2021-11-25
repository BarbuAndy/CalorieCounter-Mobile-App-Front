import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FoodItemRejectionStatus } from 'src/app/Enums/FoodItemRejectionStatus.enum';
import { Account } from 'src/app/Models/AccountModels';
import { FoodItem } from 'src/app/Models/FoodItem';
import { FoodItemSuggestion } from 'src/app/Models/FoodItemSuggestion';
import { AccountService } from 'src/app/Services/account-service/account-service';
import { FoodItemService } from 'src/app/Services/food-item-service/food-item-service.service';
import { PopupService } from 'src/app/Services/popup-service/popup.service';

@Component({
  selector: 'app-aprove-foods',
  templateUrl: './aprove-foods.component.html',
  styleUrls: ['./aprove-foods.component.scss'],
})
export class AproveFoodsComponent implements OnInit {
  public suggestedFoodItems: FoodItemSuggestion[] = [];

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
      this.suggestedFoodItems = rez as FoodItemSuggestion[];
      this.suggestedFoodItems.map(
        (f) => (f.status = FoodItemRejectionStatus.NotSet)
      );
    });
  }

  async ApproveSuggestion($event: FoodItemSuggestion) {
    const foodItem = this.Approve($event);

    (await this.foodItemService.ApproveSuggestion(foodItem)).subscribe(
      (rez) => {
        this.popupService.SimplePopup('Success', 1000, 'success');
      },
      (error) => {
        this.popupService.SimplePopup('error', 1000, 'danger');
      },
      () => {
        this.RefreshList();
      }
    );
  }

  async RejectSuggestion($event: FoodItemSuggestion) {
    const foodItem = this.Reject($event);
    (await this.foodItemService.RejectSuggestion(foodItem)).subscribe(
      (rez) => {
        this.popupService.SimplePopup('Succes', 1000, 'success');
      },
      (error) => {
        this.popupService.SimplePopup('error', 1000, 'danger');
      },
      () => {
        this.RefreshList();
      }
    );
  }

  RefreshList() {
    if (
      this.suggestedFoodItems.find(
        (e) => e.status == FoodItemRejectionStatus.NotSet
      ) == null
    ) {
      this.GetData();
    }
  }

  Approve(foodItemToAprove: FoodItemSuggestion) {
    foodItemToAprove.published = true;
    foodItemToAprove.status = FoodItemRejectionStatus.Approved;
    return foodItemToAprove;
  }

  Reject(foodItemToReject: FoodItemSuggestion) {
    foodItemToReject.published = false;
    foodItemToReject.status = FoodItemRejectionStatus.Rejected;
    return foodItemToReject;
  }

  RemoveFoodFromList(foodItemToRemove: FoodItem) {
    this.suggestedFoodItems = this.suggestedFoodItems.filter((fis) => {
      return fis.foodItemId != foodItemToRemove.foodItemId;
    });
  }
}
