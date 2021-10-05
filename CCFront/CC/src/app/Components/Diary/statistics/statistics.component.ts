import { DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Statistics } from 'src/app/Models/StatisticsModel';
import { StatisticsService } from 'src/app/Services/statistics-service/statistics.service';
import Chart from 'chart.js/auto';
import { Meals } from 'src/app/Enums/meal.enum';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  @Input() minDate: Date = new Date();
  @Input() maxDate: Date = new Date();
  @ViewChildren('pieChart') pieChartsElementRef: QueryList<ElementRef>;
  @ViewChildren('lineChart') lineChartsElementRef: QueryList<ElementRef>;
  public meals = Object.keys(Meals).filter((m) => {
    return isNaN(Number(m)) ? m : null;
  });
  pieCharts: Chart[] = [];
  lineCharts: Chart[] = [];
  statisticsData: Statistics[] = [];
  constructor(
    private modalController: ModalController,
    private statisticsService: StatisticsService,
    private datePipe: DatePipe,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.GetStatistics();
  }

  CloseModal() {
    this.modalController.dismiss();
  }

  UpdateMinDate($event) {
    this.minDate = $event.detail.value;
  }
  UpdateMaxDate($event) {
    this.maxDate = $event.detail.value;
  }

  createPieChart(elementRef: ElementRef, index: number) {
    const statisticsValidIndex = this.IndexValidStatistics(index);
    if (this.statisticsData[statisticsValidIndex].totalCalories != 0)
      this.pieCharts.push(
        new Chart(elementRef.nativeElement, {
          type: 'pie',
          data: {
            labels: ['P', 'C', 'F'],
            datasets: [
              {
                data: [
                  (this.statisticsData[statisticsValidIndex].totalProtein /
                    this.GetTotalMacros(statisticsValidIndex)) *
                    100,
                  (this.statisticsData[statisticsValidIndex].totalCarbohydrate /
                    this.GetTotalMacros(statisticsValidIndex)) *
                    100,
                  (this.statisticsData[statisticsValidIndex].totalFat /
                    this.GetTotalMacros(statisticsValidIndex)) *
                    100,
                ],
                backgroundColor: [
                  'RGB(242, 58, 65)',
                  'RGB(38, 65, 240)',
                  'RGB(242, 232, 36)',
                ],
                borderColor: 'black',
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
              },
            },
            radius: '100%',
          },
        })
      );
  }

  createLineChart(elementRef: ElementRef, index: number) {
    const statisticsValidIndex = this.IndexValidStatistics(index);
    if (this.statisticsData[statisticsValidIndex].totalCalories != 0)
      this.pieCharts.push(
        new Chart(elementRef.nativeElement, {
          type: 'line',
          data: {
            labels: this.GetMealsNameByIndex(statisticsValidIndex),
            datasets: [
              {
                label: 'P',
                data: this.GetMacrosSplitByMeal(
                  'protein',
                  statisticsValidIndex
                ),
                borderColor: 'black',
                borderWidth: 1,
                backgroundColor: 'RGB(242, 58, 65)',
              },
              {
                label: 'C',
                data: this.GetMacrosSplitByMeal(
                  'carbohydrates',
                  statisticsValidIndex
                ),
                borderColor: 'black',
                borderWidth: 1,
                backgroundColor: 'RGB(38, 65, 240)',
              },
              {
                label: 'F',
                data: this.GetMacrosSplitByMeal('fats', statisticsValidIndex),
                borderColor: 'black',
                borderWidth: 1,
                backgroundColor: 'RGB(242, 232, 36)',
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
        })
      );
  }
  GetMacrosSplitByMeal(macro: string, statisticsValidIndex: number): any {
    const macroValues = [];

    this.statisticsData[statisticsValidIndex].meals.forEach((m) => {
      macroValues.push(m[macro]);
    });
    return macroValues;
  }
  GetMealsNameByIndex(statisticsValidIndex: number): unknown[] {
    const meals = [];
    this.statisticsData[statisticsValidIndex].meals.forEach((m) => {
      meals.push(m.name);
    });
    return meals;
  }

  DestroyCharts() {
    this.pieCharts.forEach((e) => {
      e.destroy();
    });
    this.pieCharts = [];
    this.lineCharts.forEach((e) => {
      e.destroy();
    });
    this.lineCharts = [];
  }

  createPieCharts() {
    var index = 0;
    this.pieChartsElementRef.forEach((e) => {
      this.createPieChart(e, index);
      index++;
    });
  }

  createLineCharts() {
    var index = 0;
    this.lineChartsElementRef.forEach((e) => {
      this.createLineChart(e, index);
      index++;
    });
  }

  async GetStatistics() {
    (
      await this.statisticsService.GetStatistics(
        this.datePipe.transform(this.minDate, 'yyyy-MM-dd'),
        this.datePipe.transform(this.maxDate, 'yyyy-MM-dd')
      )
    ).subscribe((rez) => {
      this.statisticsData = rez;
      this.DestroyCharts();
      setTimeout(() => {
        this.createPieCharts();
        this.createLineCharts();
      }, 200);
    });
  }

  public GetTotalMacros(index: number) {
    return (
      this.statisticsData[index].totalProtein +
      this.statisticsData[index].totalFat +
      this.statisticsData[index].totalCarbohydrate
    );
  }

  IndexValidStatistics(index: number) {
    var validIndex = 0;
    for (let e of this.statisticsData) {
      if (e.totalCalories != 0) {
        if (index == 0) {
          return validIndex;
        }
        index--;
      }
      validIndex++;
    }
    return -1;
  }
}
