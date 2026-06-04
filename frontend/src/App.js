import React from 'react';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';


function App() {
  return (
    <div className="app">
      <Navigation />
      <main>
        <Dashboard />
        </main>
    </div>
  );
}

export default App;
