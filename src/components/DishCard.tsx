import type {Dish} from "../types/Dish"

type DishCardProps = {
  dish: Dish;
  onToggleFavorite: (id: string) => void; // A function that accepts a string ID and doesn't return a meaningful value.
}

export function DishCard({dish, onToggleFavorite}: DishCardProps) {
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
        {dish.servedDates.map((date, index) => (
          <li key = {`${date}-${index}`}>{date}</li>
        ))}
      </ul>
    </article>
  );
}
