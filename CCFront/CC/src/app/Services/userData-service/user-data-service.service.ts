import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GoalsVariables } from 'src/app/Models/GoalsVariablesModel';
import { UserDataModel } from 'src/app/Models/UserDataModel';
import { AccountService } from '../account-service/account-service';
import { StorageService } from '../storage-service/storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private userId: number;
  private header: HttpHeaders;
  private readonly api = 'https://localhost:44340/api/UserData';

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

  async GetGoalsVariables() {
    if (!this.CheckDataIsInit()) {
      await this.InitHeaders();
    }
    return this.httpClient.get<GoalsVariables>(this.api + '/goalsVariables');
  }

  async PostUserData(userData: UserDataModel) {
    if (!this.CheckDataIsInit()) {
      await this.InitHeaders();
    }
    return this.httpClient.post(this.api, userData);
  }

  async GetUserData() {
    if (!this.CheckDataIsInit()) {
      await this.InitHeaders();
    }
    const userQuery = 'userId=' + this.userId;
    return this.httpClient.get<UserDataModel>(this.api + '?' + userQuery);
  }

  async getGoalStatistics() {
    if (!this.CheckDataIsInit()) {
      await this.InitHeaders();
    }
    const userQuery = 'userId=' + this.userId;
    return this.httpClient.get<UserDataModel>(
      this.api + '/statistics' + '?' + userQuery
    );
  }
}
