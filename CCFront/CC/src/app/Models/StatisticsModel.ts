export class Statistics {
  public usedId: number;
  public date: Date;
  public totalCalories: number;
  public totalProtein: number;
  public totalCarbohydrate: number;
  public totalFat: number;
  public meals: Meal[];
}

export class Meal {
  public name: string;
  public calories: number;
  public protein: number;
  public carbohydrates: number;
  public fats: number;
}
