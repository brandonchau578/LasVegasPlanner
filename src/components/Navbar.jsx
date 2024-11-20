import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Navbar.css';

const Navbar = ({ setSearchQuery }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Pass the search query up to the parent
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">Lets Vegas</Link> {/* Use Link here instead of <a> */}
        </div>
        <input
          className="SearchBar"
          placeholder="Search"
          onChange={handleSearchChange} // Handle search query change
        />
        <ul className={`navbar-links ${isOpen ? 'active' : ''}`}>
          <li><Link to="/">Home</Link></li>  {/* Link to Home */}
          <li><Link to="/create">Create New Post</Link></li>  {/* Link to /create */}
        </ul>
      </div>
      <div className="navbar-toggle" onClick={toggleNavbar}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </nav>
  );
};

export default Navbar;
