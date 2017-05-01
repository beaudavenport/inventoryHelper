import React from 'react';
import SaveButton from './SaveButton';

export default function Navbar() {
  return (
    <nav className="navbar navbar-inverse bg-inverse">
      <a className="navbar-brand" href="/">Inventory Helper</a>
      <SaveButton />
    </nav>
  );
}
