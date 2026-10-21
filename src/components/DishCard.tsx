import type {Dish, DishEdit} from "../types/Dish"
import {useState} from "react";
import type {FormEvent} from "react";

type DishCardProps = {
  dish: Dish;
  onToggleFavorite: (id: string) => void; // A function that accepts a string ID and doesn't return a meaningful value.
  onAddServing: (id: string, date: string) => void; // New function accepts two arguments.
  onDeleteDish: (id: string) => void;
  onEditDish: (id: string, updates: DishEdit) => void;
};

export function DishCard({dish, onToggleFavorite, onAddServing, onDeleteDish, onEditDish}: DishCardProps) {
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
