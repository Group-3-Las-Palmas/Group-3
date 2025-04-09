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
          <Routes>
            <Route index element={<LandingPage/>}/>
            <Route path="/" element={<Layout />}>
            <Route path="/ActivityPage" element={<ActivityPage />} />
            {/* <Route path="/current-activity" element={<CurrentActivityPage />} /> */}
            <Route path="/forumPage" element={<forumPage />} />
            <Route path="/profilePage" element={<UserProfilePage />} />
            <Route path="/settingsUserPage" element={<SettingsUserPage />} />
            <Route path="/current-activityPage" element={<current-activityPage />} />
            <Route path="/mainPage" element={<MainPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </section>
    </>
  )
}

export default App
