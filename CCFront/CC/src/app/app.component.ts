import { Component, OnInit } from '@angular/core';
import { AccountService } from './Services/account-service/account-service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages: { title: string; url: string; icon: string }[];
  constructor(private accoutService: AccountService) {}

  ngOnInit() {
    this.appPages = [
      { title: 'Account', url: '/Account', icon: 'person' },
      { title: 'Goals', url: '/Goals', icon: 'accessibility' },
      { title: 'Diary', url: '/Diary', icon: 'book' },
      { title: 'Add Food', url: '/AddFood', icon: 'pizza' },
      { title: 'Settings', url: '/Settings', icon: 'settings' },
    ];

    this.accoutService.isAdmin().then((rez) => {
      if (rez == true) {
        this.appPages.push({
          title: 'Approve Foods',
          url: '/ApproveFoods',
          icon: 'settings',
        });
      }
    });
  }

  Logout() {
    this.accoutService.Logout();
  }
}
