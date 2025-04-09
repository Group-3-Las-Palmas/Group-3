// frontend/src/App.jsx
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'; // Añadir Navigate
import UserProfilePage from './pages/profilePage.jsx';
import { LandingPage } from './pages/landingPage.jsx';
import { SettingsUserPage } from './pages/settingsUserPage.jsx';
import { ActivityPage } from './pages/activityPage.jsx';
import { Layout } from './layout/Layout.jsx';
import { MainPage } from './pages/mainPage.jsx';
import { CurrentActivityPage } from './pages/currentActivityPage.jsx';

// Importar el componente de protección
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'; // Ajusta la ruta si es necesario

import './App.scss';
import './background.scss';

function App() {
  return (
    <div className="app-container">
      <div className="aura-background" aria-hidden="true">
        <div className="aura"></div>
      </div>

      <section className="page-content">
        <BrowserRouter>
          <Routes>
            <Route index element={<LandingPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/mainPage" element={<MainPage />} />
                <Route path="/activityPage" element={<ActivityPage />} />
                <Route path="/forumPage" element={<div>Forum Page</div>} />
                <Route path="/profilePage" element={<UserProfilePage />} />
                <Route path="/settingsUserPage" element={<SettingsUserPage />} />
                <Route path="/current-activityPage" element={<CurrentActivityPage />} />
                <Route path="/" element={<Navigate to="/mainPage" replace />} />
              </Route>
            </Route>

          </Routes>
        </BrowserRouter>
      </section>
    </div>
  );
}

export default App;