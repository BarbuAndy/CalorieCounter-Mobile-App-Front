import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { FoodItemConsumed } from 'src/app/Models/FoodItemConsumedModel';
import { AccountService } from '../account-service/account-service';
import { StorageService } from '../storage-service/storage.service';

@Injectable({
  providedIn: 'root',
})
export class FoodItemConsumedService {
  private userId: number;
  private header: HttpHeaders;
  private readonly api = 'https://localhost:44340/api/FoodItemConsumed';

  constructor(
    private storageService: StorageService,
    private httpClient: HttpClient,
    private acountService: AccountService
  ) {}

  async InitHeaders() {
    await this.acountService.isLoggedIn().then(async (loggedIn) => {
      if (loggedIn == true) {
        this.acountService.GetToken().then((rez) => {
          this.header = new HttpHeaders({
            Authorization: `Bearer ${rez}`,
          });
        });

        await this.acountService.GetUserId().then((rez) => {
          this.userId = rez;
        });
      }
    });
  }

  CheckDataIsInit() {
    if (this.userId == undefined || this.header == undefined) {
      return false;
    }
    return true;
  }

  //gets food items consumed by date, 24 hours period, logged in user
  async GetFoodItemsConsumedByDate(initialDate: Date = new Date()) {
    if (!this.CheckDataIsInit()) {
      await this.InitHeaders();
    }

    const date = new Date(initialDate);
    const userQuery = 'userId=' + this.userId.toString();
    const offset = new Date().getTimezoneOffset() * 60000; //gets timezone offset in miliseconds
    const dateTimeMinQuery =
      'dateTimeMin=' + new Date(date.setHours(0, 0, 0, 0) - offset).toJSON();
    const dateTimeMaxQuery =
      'dateTimeMax=' +
      new Date(date.setHours(23, 59, 59, 59) - offset).toJSON();
    const includeFood = 'includeFood=' + 'true';

    return this.httpClient.get<FoodItemConsumed[]>(
      this.api +
        '?' +
        userQuery +
        '&' +
        dateTimeMinQuery +
        '&' +
        dateTimeMaxQuery +
        '&' +
        includeFood,
      {
        headers: this.header,
      }
    );
  }

  async AddFoodItemConsumed(foodItemConsumed: FoodItemConsumed) {
    if (!this.CheckDataIsInit()) {
      await this.InitHeaders();
    }
    return this.httpClient.post(this.api, foodItemConsumed, {
      headers: this.header,
    });
  }

  async EditFoodItemConsumed(foodItemConsumed: any) {
    if (!this.CheckDataIsInit()) {
      await this.InitHeaders();
    }
    return this.httpClient.put(this.api, foodItemConsumed, {
      headers: this.header,
    });
  }

  async RemoveFoodItemConsumed(foodItemConsumedId: number) {
    if (!this.CheckDataIsInit()) {
      await this.InitHeaders();
    }
    const foodItemConsumedIdQuery =
      'foodItemConsumedId=' + foodItemConsumedId.toString();

    return this.httpClient.delete(this.api + '?' + foodItemConsumedIdQuery, {
      headers: this.header,
    });
  }
}
