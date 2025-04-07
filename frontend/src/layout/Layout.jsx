import { Outlet } from "react-router-dom"
import { NavBar } from "../components/navBar/navBar.jsx";

export const Layout = () => {
    return (
        <>
        <section className='page-content'><Outlet /></section>
        <NavBar />
        </>
    )
}