import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../components/login/login";

export const LoginPage = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
            </Routes>
        </BrowserRouter>
    )
};