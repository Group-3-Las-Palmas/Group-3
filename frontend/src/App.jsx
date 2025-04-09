import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserProfilePage from './pages/profilePage.jsx'
import { LandingPage } from './pages/landingPage.jsx'
import { SettingsUserPage } from './pages/settingsUserPage.jsx'
import { ActivityPage } from './pages/activityPage.jsx'
import { Layout } from './layout/Layout.jsx'
import { MainPage } from './pages/mainPage.jsx'
// import { forumPage } from './pages/forumPage'
// import { current-activityPage } from './pages/...'

import './App.scss'
import './Background.scss' // ✅ aura styles

function App() {
  return (
    <div className="app-container">
      {/* ✅ Aura-baggrund — vises globalt */}
      <div className="aura-background" aria-hidden="true">
        <div className="aura"></div>
      </div>

      {/* ✅ Alt synligt indhold — uanset side */}
      <section className="page-content">
        <BrowserRouter>
          <Routes>
            <Route index element={<LandingPage />} />
            <Route path="/" element={<Layout />}>
              <Route path="/ActivityPage" element={<ActivityPage />} />
              <Route path="/forumPage" element={<div>Forum Page</div>} />
              <Route path="/profilePage" element={<UserProfilePage />} />
              <Route path="/settingsUserPage" element={<SettingsUserPage />} />
              <Route path="/current-activityPage" element={<div>Current Activity Page</div>} />
              <Route path="/mainPage" element={<MainPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </section>
    </div>
  )
}

export default App
