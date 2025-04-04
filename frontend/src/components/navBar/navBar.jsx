import { NavBarContainer, homeButton, activityButton, currentActivityButton, forumButton, profileButton } from "./navBarStyled.js";
import { Link } from "react-router-dom";

export const NavBar = () => {
    return (
        <NavBarContainer>
            <ul>
                <li><homeButton to="/">Home</homeButton></li>
                <li><activityButton to="/activityPage">Activity</activityButton></li>
                <li><currentActivityButton to="/current-activity">Current Activity</currentActivityButton></li>
                <li><forumButton to="/forumPage">Forum</forumButton></li>
                <li><profileButton to="/profilePage">Profile</profileButton></li>
            </ul>
        </NavBarContainer>
    )
}