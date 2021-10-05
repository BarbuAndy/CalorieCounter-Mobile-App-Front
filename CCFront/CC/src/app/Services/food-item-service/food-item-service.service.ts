import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FoodItem } from 'src/app/Models/FoodItem';
import { AccountService } from '../account-service/account-service';
import { StorageService } from '../storage-service/storage.service';

@Injectable({
  providedIn: 'root',
})
export class FoodItemService {
  private userId: number;
  private header: HttpHeaders;
  private readonly api = 'https://localhost:44340/api/FoodItem';

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

  async GetFoodItemsByName(searchValue: string) {
    if (!this.CheckDataIsInit()) {
      await this.InitHeaders();
    }
    const nameQuery = 'name=' + searchValue;
    const publishedQuery = 'published=' + 'true';
    const numberOfResultsQuery = 'numberOfResults=' + '10';
    return this.httpClient.get<FoodItem[]>(
      this.api +
        '?' +
        nameQuery +
        '&' +
        publishedQuery +
        '&' +
        numberOfResultsQuery,
      {
        headers: this.header,
      }
    );
  }

  async AddFoodItemSugestion(foodItem: FoodItem) {
    if (!this.CheckDataIsInit()) {
      await this.InitHeaders();
    }
    return this.httpClient.post(this.api + '/suggest', foodItem, {
      headers: this.header,
    });
  }

  async AddFoodItem(foodItem: FoodItem) {
    if (!this.CheckDataIsInit()) {
      await this.InitHeaders();
    }
    return this.httpClient.post(this.api, foodItem, {
      headers: this.header,
    });
  }

  async GetSuggestedFoodItems(searchValue: string = '') {
    if (!this.CheckDataIsInit()) {
      await this.InitHeaders();
    }
    const nameQuery = 'name=' + searchValue;
    const publishedQuery = 'published=' + 'false';
    const numberOfResultsQuery = 'numberOfResults=' + '20';
    return this.httpClient.get<FoodItem[]>(
      this.api +
        '?' +
        nameQuery +
        '&' +
        publishedQuery +
        '&' +
        numberOfResultsQuery,
      {
        headers: this.header,
      }
    );
  }

  async ApproveSuggestion(foodItem: FoodItem) {
    if (!this.CheckDataIsInit()) {
      await this.InitHeaders();
    }
    return this.httpClient.put(this.api, foodItem, { headers: this.header });
  }

  async RejectSuggestion(foodItem: FoodItem) {
    if (!this.CheckDataIsInit()) {
      await this.InitHeaders();
    }
    const deleteQuery = 'foodItemId=' + foodItem.foodItemId.toString();
    return this.httpClient.delete(this.api + '?' + deleteQuery, {
      headers: this.header,
    });
  }
}
