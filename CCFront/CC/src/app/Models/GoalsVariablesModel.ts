export class GoalsVariables {
  public activityLevels: ActivityLevel[];
  public goals: Goal[];
  public prefferedDiets: PrefferedDiet[];
}

export class ActivityLevel {
  public activityLevelId: number;
  public description: string;
}

export class Goal {
  public goalId: number;
  public description: string;
}

export class PrefferedDiet {
  public prefferedDietId: number;
  public description: string;
  public carbohydratePercentage: number;
  public fatsPercentage: number;
  public proteinPercentage: number;
}
