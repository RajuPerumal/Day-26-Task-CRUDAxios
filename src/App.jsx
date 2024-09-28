import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com/users";

export const App = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    website: "",
    address: {
      street: "",
      suite: "",
      city: "",
      zipcode: "",
    },
    id: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setCurrentUser({
        ...currentUser,
        address: { ...currentUser.address, [addressField]: value },
      });
    } else {
      setCurrentUser({ ...currentUser, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await updateUser(currentUser);
    } else {
      await addUser(currentUser);
    }
    resetForm();
    setModalVisible(false);
  };

  const addUser = async (user) => {
    try {
      const response = await axios.post(API_URL, user);
      setUsers([...users, response.data]);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const updateUser = async (user) => {
    try {
      const response = await axios.put(`${API_URL}/${user.id}`, user);
      const updatedUsers = users.map((u) => (u.id === user.id ? response.data : u));
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const editUser = (user) => {
    setCurrentUser(user);
    setIsEditing(true);
    setModalVisible(true);
  };

  const resetForm = () => {
    setCurrentUser({
      name: "",
      username: "",
      email: "",
      phone: "",
      website: "",
      address: {
        street: "",
        suite: "",
        city: "",
        zipcode: "",
      },
      id: null,
    });
    setIsEditing(false);
  };

  const openModal = () => {
    resetForm();
    setModalVisible(true);
  };

  return (
    <div id="webcrumbs" className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-body">
          <h1 className="card-title text-center mb-4">Users Information</h1>
          <button className="btn btn-primary mb-4" onClick={openModal}>
            Add User
          </button>
          <div className="row">
            {users.map((user) => (
              <div key={user.id} className="col-md-6 mb-4">
                <div className="card border-0">
                  <div className="card-body bg-light rounded">
                    <h2 className="card-title">Name: {user.name}</h2>
                    <p className="mb-1"><strong>Username:</strong> {user.username}</p>
                    <p className="mb-1"><strong>Email:</strong> {user.email}</p>
                    <p className="mb-1"><strong>Phone:</strong> {user.phone}</p>
                    <p className="mb-1"><strong>Website:</strong> {user.website}</p>
                    <p className="mb-1"><strong>Address:</strong> {user.address.street}, {user.address.suite}, {user.address.city}, {user.address.zipcode}</p>
                    <div className="d-flex justify-content-end gap-2 mt-4">
                      <button className="btn btn-primary" onClick={() => editUser(user)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => deleteUser(user.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for Adding/Editing User */}
      <div className={`modal fade ${modalVisible ? 'show' : ''}`} style={{ display: modalVisible ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{isEditing ? "Edit User" : "Add User"}</h5>
              <button type="button" className="btn-close" onClick={() => setModalVisible(false)} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={currentUser.name}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                  required
                />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={currentUser.username}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={currentUser.email}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                  required
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={currentUser.phone}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                  required
                />
                <input
                  type="text"
                  name="website"
                  placeholder="Website"
                  value={currentUser.website}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                  required
                />
                <h5>Address:</h5>
                <input
                  type="text"
                  name="address.street"
                  placeholder="Street"
                  value={currentUser.address.street}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                  required
                />
                <input
                  type="text"
                  name="address.suite"
                  placeholder="Suite"
                  value={currentUser.address.suite}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                  required
                />
                <input
                  type="text"
                  name="address.city"
                  placeholder="City"
                  value={currentUser.address.city}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                  required
                />
                <input
                  type="text"
                  name="address.zipcode"
                  placeholder="Zipcode"
                  value={currentUser.address.zipcode}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                  required
                />
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    {isEditing ? "Update User" : "Save User"}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setModalVisible(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
