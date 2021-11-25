import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';
import { FoodItemRejectionStatus } from 'src/app/Enums/FoodItemRejectionStatus.enum';
import { FoodItem } from 'src/app/Models/FoodItem';
import { FoodItemSuggestion } from 'src/app/Models/FoodItemSuggestion';

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
  @Output() aprovedItemEvent: EventEmitter<FoodItemSuggestion> =
    new EventEmitter<FoodItemSuggestion>();
  @Output() rejectedItemEvent: EventEmitter<FoodItemSuggestion> =
    new EventEmitter<FoodItemSuggestion>();

  public FoodItemRejectionStatus = FoodItemRejectionStatus;

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

  GetItemStyle(item) {
    return item.status == FoodItemRejectionStatus.Rejected
      ? { 'background-color': '#FF7F7F' }
      : item.status == FoodItemRejectionStatus.Approved
      ? { 'background-color': '#90EE90' }
      : {};
  }
}
