// import { useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { NavBar } from './components/navBar/navBar.jsx'
// import { profilePage } from './pages/profilePage.jsx'
import { LandingPage } from './pages/landingPage.jsx'
// import { LoginPage } from './pages/landingPage.jsx'
// import { forumPage } from './pages/forumPage'
// import { activityPage } from './pages/activityPage'
import './App.scss'
import { MainPage } from './pages/mainPage.jsx'


function App() {

  return (
    <>
      <section className='page-content'>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/activityPage" element={<activityPage />} />
            <Route path="/current-activity" element={<activityPage />} />
            <Route path="/forumPage" element={<forumPage />} />
            <Route path="/profilePage" element={<profilePage />} />
          </Routes>
        </BrowserRouter>
      </section>
    </>
  )
}

export default App
