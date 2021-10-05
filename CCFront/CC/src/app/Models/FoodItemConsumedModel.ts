import { FoodItemConsumedService } from '../Services/foodItemConsumed-service/food-item-consumed.service';
import { Account } from './AccountModels';
import { FoodItem } from './FoodItem';

export class FoodItemConsumed {
  public foodItemConsumedId: number;
  public foodItemId: number;
  public userId: number;
  public quantity: number;
  public dateTime: Date;
  public meal: string;
  public foodItem?: FoodItem;
  public user?: Account;
}
