export interface RecipeStep {
  instruction: string;
  image: string[];
}

export interface Recipe {
  title: string;
  mainImage: string;
  calories: number; // calories per serving
  totalCalories: number; // total calories for all servings
  duration: number; // cooking time in minutes
  prepTime: number; // preparation time in minutes
  servings: number; // number of servings
  usedMaterial: string[];
  unusedMaterial: string[];
  missingMaterial: string[];
  material: string[];
  description: string;
  step: RecipeStep[];
}

export interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  showDetails: boolean;
  onShowDetailsChange: (show: boolean) => void;
}

export interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
} 