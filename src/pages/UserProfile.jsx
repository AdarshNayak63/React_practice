import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, [id]);

  if (!user) return <h2 className="title">Loading...</h2>;

  return (
    <div className="container">
      <div className="profile">
        <h1>{user.name}</h1>
        <p style={{ textAlign: "center", color: "#777" }}>
          @{user.username}
        </p>

        <h3>Contact Info</h3>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Phone:</b> {user.phone}</p>
        <p><b>Website:</b> {user.website}</p>

        <h3>Address</h3>
        <p>
          {user.address.street}, {user.address.suite}, {user.address.city}
        </p>

        <h3>Company</h3>
        <p><b>Name:</b> {user.company.name}</p>
        <p><b>Catchphrase:</b> {user.company.catchPhrase}</p>

        <Link to="/" className="back-link">⬅ Back</Link>
      </div>
    </div>
  );
}

export default UserProfile;