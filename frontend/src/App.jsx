// import { useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import { profilePage } from './pages/profilePage.jsx'
import { LandingPage } from './pages/landingPage.jsx'
// import { LoginPage } from './pages/landingPage.jsx'
// import { forumPage } from './pages/forumPage'
import { ActivityPage } from './pages/activityPage.jsx'
import './App.scss'
import { Layout } from './layout/Layout.jsx'
import { MainPage } from './pages/mainPage.jsx'

function App() {

  return (
    <>

      <BrowserRouter>
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path="/" element={<Layout />}>
              <Route path="/ActivityPage" element={<ActivityPage />} />
              <Route path="/current-activityPage" element={<current-activityPage />} />
              <Route path="/forumPage" element={<forumPage />} />
              <Route path="/profilePage" element={<profilePage />} />
              <Route path="/mainPage" element={<MainPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
