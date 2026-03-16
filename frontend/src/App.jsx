import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import TopicPage from './pages/TopicPage';
import ExercisePage from './pages/ExercisePage';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/topic/:id" element={<TopicPage />} />
          <Route path="/exercise/:id" element={<ExercisePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
