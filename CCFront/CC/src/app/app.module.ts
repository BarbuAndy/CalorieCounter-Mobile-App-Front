import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AccountComponent } from './Components/Account/account.component';
import { AddeditfoodComponent } from './Components/AddEditFood/addeditfood.component';
import { DiaryComponent } from './Components/Diary/diary.component';
import { SettingsComponent } from './Components/Settings/settings.component';
import { TopMenuComponent } from './UI/top-menu/top-menu.component';
import { AccountService } from './Services/account-service/account-service';
import { IonicStorageModule } from '@ionic/storage-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RegisterLoginComponent } from './Components/RegisterLogin/registerlogin.component';
import { DiaryMenuComponent } from './UI/diary-menu/diary-menu.component';
import { FoodItemConsumedService } from './Services/foodItemConsumed-service/food-item-consumed.service';
import { LoginGuardService } from './Services/login-guard/login-guard.service';
import { AddEditFoodItemConsumedComponent } from './Components/Diary/AddEditFoodItemConsumed/add-edit-food-item-consumed/add-edit-food-item-consumed.component';
import { AproveFoodsComponent } from './Components/AproveFoods/aprove-foods.component';
import { InfiniteFoodItemListComponent } from './UI/infinite-food-item-list/infinite-food-item-list.component';
import { FoodItemDisplayComponent } from './UI/food-item-display/food-item-display.component';
import { StatisticsComponent } from './Components/Diary/statistics/statistics.component';
import { StatisticsService } from './Services/statistics-service/statistics.service';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    AccountComponent,
    AddeditfoodComponent,
    DiaryComponent,
    SettingsComponent,
    TopMenuComponent,
    RegisterLoginComponent,
    DiaryMenuComponent,
    AddEditFoodItemConsumedComponent,
    AproveFoodsComponent,
    InfiniteFoodItemListComponent,
    FoodItemDisplayComponent,
    StatisticsComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    DatePipe,
    AccountService,
    FoodItemConsumedService,
    LoginGuardService,
    StatisticsService,
    {
      provide: APP_INITIALIZER,
      useFactory: (fics: FoodItemConsumedService) => () => {
        return fics.InitHeaders();
      },
      deps: [FoodItemConsumedService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
