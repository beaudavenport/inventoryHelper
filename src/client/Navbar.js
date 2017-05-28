import React from 'react';
import { Link } from 'react-router-dom';
import SaveButton from './SaveButton';

export default function Navbar() {
  return (
    <nav className="navbar navbar-inverse bg-inverse">
      <Link className="navbar-brand" to="/">Inventory Helper</Link>
      <ul className="navbar-nav">
        <li className="nav-item"><Link to="/containers" className="nav-link">Containers</Link></li>
        <li className="nav-item"><SaveButton /></li>
      </ul>
    </nav>
  );
}
