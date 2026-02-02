import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Home from './views/Home/Home';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Home />
    </AuthProvider>
  );
}

export default App;