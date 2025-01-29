import { useLoaderData, useNavigate, useParams } from "react-router";
import { useState } from "react";

function DetailedEvent() {
  const { id } = useParams();
  const { event, users, categories } = useLoaderData();
  const navigate = useNavigate();

  const user = users.find((user) => user.id === event.createdBy);

  // Zorg ervoor dat de categorieën correct gefilterd worden
  const eventCategories = categories.filter((category) =>
    event.categoryIds.includes(category.id)
  );

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:8000/events/${event.id}`, {
        method: "DELETE",
      });
      setShowDeleteMessage(true);
      setTimeout(() => {
        setShowDeleteMessage(false);
        navigate("/"); // Terug naar de homepagina
      }, 3000); // Melding tonen voor 3 seconden
    } catch (error) {
      // Verwijder console.log in productie, je kunt hier eventueel een gebruikersvriendelijke foutmelding tonen.
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="event-details">
      {showDeleteMessage && (
        <div className="delete-message">Event successfully deleted!</div>
      )}

      {!showConfirmation ? (
        <>
          <img className="event-image" src={event.image} alt={event.title} />
          <h2>Event details for: {event.title}</h2>
          <p>Description: {event.description}</p>
          <p>Start time: {new Date(event.startTime).toLocaleString()}</p>
          <p>End time: {new Date(event.endTime).toLocaleString()}</p>

          <p>
            Categories:{" "}
            {eventCategories.length > 0
              ? eventCategories.map((category) => category.name).join(", ")
              : "Unknown"}
          </p>

          <p>Created by: {user ? user.name : "Unknown"}</p>
          {user && (
            <img className="user-image" src={user.image} alt={user.name} />
          )}

          <div className="detail-buttons">
            <button className="detail-button" onClick={() => navigate("/")}>
              Back
            </button>
            <button
              className="detail-button"
              onClick={() => navigate(`/edit-event/${event.id}`)}
            >
              Edit event
            </button>
            <button
              className="delete-button"
              onClick={() => setShowConfirmation(true)}
            >
              Delete event
            </button>
          </div>
        </>
      ) : (
        <div className="confirmation-dialog">
          <p>Are you sure you want to delete this event?</p>
          <div className="confirmation-buttons">
            <button className="confirm-button" onClick={handleDelete}>
              Yes
            </button>
            <button className="cancel-button" onClick={handleCancelDelete}>
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailedEvent;

// Loader function
export const eventDetailsLoader = async ({ params }) => {
  const { id } = params;

  const [eventRes, userRes, categoryRes] = await Promise.all([
    fetch(`http://localhost:8000/events/${id}`),
    fetch("http://localhost:8000/users"),
    fetch("http://localhost:8000/categories"),
  ]);

  if (!eventRes.ok || !userRes.ok || !categoryRes.ok) {
    throw new Error("Failed to fetch data");
  }

  const event = await eventRes.json();
  const users = await userRes.json();
  const categories = await categoryRes.json();

  return { event, users, categories };
};
