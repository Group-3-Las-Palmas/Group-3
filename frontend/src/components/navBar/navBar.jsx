import { NavBarContainer } from "./navBarStyled.js";
import { Link } from "react-router-dom";
import homeIcon from "../../assets/homeIcon.svg";
import activityIcon from "../../assets/activityIcon.svg";
import currentActivityIcon from "../../assets/current_activityIcon.svg";
import forumIcon from "../../assets/forumIcon.svg";
import profileIcon from "../../assets/profileIcon.svg";

export const NavBar = () => {
    return (
        <NavBarContainer>
            <ul>
                <li><Link to="/"><img src={homeIcon} alt="Home" /></Link></li>
                <li><Link to="/activityPage"><img src={activityIcon} alt="Activity" /></Link></li>
                <li><Link to="/current-activity"><img src={currentActivityIcon} alt="currentActivity" /></Link></li>
                <li><Link to="/forumPage"><img src={forumIcon} alt="forum" /></Link></li>
                <li><Link to="/profilePage"><img src={profileIcon} alt="profile" /></Link></li>
            </ul>
        </NavBarContainer>
    )
}