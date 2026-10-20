import {DishCard} from "./components/DishCard";
import type {Dish} from "./types/Dish";
import "./App.css";

const dishes: Dish[] = [
  {
    id: "1",
    name: "唐揚げ",
    category: "Japanese",
    notes: "Mom's homemade fried chicken. Extra crispy!",
    servedDates: [
      "2026-01-15",
      "2026-05-20",
      "2026-10-20"
    ],
    favorite: true,
  },
  {
    id: "2",
    name: "肉じゃが",
    category: "Japanese",
    notes: "Perfect comfort food.",
    servedDates: [
      "2026-02-26",
      "2026-04-01",
    ],
    favorite: true,
  },
  {
    id: "3",
    name: "オムライス",
    category: "Western",
    notes: "Love the fluffy eggs!",
    servedDates: ["2026-09-04"],
    favorite: false,
  },
  {
    id: "4",
    name: "レンコン天ぷら",
    category: "Japanese",
    notes: "One of my all-time favorites!",
    servedDates: [
      "2025-12-28",
      "2026-04-10",
      "2026-10-20"
    ],
    favorite: true,
  }
];

function App() {
  return (
    <main className = "app">
      <h1>Dishback</h1>
      <p>Mom's homemade food journal</p>

      <section className = "dish-grid">
        {dishes.map((dish) => (
          <DishCard key = {dish.id} dish = {dish}/>
        ))}
      </section>
    </main>
  );
}

export default App;
