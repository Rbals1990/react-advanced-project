import "./App.css";
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import { RouterProvider } from "react-router/dom";

//Components
import EventList, { eventLoader } from "./components/EventList";
import AddEvent from "./components/AddEvent";
import NotFound from "./components/NotFound";
import DetailedEvent, { eventDetailsLoader } from "./components/DetailedEvent";
import EditEvent, { editEventLoader } from "./components/EditEvent";

//Layouts
import RootLayout from "./layouts/RootLayout";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<EventList />} loader={eventLoader} />
      <Route path="addevent" element={<AddEvent />} />
      <Route
        path=":id"
        element={<DetailedEvent />}
        loader={eventDetailsLoader}
      />
      <Route
        path="/edit-event/:id"
        element={<EditEvent />}
        loader={editEventLoader}
      />

      <Route path="*" element={<NotFound />} />
    </Route>
  )
);
function App() {
  return <RouterProvider router={router} />;
}
export default App;
