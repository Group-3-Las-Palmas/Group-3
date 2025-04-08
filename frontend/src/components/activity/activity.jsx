import { MeditationContainer, MeditationDesc } from "./activityStyled";
import MeditationIcon from "../../assets/meditation.svg";

export const Activity = () => {
    return (
        <MeditationContainer>
            <img src={MeditationIcon} alt="meditation" />
            <MeditationDesc>
                <h4>3 minutes meditation</h4>
                <h6>To get your mind in the here and now.</h6>
            </MeditationDesc>
            <button><img src="#" alt="favourite" /></button>
        </MeditationContainer>
    )
}