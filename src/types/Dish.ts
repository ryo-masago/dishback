export type Dish = {
  id: string;
  name: string;
  category: string;
  notes: string;
  servedDates: string[];
  favorite: boolean;
  imageUrl: string;
}

export type DishEdit = Pick<Dish, "name" | "category" | "notes">; // Create new type using selected properties from an existing type.
