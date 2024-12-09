import { useState } from "react";
// @ts-ignore
import profil from "../assets/imgs/avatar-main.png";
import "./Navbar.css";

// Dummy data for navigation items
const navItems = [
  { id: 1, name: "" },
  { id: 2, name: "" },
  { id: 3, name: "" },
  { id: 4, name: "" },
];

export default function Navbar() {
  const [searchRes, setSearchRes] = useState(navItems); // State for filtered results

  const handleSearch = (event) => {
    const val = event.target.value;
    const filteredItems = navItems.filter((item) =>
      item.name.toLowerCase().includes(val.toLowerCase())
    );
    setSearchRes(filteredItems);
  };

  return (
    <div>
      <div className="topbar">
        <div className="toggle">
          <span className="material-symbols-outlined toggle__icon">menu</span>
        </div>
        <div className="d-flex">
          {/* Search Bar */}
          <div className="search">
            <label htmlFor="searchInput" className="search-label">
              <input
                id="searchInput"
                type="text"
                placeholder="Search here"
                onChange={handleSearch}
              />
              <span className="material-symbols-outlined">search</span>
            </label>
          </div>
          {/* Notification Section */}
          <div className="notification">
            <div className="bell-container">
              <div className="bell"></div>
            </div>
          </div>
          {/* User Profile */}
          <div className="user">
            <img src={profil} alt="User Profile" />
          </div>
        </div>
      </div>
      <hr className="col-11 m-auto my-3" />
      {/* Search Results */}
      <div className="search-results">
        {searchRes.map((item) => (
          <div key={item.id} className="search-result-item">
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
