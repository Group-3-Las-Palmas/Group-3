import { MeditationContainer, MeditationDesc, BreathingContainer, BreathingDesc, StretchingContainer, StretchingDesc } from "./activityStyled";
import MeditationIcon from "../../assets/Meditation.svg";
import favoriteIcon from "../../assets/favoriteIcon.svg";
import unfavoriteIcon from "../../assets/unfavoriteIcon.svg";
import BreathingIcon from "../../assets/breathingIcon.svg";
import streachingIcon from "../../assets/stretchingIcon.svg";
import { useState } from "react";
import { Link } from "react-router-dom";

export const FavoriteButton = () => {
    const [isFavorite, setIsFavorite] = useState(false);

    const handleClick = () => {
        setIsFavorite(!isFavorite);
    }
    return (
        <button onClick={handleClick} style={({ background: "none", border: "none", cursor: "pointer", padding: "0" })}>
            <img style={({ display: "block", width: "15px", height: "15px" })} src={isFavorite ? favoriteIcon : unfavoriteIcon} alt="favourite" />
        </button>
    )

}


export const Activity = () => {
    return (
        <>
            <MeditationContainer>
                <img src={MeditationIcon} alt="meditation" />
                <MeditationDesc>
                    <Link to="/current-activityPage"><h4>3 minutes meditation exercise</h4></Link>
                    <h6>To get your mind in the here and now.</h6>
                </MeditationDesc>
                <FavoriteButton />
            </MeditationContainer>
            <BreathingContainer>
                <img src={BreathingIcon} alt="breathingExercise" />
                <BreathingDesc>
                    <Link to="/current-activityPage"><h4>3 minutes Breathing exercise</h4></Link>
                    <h6>To get your mind in the here and now.</h6>
                </BreathingDesc>
                <FavoriteButton />
            </BreathingContainer>
            <StretchingContainer>
                <img src={streachingIcon} alt="stretchingExercise" />
                <StretchingDesc>
                    <Link to="/current-activityPage"><h4>3 minutes Stretching exercise</h4></Link>
                    <h6>To get your mind in the here and now.</h6>
                </StretchingDesc>
                <FavoriteButton />
            </StretchingContainer>
        </>
    )
}