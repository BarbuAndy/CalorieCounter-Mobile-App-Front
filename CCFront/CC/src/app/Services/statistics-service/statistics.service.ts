import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Statistics } from 'src/app/Models/StatisticsModel';
import { AccountService } from '../account-service/account-service';
import { StorageService } from '../storage-service/storage.service';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private userId: number;
  private header: HttpHeaders;
  private readonly api = 'https://localhost:44340/api/Statistics';

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

  async GetStatistics(minDate: string, maxDate: string) {
    if (!this.CheckDataIsInit()) {
      await this.InitHeaders();
    }
    const userIdQuery = 'userId=' + this.userId.toString();
    const dateMinQuery = 'dateMin=' + minDate;
    const dateMaxQuery = 'dateMax=' + maxDate;
    return this.httpClient.get<Statistics[]>(
      this.api + '?' + userIdQuery + '&' + dateMinQuery + '&' + dateMaxQuery
    );
  }
}
