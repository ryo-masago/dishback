import {DishCard} from "./components/DishCard";
import type {Dish} from "./types/Dish";
import "./App.css";
import {useEffect, useState} from "react";
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

  const [dishes, setDishes] = useState<Dish[]>(() => {
    try {
      const savedDishes = localStorage.getItem("dishback-dishes"); // Ask the browser whether it has any data stored under the key "dishback-dishes".

      if (savedDishes === null) {
        return initialDishes; // Use the sample dishes if nothing is saved.
      }

      const parsedDishes: unknown = JSON.parse(savedDishes); // Convert string back into JavaScript data.

      if (!Array.isArray(parsedDishes)) {
        return initialDishes;
      }

      return parsedDishes as Dish[];
    } catch (error) { // Handle unexpected errors.
      console.error("Failed to load saved dishes:", error);
      return initialDishes;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem( // Convert the current dishes array into JSON and save it.
        "dishback-dishes", JSON.stringify(dishes)
      );
    } catch (error) {
      console.error("Failed to save dishes:", error);
    }
  }, [dishes]); // Rerun the effect when the dishes state changes.

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const categories = [...new Set(dishes.map((dish) => dish.category))]; // new Set() removes duplicates.

  const filteredDishes = dishes.filter((dish) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = dish.name.toLowerCase().includes(query) || dish.notes.toLowerCase().includes(query);
    const matchesCategory = selectedCategory === "All" || dish.category === selectedCategory;
    const matchesFavorite = !favoritesOnly || dish.favorite;

    return (
      matchesSearch && matchesCategory && matchesFavorite
    );
  });

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

  function handleToggleFavorite(id: string) {
    setDishes((currentDishes) =>
      currentDishes.map((dish) =>
        dish.id === id // Find dish by its ID.
          ? {...dish, favorite: !dish.favorite} // Spread operator copies the dish's existing properties. Overwrite favorite with its opposite value.
          : dish // Keep the other dishes unchanged.
      )
    );
  }

  function handleAddServing(id: string, date: string) {
    setDishes((currentDishes) =>
      currentDishes.map((dish) =>
        dish.id === id
          ? {...dish, servedDates: [...dish.servedDates, date]} // Create a new array containing the previous dates plus the new date.
          : dish
      )
    );
  }

  function handleDeleteDish(id: string) {
    const dishToDelete = dishes.find((dish) => dish.id === id);

    if (!dishToDelete) return;
    const confirmed = window.confirm(`Are you sure you want to delete "${dishToDelete.name}"?`); // window.confirm() displays a browser confirmation dialog.

    if (!confirmed) return;
    setDishes((currentDishes) => currentDishes.filter((dish) => dish.id !== id)); // Updates the dishes state with a new array excluding the dish to delete.
  }

  function handleClearFilters() {
    setSearchQuery("");
    setSelectedCategory("All");
    setFavoritesOnly(false);
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

      <section className = "dish-filters">
        <h2>Find a Dish</h2>
        <div className = "filter-controls">
          <div className = "filter-field">
            <label htmlFor = "dish-search">Search Dishes</label>
            <input
              id = "dish-search"
              type = "search"
              placeholder = "Search by name or notes..."
              value = {searchQuery}
              onChange = {(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className = "filter-field">
            <label htmlFor = "category-filter">Category</label>
            <select
            id = "category-filter"
            value = {selectedCategory}
            onChange = {(e) => setSelectedCategory(e.target.value)}
            >
              <option value = "All">All Categories</option>

              {categories.map((category) => (
                <option key = {category} value = {category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        <label className = "favorites-filter">
          <input
            type = "checkbox"
            checked = {favoritesOnly} // Checkboxes represent an on/off state.
            onChange = {(e) => setFavoritesOnly(e.target.checked)} // Gives a boolean true or false instead of a string.
          />
          Show Favorites Only
        </label>
        <div className = "filter-footer">
          <p className = "results-count">Showing {filteredDishes.length} of {dishes.length} dishes</p>
          <button
            type = "button"
            className = "clear-button"
            onClick = {handleClearFilters}
            disabled = {
              searchQuery === "" && selectedCategory === "All" && !favoritesOnly // Disable button when there are no active filters.
            }
          >
            Clear Filters
          </button>
        </div>
      </section>

      <section className = "dish-grid">
        {filteredDishes.map((dish) => (
          <DishCard
            key = {dish.id}
            dish = {dish}
            onToggleFavorite = {handleToggleFavorite}
            onAddServing = {handleAddServing}
            onDeleteDish = {handleDeleteDish}
            />
        ))}
      </section>

      {filteredDishes.length === 0 && (
        <p className = "empty-message">No dishes found. Try changing your search or filters.</p>
      )}
    </main>
  );
}

export default App;
