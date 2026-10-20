import {DishCard} from "./components/DishCard";
import type {Dish} from "./types/Dish";
import "./App.css";
import {useState} from "react";
import type {FormEvent} from "react";

const initialDishes: Dish[] = [
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
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Japanese");
  const [notes, setNotes] = useState("");
  const [servedDate, setServedDate] = useState("");

  const [dishes, setDishes] = useState<Dish[]>(initialDishes);

  function handleAddDish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) return;

    const newDish: Dish = {
      id: crypto.randomUUID(), // Generates a unique ID for each dish.
      name: name.trim(),
      category,
      notes: notes.trim(),
      servedDates: servedDate ? [servedDate] : [], // If the user selected a date, create an array containing that date. Otherwise, create an empty array.
      favorite: false
    };

    // Create a new array containing the new dish followed by all existing dishes.
    setDishes((currentDishes) => [
      newDish,
      ...currentDishes
    ]);

    // After successfully adding a dish, the form resets so you can enter another one.
    setName("");
    setCategory("Japanese");
    setNotes("");
    setServedDate("");
  }

  return (
    <main className = "app">
      <h1>Dishback</h1>
      <p>Mom's homemade food journal</p>

      <form className = "dish-form" onSubmit = {handleAddDish}>
        <h2>Add a new dish</h2>

        <label htmlFor = "dish-name">Dish Name</label>
        <input
          id = "dish-name"
          type="text"
          value = {name}
          onChange = {(e) => setName(e.target.value)}
          placeholder = "e.g. 唐揚げ"
          required
        />

        <label htmlFor = "dish-category">Category</label>
        <select
          id = "dish-category"
          value = {category}
          onChange = {(e) => setCategory(e.target.value)}
        >
          <option value = "Japanese">Japanese</option>
          <option value = "Western">Western</option>
          <option value = "Chinese">Chinese</option>
          <option value = "Korean">Korean</option>
          <option value = "Others">Others</option>
        </select>

        <label htmlFor = "dish-notes">Notes</label>
        <textarea
          id = "dish-notes"
          value = {notes}
          onChange = {(e) => setNotes(e.target.value)}
          placeholder = "What made this dish memorable?"
        />

        <label htmlFor = "dish-date">Date Served</label>
        <input
          id = "dish-date"
          type = "date"
          value = {servedDate}
          onChange = {(e) => setServedDate(e.target.value)}
        />

        <button type = "submit">Add Dish</button>
      </form>

      <section className = "dish-grid">
        {dishes.map((dish) => (
          <DishCard key = {dish.id} dish = {dish}/>
        ))}
      </section>
    </main>
  );
}

export default App;
