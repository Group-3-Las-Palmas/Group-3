import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "../components/navBar/navBar";

export const LandingPage = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<NavBar />}></Route>
            </Routes>
        </BrowserRouter>
    )
}