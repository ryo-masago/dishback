import type {Dish} from "../types/Dish"
import {useState} from "react";
import type {FormEvent} from "react";

type DishCardProps = {
  dish: Dish;
  onToggleFavorite: (id: string) => void; // A function that accepts a string ID and doesn't return a meaningful value.
  onAddServing: (id: string, date: string) => void; // New function accepts two arguments.
};

export function DishCard({dish, onToggleFavorite, onAddServing}: DishCardProps) {
  const [servingDate, setServingDate] = useState("");

  function handleServingSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault(); // Prevent the form from refreshing the page.

    if (!servingDate) return; // Check that a date has been selected.

    onAddServing(dish.id, servingDate); // Call onAddServing with the dish's ID and the selected date.

    setServingDate(""); // Reset the date input.
  }

  return (
    <article className = "dish-card">
      <h2>{dish.name}</h2>
      <p>Category: {dish.category}</p>
      <p>{dish.notes}</p>
      <button
        type = "button"
        className = "favorite-button"
        onClick = {() => onToggleFavorite(dish.id)} // When the button is clicked, call onToggleFavorite and pass in the current dish's ID.
        aria-pressed = {dish.favorite} // Tells assistive technology whether the toggle button is currently active.
        aria-label = {`Favorite ${dish.name}`}
      >
        {dish.favorite ? "❤️" : "🤍"}
      </button>
      <p>Served {dish.servedDates.length} times</p>
      <ul>
        {[...dish.servedDates] // Spread operator (...) copies serving dates into a new array. React state should not be mutated directly.
          .sort((a, b) => b.localeCompare(a)) // a.localeCompare(b) => oldest first // b.localeCompare(a) => newest first.
          .map((date, index) => (
          <li key = {`${date}-${index}`}>{date}</li>
        ))}
      </ul>
      <form
        className = "serving-form"
        onSubmit = {handleServingSubmit}
      >
        <label htmlFor = {`serving-date-${dish.id}`}>Log Another Serving</label>
        <div className = "serving-controls">
          <input
          id = {`serving-date-${dish.id}`}
          type = "date"
          value = {servingDate}
          onChange = {(e) => setServingDate(e.target.value)}
          required
        />

        <button type = "submit">Add Date</button>
        </div>
      </form>
    </article>
  );
}
