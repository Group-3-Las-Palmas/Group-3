import { NavBarContainer } from "./navBarStyled";
import { navLink } from "react-router-dom";


export default function NavBar() {
    return (
        <navBarContainer>
            <ul>
                <li>
                    <navLink to="/profilePage"><span class="material-symbols-outlined">
                        menu
                    </span></navLink>
                </li>
                <li></li>
            </ul>
        </navBarContainer>
    )}