import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { CatalogPage } from './pages/CatalogPage';
import { LoginPage } from './pages/LoginPage';
import { AdminPage } from './pages/AdminPage';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter basename="/everything-for-fishing">
          <ThemeToggle />
          <Routes>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
