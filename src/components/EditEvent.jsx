import { useState, useEffect } from "react";
import { useNavigate, useParams, useLoaderData } from "react-router-dom";

function EditEvent() {
  const { id } = useParams();
  const { event, categories, users } = useLoaderData();
  const navigate = useNavigate();

  // Voorkom dat 'undefined' waarden fouten veroorzaken
  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    image: event?.image || "",
    location: event?.location || "",
    startTime: event?.startTime || "",
    endTime: event?.endTime || "",
    category: event?.categoryIds?.[0] || "", // Voorkomt fout bij lege categoryIds
    createdBy: event?.createdBy || "", // Voorkomt fout bij ontbrekende createdBy
    userImage: event?.createdBy
      ? users.find((user) => user.id === event.createdBy)?.image
      : "", // Bewaar de bestaande userImage
  });

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        navigate("/"); // Terug naar de homepagina na 3 seconden
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Zorg ervoor dat categoryIds een array van getallen is
    const updatedEvent = {
      ...formData,
      categoryIds: [parseInt(formData.category)],
      // We zorgen ervoor dat 'createdBy' en 'userImage' behouden blijven
      createdBy: formData.createdBy || event.createdBy,
      userImage:
        formData.userImage || event.createdBy
          ? users.find((user) => user.id === event.createdBy)?.image
          : "",
    };

    const response = await fetch(`http://localhost:8000/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedEvent),
    });

    if (response.ok) {
      setSuccessMessage("Event was updated successfully!");
    } else {
      console.error("Failed to update event");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="edit-event">
      <h2>Edit Event</h2>
      <form onSubmit={handleSubmit} className="event-form">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label htmlFor="image">Image URL:</label>
        <input
          type="url"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
        />

        <label htmlFor="location">Location:</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <label htmlFor="startTime">Start Time:</label>
        <input
          type="datetime-local"
          id="startTime"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          required
        />

        <label htmlFor="endTime">End Time:</label>
        <input
          type="datetime-local"
          id="endTime"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          required
        />

        <label htmlFor="category">Category:</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <button type="submit" className="submit-button">
          Update Event
        </button>

        {/* Succesmelding onder de knop */}
        {successMessage && (
          <div className="success-message">
            <p>{successMessage}</p>
          </div>
        )}
      </form>
    </div>
  );
}

export default EditEvent;

// Loader function
export const editEventLoader = async ({ params }) => {
  const { id } = params;

  const [eventRes, categoryRes, userRes] = await Promise.all([
    fetch(`http://localhost:8000/events/${id}`),
    fetch("http://localhost:8000/categories"),
    fetch("http://localhost:8000/users"),
  ]);

  if (!eventRes.ok || !categoryRes.ok || !userRes.ok) {
    throw new Error("Failed to fetch event, categories, or users");
  }

  const event = await eventRes.json();
  const categories = await categoryRes.json();
  const users = await userRes.json();

  return { event, categories, users };
};
