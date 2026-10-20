import type {Dish} from "../types/Dish"

type DishCardProps = {
  dish: Dish;
}

export function DishCard({dish}: DishCardProps) {
  return (
    <article className = "dish-card">
      <h2>{dish.name}</h2>
      <p>Category: {dish.category}</p>
      <p>{dish.notes}</p>
      <p>{dish.favorite ? "❤️ Favorite" : "🤍"}</p>
      <p>Served {dish.servedDates.length} times</p>
      <ul>
        {dish.servedDates.map((date, index) => (
          <li key = {`${date}-${index}`}>{date}</li>
        ))}
      </ul>
    </article>
  );
}
