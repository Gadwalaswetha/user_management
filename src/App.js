import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";
import axios from "axios";
import "./styles.css";

const API_URL = "https://jsonplaceholder.typicode.com/users";

const UserList = ({ users, setUsers }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users.");
    }
  };

  const deleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className="container">
      <h2>User Management</h2>
      {error && <p className="text-danger">{error}</p>}
      <button className="btn btn-primary" onClick={() => navigate("/add")}>
        Add User
      </button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name.split(" ")[0]}</td>
              <td>{user.name.split(" ")[1] || ""}</td>
              <td>{user.email}</td>
              <td>{user.company?.name || "N/A"}</td>
              <td>
                <button
                  className="btn btn-warning"
                  onClick={() => navigate(`/edit/${user.id}`)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const UserForm = ({ users, setUsers, mode }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState({ name: "", email: "", department: "" });

  useEffect(() => {
    if (mode === "edit") {
      const foundUser = users.find((u) => u.id === parseInt(id));
      if (foundUser) {
        setUser({
          name: foundUser.name,
          email: foundUser.email,
          department: foundUser.company?.name || "",
        });
      }
    }
  }, [mode, id, users]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "add") {
      const newUser = {
        id: users.length + 1,
        name: user.name,
        email: user.email,
        company: { name: user.department },
      };
      setUsers([...users, newUser]);
    } else {
      setUsers(
        users.map((u) =>
          u.id === parseInt(id)
            ? {
                ...u,
                name: user.name,
                email: user.email,
                company: { name: user.department },
              }
            : u
        )
      );
    }
    navigate("/");
  };

  return (
    <div className="container">
      <h2>{mode === "add" ? "Add User" : "Edit User"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            className="form-control"
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            className="form-control"
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Department</label>
          <input
            className="form-control"
            type="text"
            value={user.department}
            onChange={(e) => setUser({ ...user, department: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {mode === "add" ? "Add User" : "Update User"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

const App = () => {
  const [users, setUsers] = useState([]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<UserList users={users} setUsers={setUsers} />}
        />
        <Route
          path="/add"
          element={<UserForm mode="add" users={users} setUsers={setUsers} />}
        />
        <Route
          path="/edit/:id"
          element={<UserForm mode="edit" users={users} setUsers={setUsers} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
