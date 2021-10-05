export class FoodItem {
  public foodItemId: number;
  public name: string;
  public calories: number;
  public protein: number;
  public carbohydrates: number;
  public fats: number;
  public note: string;
  public code?: string;
  public timesFlaggedWrong?: number;
  public published?: boolean;
}
