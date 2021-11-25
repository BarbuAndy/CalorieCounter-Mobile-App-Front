import { FoodItemRejectionStatus } from '../Enums/FoodItemRejectionStatus.enum';
import { FoodItem } from './FoodItem';

export class FoodItemSuggestion extends FoodItem {
  public status: FoodItemRejectionStatus;
}
