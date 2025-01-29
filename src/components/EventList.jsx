import { useLoaderData, Link } from "react-router";
import { useState } from "react";

function EventList() {
  const { events, categories } = useLoaderData(); // Haal zowel events als categories op
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Filter evenementen op basis van zoekterm en categorie
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || event.categoryIds.includes(Number(selectedCategory));
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Zoekveld en categorie filter */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Gefilterde evenementenlijst */}
      <div className="eventlist">
        {filteredEvents.map((event) => {
          const startTime = new Date(event.startTime);
          const endTime = new Date(event.endTime);
          const formattedStartTime = startTime.toLocaleString();
          const formattedEndTime = endTime.toLocaleString();

          return (
            <Link to={event.id.toString()} key={event.id}>
              <p>
                <strong>{event.title}</strong>
              </p>
              <p>{event.description}</p>
              <img
                className="event-image"
                src={event.image}
                alt={event.title}
              />
              <p>
                <strong>Starts at: </strong>
                {formattedStartTime}
              </p>
              <p>
                <strong>Ends at: </strong>
                {formattedEndTime}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default EventList;

// Loader function
export const eventLoader = async () => {
  const eventsRes = await fetch("http://localhost:8000/events");
  const categoriesRes = await fetch("http://localhost:8000/categories");

  const events = await eventsRes.json();
  const categories = await categoriesRes.json();

  return { events, categories }; // Retourneer zowel events als categories
};
