import { Component, Input, OnInit } from '@angular/core';
import { FoodItem } from 'src/app/Models/FoodItem';

@Component({
  selector: 'app-food-item-display',
  templateUrl: './food-item-display.component.html',
  styleUrls: ['./food-item-display.component.scss'],
})
export class FoodItemDisplayComponent implements OnInit {
  @Input() foodItem: FoodItem;
  constructor() {}

  ngOnInit() {}
}
