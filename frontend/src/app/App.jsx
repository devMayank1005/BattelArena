import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from '../features/auth/pages/Home';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import Protected from '../features/auth/components/Protected';
import { AuthProvider } from '../features/auth/contexts/auth.context';
import { ArenaProvider } from '../features/ai/context/ai.context';
import HomeArena from '../features/ai/pages/HomeArena';

function App() {
  return (
    <AuthProvider>
      <ArenaProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/arena"
              element={(
                <Protected>
                  <HomeArena />
                </Protected>
              )}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ArenaProvider>
    </AuthProvider>
  );
}

export default App;