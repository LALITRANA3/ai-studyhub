import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './components/Dashboard/Dashboard';
import ChatPage from './components/Chat/ChatPage';
import MCQPage from './components/MCQ/MCQPage';
import FlashcardsPage from './components/Flashcards/FlashcardsPage';
import RoadmapPage from './components/Roadmap/RoadmapPage';
import UploadPage from './components/Upload/UploadPage';
import PYQPage from './components/PYQ/PYQPage';
import YouTubePage from './components/YouTube/YouTubePage';
import ProgressPage from './components/Progress/ProgressPage';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#151d2e',
              color: '#e2e8f0',
              border: '0.5px solid rgba(99,179,237,0.2)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '13px',
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="mcq" element={<MCQPage />} />
            <Route path="flashcards" element={<FlashcardsPage />} />
            <Route path="roadmap" element={<RoadmapPage />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="pyq" element={<PYQPage />} />
            <Route path="youtube" element={<YouTubePage />} />
            <Route path="progress" element={<ProgressPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
