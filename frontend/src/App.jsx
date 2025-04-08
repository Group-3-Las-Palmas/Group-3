// import { useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserProfilePage from './pages/profilePage.jsx'
import { LandingPage } from './pages/landingPage.jsx'
// import { LoginPage } from './pages/landingPage.jsx'
// import { forumPage } from './pages/forumPage'

import { SettingsUserPage } from './pages/settingsUserPage.jsx';

import { ActivityPage } from './pages/activityPage.jsx'
import './App.scss'
import { Layout } from './layout/Layout.jsx'
import { MainPage } from './pages/mainPage.jsx'

function App() {

  return (
    <>
      <section className='page-content'>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/ActivityPage" element={<activityPage />} />
            <Route path="/current-activity" element={<activityPage />} />
            <Route path="/forumPage" element={<forumPage />} />
            <Route path="/profilePage" element={<profilePage />} />
            <Route path="/settingsUserPage" element={<SettingsUserPage />} />
            <Route path="/current-activityPage" element={<current-activityPage />} />
            <Route path="/mainPage" element={<MainPage />} />
          </Routes>
        </BrowserRouter>
      </section>
    </>
  )
}

export default App
