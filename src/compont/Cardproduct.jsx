import { useState } from 'react';
import './Cardproduct.css';

export default function MediaCard() {
  const [title, setTitle] = useState("ssssss");
  const [description, setDescription] = useState("ffffff");
  const [qty, setQty] = useState("5");
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    setIsDeleted(true);
  };

  if (isDeleted) {
    return null; // Hide the card if deleted
  }

  return (
    <div className="card">
      <div className="card-media">
        <img
          src="https://wellworthgroup.co/images/BackOffice/resized-images/Client_utility_Login.png"
          alt="green iguana"
          style={{ height: "100px" , width: "100%"}}
        />
      </div>
      <div className="card-content">
        {isEditing ? (
          <>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="text"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-control"
              />
            </div>
          </>
        ) : (
          <>
            <h3 className="card-title">{title}</h3>
            <p className="card-qty">Quantity: {qty}</p>
            <p className="card-description">{description}</p>
          </>
        )}
      </div>
      <div className="card-actions">
        {isEditing ? (
          <button onClick={handleSave} className="btn btn-primary">
            Save
          </button>
        ) : (
          <button onClick={handleEdit} className="btn btn-secondary">
            Edit
          </button>
        )}
        <button onClick={handleDelete} className="btn btn-danger">
          Delete
        </button>
      </div>
    </div>
  );
}
