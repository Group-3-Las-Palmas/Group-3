import { NavBarContainer, homeButton, activityButton, currentActivityButton, forumButton, profileButton } from "./navBarStyled.js";
import { Link } from "react-router-dom";

export const NavBar = () => {
    return (
        <NavBarContainer>
            <ul>
                <li><Link to="/"><homeButton>Home</homeButton></Link></li>
                <li><Link to="/activityPage"><activityButton>Activity</activityButton></Link></li>
                <li><Link to="/current-activity"><currentActivityButton>Current Activity</currentActivityButton></Link></li>
                <li><Link to="/forumPage"><forumButton>Forum</forumButton></Link></li>
                <li><Link to="/profilePage"><profileButton>Profile</profileButton></Link></li>
            </ul>
        </NavBarContainer>
    )
}