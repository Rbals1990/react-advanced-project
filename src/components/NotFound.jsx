import { Link } from "react-router";

export default function NotFound() {
  return (
    <div>
      <h2>Oops.... Page was not found!</h2>
      <p>
        Go to the <Link to="/">Homepage</Link>
      </p>
    </div>
  );
}
