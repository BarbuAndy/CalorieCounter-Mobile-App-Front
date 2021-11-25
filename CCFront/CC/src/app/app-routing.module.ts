import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './Components/Account/account.component';
import { AddeditfoodComponent } from './Components/AddEditFood/addeditfood.component';
import { AproveFoodsComponent } from './Components/AproveFoods/aprove-foods.component';
import { DiaryComponent } from './Components/Diary/diary.component';
import { GoalsComponent } from './Components/goals/goals.component';
import { RegisterLoginComponent } from './Components/RegisterLogin/registerlogin.component';
import { SettingsComponent } from './Components/Settings/settings.component';
import { LoginGuardService } from './Services/login-guard/login-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'RegisterLogin',
    pathMatch: 'full',
  },
  {
    path: 'Account',
    component: AccountComponent,
    canActivate: [LoginGuardService],
  },
  {
    path: 'Diary',
    component: DiaryComponent,
    canActivate: [LoginGuardService],
  },
  {
    path: 'AddFood',
    component: AddeditfoodComponent,
    canActivate: [LoginGuardService],
  },
  {
    path: 'EditFood',
    component: AddeditfoodComponent,
    canActivate: [LoginGuardService],
  },
  {
    path: 'Settings',
    component: SettingsComponent,
    canActivate: [LoginGuardService],
  },
  {
    path: 'ApproveFoods',
    component: AproveFoodsComponent,
    canActivate: [LoginGuardService],
  },
  {
    path: 'RegisterLogin',
    component: RegisterLoginComponent,
  },
  {
    path: 'Goals',
    component: GoalsComponent,
    canActivate: [LoginGuardService],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
