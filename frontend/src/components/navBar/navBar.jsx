import NavBarContainer from "./navBarStyled.js";
import { navLink } from "react-router-dom";


export const NavBar = () => {
    return (
        <navBarContainer>
            <ul>
                <li>
                    <navLink to="/"><span class="material-symbols-outlined">
                        menu
                    </span></navLink>
                </li>
                <li></li>
            </ul>
        </navBarContainer>
    )
}