import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';
import { FoodItem } from 'src/app/Models/FoodItem';

@Component({
  selector: 'app-infinite-food-item-list',
  templateUrl: './infinite-food-item-list.component.html',
  styleUrls: ['./infinite-food-item-list.component.scss'],
})
export class InfiniteFoodItemListComponent implements OnInit, OnChanges {
  @Input() foodItems: FoodItem[] = [];
  @Input() height: string = '200px';
  @Input() approveRejectFunction: boolean = false;
  @Output() selectedItemEvent: EventEmitter<FoodItem> =
    new EventEmitter<FoodItem>();
  @Output() aprovedItemEvent: EventEmitter<FoodItem> =
    new EventEmitter<FoodItem>();
  @Output() rejectedItemEvent: EventEmitter<FoodItem> =
    new EventEmitter<FoodItem>();
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit() {}

  EmitFoodItemSelected($event) {
    this.selectedItemEvent.emit($event);
  }

  EmitFoodItemRejected($event) {
    this.rejectedItemEvent.emit($event);
  }

  EmitFoodItemApproved($event) {
    this.aprovedItemEvent.emit($event);
  }
}
