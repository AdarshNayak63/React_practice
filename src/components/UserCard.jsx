import { Link } from "react-router-dom";

function UserCard({ user }) {
  return (
    <div className="card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>

      <Link to={`/user/${user.id}`}>
        <button className="button">View Profile</button>
      </Link>
    </div>
  );
}

export default UserCard;