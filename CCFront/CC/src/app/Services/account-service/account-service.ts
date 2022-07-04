import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Account, LoginInfo } from 'src/app/Models/AccountModels';
import { StorageService } from '../storage-service/storage.service';
import { from } from 'rxjs';
import { FoodItemConsumedService } from '../foodItemConsumed-service/food-item-consumed.service';
import { PopupService } from '../popup-service/popup.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly api = 'https://localhost:44340/api/User';
  constructor(
    private storageService: StorageService,
    private httpClient: HttpClient,
    private router: Router,
    private menuController: MenuController,
    private popupService: PopupService
  ) {}

  Login(loginInfo: LoginInfo) {
    this.httpClient.post(this.api + '/login', loginInfo).subscribe(
      async (res) => {
        await this.storageService.set('user', res);
        await this.router.navigate(['Diary']);
        window.location.reload();
        return true;
      },
      (error) => {
        console.log(error.error);
        return false;
      }
    );
  }
  Register(account: Account) {
    this.httpClient.post(this.api + '/register', account).subscribe(
      (res) => {
        this.popupService.SimplePopup('Success', 1000, 'success');
      },
      (error) => {
        this.popupService.SimplePopup('error', 2000, 'danger');
      }
    );
  }

  async isLoggedIn() {
    if ((await this.storageService.get('user')) == null) {
      return false;
    }
    return true;
  }

  async isAdmin() {
    if (!(await this.isLoggedIn())) {
      return false;
    }
    const user = await this.storageService.get('user');
    if (user.role == 'admin') {
      return true;
    }
    return false;
  }

  Logout() {
    this.isLoggedIn().then(async (rez) => {
      if (rez == true) {
        await this.storageService.remove('user');
        await this.router.navigate(['RegisterLogin']);
      }
    });
  }

  UpdateUser(account: Account) {
    return this.httpClient.put(this.api + '/update', account);
  }

  UpdatePassword(updatePasswordModel) {
    return this.httpClient.put(
      this.api + '/updatePassword',
      updatePasswordModel
    );
  }

  async GetToken() {
    return (await this.storageService.get('user'))['token'];
  }

  async GetUserId() {
    return (await this.storageService.get('user'))['userId'];
  }

  async GetUser() {
    return (await this.storageService.get('user')) as Account;
  }
}
