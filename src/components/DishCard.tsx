import type {Dish, DishEdit} from "../types/Dish"
import {useState} from "react";
import type {FormEvent} from "react";

type DishCardProps = {
  dish: Dish;
  onToggleFavorite: (id: string) => void; // A function that accepts a string ID and doesn't return a meaningful value.
  onAddServing: (id: string, date: string) => void; // New function accepts two arguments.
  onDeleteDish: (id: string) => void;
  onEditDish: (id: string, updates: DishEdit) => void;
  onDeleteServing: (dishId: string, servingIndex: number) => void;
};

export function DishCard({dish, onToggleFavorite, onAddServing, onDeleteDish, onEditDish, onDeleteServing}: DishCardProps) {
  const [servingDate, setServingDate] = useState("");

  const [isEditing, setIsEditing] = useState(false); // Controls whether the editing form is visible.
  const [editedName, setEditedName] = useState(dish.name);
  const [editedCategory, setEditedCategory] = useState(dish.category);
  const [editedNotes, setEditedNotes] = useState(dish.notes);

  function handleServingSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault(); // Prevent the form from refreshing the page.

    if (!servingDate) return; // Check that a date has been selected.

    onAddServing(dish.id, servingDate); // Call onAddServing with the dish's ID and the selected date.

    setServingDate(""); // Reset the date input.
  }

  function handleStartEdit() {
    setEditedName(dish.name);
    setEditedCategory(dish.category);
    setEditedNotes(dish.notes);

    setIsEditing(true);
  }

  function handleEditSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!editedName.trim() || !editedCategory.trim()) {
      return;
    }

    const updates: DishEdit = {
      name: editedName.trim(),
      category: editedCategory.trim(),
      notes: editedNotes.trim()
    };

    onEditDish(dish.id, updates);

    setIsEditing(false);
  }

  function handleRemoveServing(
    index: number,
    date: string
  ) {
    const confirmed = window.confirm(`Remove the serving recorded on ${date}?`);

    if (!confirmed) return;

    onDeleteServing(dish.id, index);
  }

  const sortedServings = dish.servedDates.map((date, originalIndex) => ({
    date,
    originalIndex,
  })).sort((a, b) => b.date.localeCompare(a.date));

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
      {!isEditing && ( // If isEditing is false, the edit button is visible.
        <button
          type = "button"
          className = "edit-button"
          onClick = {handleStartEdit}
        >
          Edit Details
        </button>
      )}

      {isEditing && ( // If isEditing is true, the button disappears and the editing form becomes visible.
        <form
          className = "edit-form"
          onSubmit = {handleEditSubmit}
        >
          <h3>Edit Dish</h3>
          <label htmlFor = {`edit-name-${dish.id}`}>
            Dish Name
          </label>
          <input
            id = {`edit-name-${dish.id}`}
            type = "text"
            value = {editedName}
            onChange = {(e) => setEditedName(e.target.value)}
            required
          />

          <label htmlFor = {`edit-category-${dish.id}`}>
            Category
          </label>
          <input
            id = {`edit-category-${dish.id}`}
            type = "text"
            value = {editedCategory}
            onChange = {(e) => setEditedCategory(e.target.value)}
            required
          />

          <label htmlFor = {`edit-notes-${dish.id}`}>
            Notes
          </label>
          <textarea
            id = {`edit-notes-${dish.id}`}
            value = {editedNotes}
            onChange = {(e) => setEditedNotes(e.target.value)}
            rows = {3}
          />

          <div className = "edit-actions">
            <button type = "submit" className = "save-button">
              Save Changes
            </button>

            <button
              type = "button"
              className = "cancel-button"
              onClick = {() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <p>
        Served {dish.servedDates.length}{" "}
        {dish.servedDates.length === 1 ? "time" : "times"}
      </p>
      {sortedServings.length === 0 ? (
        <p>No serving dates recorded yet.</p>
      ) : (
        <ul className = "serving-history">
          {sortedServings.map(({date, originalIndex}) => (
            <li key = {originalIndex}>
              <span>{date}</span>
              <button
                type = "button"
                className = "remove-serving-button"
                onClick = {() => handleRemoveServing(originalIndex, date)}
                aria-label = {`Remove serving on ${date}`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
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
      <button
        type = "button"
        className = "delete-button"
        onClick = {() => onDeleteDish(dish.id)}
      >
        Delete Dish
      </button>
    </article>
  );
}
