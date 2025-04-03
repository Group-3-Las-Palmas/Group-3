import { useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { navBar } from './components/navBar/navBar'
import { profilePage } from './pages/profilePage'
import { landingPage } from './pages/homePage'
import { loginPage } from './pages/loginPage'
import { forumPage } from './pages/forumPage'
import { activityPage } from './pages/activityPage'
import './App.css'

function App() {

  return (
    <>
    <BrowserRouter>
      <navBar />
      <Routes>
        <Route path="/profile" element={<profilePage />} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
