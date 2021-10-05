import { Component, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddEditFoodItemConsumedComponent } from 'src/app/Components/Diary/AddEditFoodItemConsumed/add-edit-food-item-consumed/add-edit-food-item-consumed.component';
import { EventEmitter } from '@angular/core';
import { StatisticsComponent } from 'src/app/Components/Diary/statistics/statistics.component';

@Component({
  selector: 'app-diary-menu',
  templateUrl: './diary-menu.component.html',
  styleUrls: ['./diary-menu.component.scss'],
})
export class DiaryMenuComponent implements OnInit {
  currentDate: Date = new Date(
    new Date().setMilliseconds(
      //substracts timezone offset to get local time
      -new Date().getTimezoneOffset() * 60000
    )
  );
  @Output() dateEventEmitter = new EventEmitter<Date>();
  @Output() refreshDiaryEmitter = new EventEmitter<Boolean>();
  @Output() addFoodEventEmitter = new EventEmitter();

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  prevDay() {
    this.currentDate.setDate(this.currentDate.getDate() - 1);
    this.ChangeDateEvent();
  }

  nextDay() {
    this.currentDate.setDate(this.currentDate.getDate() + 1);
    this.ChangeDateEvent();
  }

  updateDate($event) {
    const newDate = new Date(
      new Date($event.detail.value).setMilliseconds(
        //substracts timezone offset to get local time
        -new Date().getTimezoneOffset() * 60000
      )
    );
    if (
      this.currentDate.getDate() != newDate.getDate() ||
      this.currentDate.getMonth() != newDate.getMonth() ||
      this.currentDate.getFullYear() != this.currentDate.getFullYear()
    ) {
      this.currentDate = newDate;
      this.ChangeDateEvent();
    }
  }

  ChangeDateEvent() {
    this.dateEventEmitter.emit(this.currentDate);
  }

  async AddFoodItemConsumed() {
    this.addFoodEventEmitter.emit();
  }

  async ViewStatistics() {
    const modal = await await this.modalController.create({
      component: StatisticsComponent,
      componentProps: {
        minDate: this.currentDate,
        maxDate: this.currentDate,
      },
    });

    await modal.present();
  }
}
