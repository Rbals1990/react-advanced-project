import { useState } from "react";
import { useNavigate } from "react-router";

function AddEvent() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    location: "",
    startTime: "",
    endTime: "",
    creator: "",
    creatorImage: "",
    category: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const DEFAULT_USER_IMAGE =
    "https://cdn.pixabay.com/photo/2017/07/18/23/40/group-2517459_1280.png";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validatie
    if (
      !formData.title ||
      !formData.description ||
      !formData.location ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.creator ||
      !formData.category
    ) {
      setError("All fields except creator image are required.");
      return;
    }

    // Ophalen van bestaande gebruikers
    const usersRes = await fetch("http://localhost:8000/users");
    const users = await usersRes.json();

    // Check of de gebruiker al bestaat of maak een nieuwe gebruiker aan
    let user = users.find((user) => user.name === formData.creator);
    let userId = user?.id;
    let userImage = user?.image || DEFAULT_USER_IMAGE;

    if (!userId) {
      // Voeg een nieuwe gebruiker toe
      userId = users.length + 1;
      userImage = formData.creatorImage || DEFAULT_USER_IMAGE;

      await fetch("http://localhost:8000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          name: formData.creator,
          image: userImage,
        }),
      });
    } else if (formData.creatorImage) {
      // Gebruik de ingevoerde afbeelding als deze is opgegeven
      userImage = formData.creatorImage;
    }

    // Voeg het nieuwe event toe
    const newEvent = {
      createdBy: userId,
      title: formData.title,
      description: formData.description,
      image: formData.image,
      location: formData.location,
      startTime: formData.startTime,
      endTime: formData.endTime,
      categoryIds: [Number(formData.category)],
    };

    await fetch("http://localhost:8000/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    });

    // Redirect naar de homepagina
    navigate("/");
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="add-event">
      <h1>Add a New Event</h1>
      <form className="event-form" onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={formData.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Event Description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          type="url"
          name="image"
          placeholder="Image URL (for the event)"
          value={formData.image}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Event Location"
          value={formData.location}
          onChange={handleChange}
        />
        <input
          type="datetime-local"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
        />
        <input
          type="datetime-local"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
        />
        <input
          type="text"
          name="creator"
          placeholder="Your Name"
          value={formData.creator}
          onChange={handleChange}
        />
        <input
          type="url"
          name="creatorImage"
          placeholder="Your Image URL (optional)"
          value={formData.creatorImage}
          onChange={handleChange}
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="">Select a Category</option>
          <option value="1">Sports</option>
          <option value="2">Games</option>
          <option value="3">Relaxation</option>
        </select>
        <div className="form-buttons">
          <button type="submit">Add Event</button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddEvent;
