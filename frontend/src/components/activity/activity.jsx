import { MeditationContainer, MeditationDesc } from "./activityStyled";
import MeditationIcon from "../../assets/meditation.svg";
import favoriteIcon from "../../assets/favoriteIcon.svg";
import unfavoriteIcon from "../../assets/unfavoriteIcon.svg";
import { useState } from "react";

export const FavoriteButton = () => {
    const [isFavorite, setIsFavorite] = useState(false);

    const handleClick = () => {
        setIsFavorite(!isFavorite);
    }
    return (
        <button onClick={handleClick} style={({ background: "none", border: "none", cursor: "pointer", padding: "0" })}>
            <img style={({ display: "block", width: "15px", height: "15px"})} src={isFavorite ? favoriteIcon : unfavoriteIcon} alt="favourite" />
        </button>
    )

}


export const Activity = () => {
    return (
        <MeditationContainer>
            <img src={MeditationIcon} alt="meditation" />
            <MeditationDesc>
                <h4>3 minutes meditation</h4>
                <h6>To get your mind in the here and now.</h6>
            </MeditationDesc>
            <FavoriteButton />
        </MeditationContainer>
    )
}