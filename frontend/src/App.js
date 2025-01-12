import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar.js';

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="w-full h-full">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
