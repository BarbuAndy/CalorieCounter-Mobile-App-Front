import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Chart } from 'chart.js';
import { ViewMode } from 'src/app/Enums/ViewMode.enum';
import {
  ActivityLevel,
  Goal,
  GoalsVariables,
  PrefferedDiet,
} from 'src/app/Models/GoalsVariablesModel';
import { UserDataModel } from 'src/app/Models/UserDataModel';
import { AccountService } from 'src/app/Services/account-service/account-service';
import { PopupService } from 'src/app/Services/popup-service/popup.service';
import { UserDataService } from 'src/app/Services/userData-service/user-data-service.service';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss'],
})
export class GoalsComponent implements OnInit {
  @ViewChildren('weightChart') lineChartsElementRef: ElementRef;

  activityOptions: ActivityLevel[] = [];
  goalOptions: Goal[] = [];
  dietOptions: PrefferedDiet[] = [];

  form: FormGroup;
  viewMode = ViewMode.View;
  ViewMode = ViewMode;

  constructor(
    private formBuilder: FormBuilder,
    private userDataService: UserDataService,
    private accountService: AccountService,
    private popupService: PopupService
  ) {}

  ngOnInit() {
    this.initForm();
    this.DisableForm(true);
    this.autocompleteForm();
    this.initDropdows();
    //this.getGoalStatistics();
  }

  initForm() {
    this.form = this.formBuilder.group({
      weight: [
        '',
        Validators.compose([Validators.max(636), Validators.min(1)]),
      ],
      activityLevel: '',
      goal: '',
      prefferedDiet: '',
    });
  }

  async initDropdows() {
    (await this.userDataService.GetGoalsVariables()).subscribe((rez) => {
      this.activityOptions = rez.activityLevels;
      this.dietOptions = rez.prefferedDiets;
      this.goalOptions = rez.goals;
    });
  }

  DisableForm(disable: boolean) {
    disable ? this.form.disable() : this.form.enable();
  }

  async autocompleteForm() {
    (await this.userDataService.GetUserData()).subscribe((rez) => {
      this.form.get('weight').setValue(rez.weight);
      this.form.get('activityLevel').setValue(rez.activityLevel.description);
      this.form.get('goal').setValue(rez.goal.description);
      this.form.get('prefferedDiet').setValue(rez.prefferedDiet.description);
    });
  }

  OnEditSave() {
    if (this.viewMode == ViewMode.View) {
      this.viewMode = ViewMode.Edit;
      this.DisableForm(false);
    } else {
      this.SaveChanges();
      this.DisableForm(true);
      this.viewMode = ViewMode.View;
    }
  }

  async SaveChanges() {
    const userData: UserDataModel = {
      userId: await this.accountService.GetUserId(),
      weight: this.form.get('weight').value,
      activityLevel: this.activityOptions.find(
        (x) => x.description == this.form.get('activityLevel').value
      ),
      prefferedDiet: this.dietOptions.find(
        (x) => x.description == this.form.get('prefferedDiet').value
      ),
      goal: this.goalOptions.find(
        (x) => x.description == this.form.get('goal').value
      ),
    };
    (await this.userDataService.PostUserData(userData)).subscribe(
      (succes) => {
        this.popupService.SimplePopup('Goals saved', 1000, 'success');
      },
      (error) => {
        this.popupService.SimplePopup(
          'Goals could not be saved',
          2000,
          'danger'
        );
      }
    );
  }

  // async getGoalStatistics() {
  //   (await this.userDataService.getGoalStatistics()).subscribe((rez) => {},
  //   error => {},
  //   finally => {});
  // }

  drawWeightChart() {
    new Chart(this.lineChartsElementRef.nativeElement, {
      type: 'line',
      data: {
        labels: ['l1', 'l2', 'l3'],
        datasets: [
          {
            label: 'P',
            data: [50, 70, 65],
            borderColor: 'black',
            borderWidth: 1,
            backgroundColor: 'RGB(242, 58, 65)',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }
}
