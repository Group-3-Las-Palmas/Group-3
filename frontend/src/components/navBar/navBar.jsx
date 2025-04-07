import { NavBarContainer } from "./navBarStyled.js";
import { Link } from "react-router-dom";

export const NavBar = () => {
    return (
        <NavBarContainer>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/activityPage">Activities</Link></li>
                <li><Link to="/current-activity">Current-activity</Link></li>
                <li><Link to="/forumPage">Forum</Link></li>
                <li><Link to="/profilePage">Profile</Link></li>
            </ul>
        </NavBarContainer>
    )
}