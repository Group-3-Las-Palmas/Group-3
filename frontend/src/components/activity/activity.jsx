import { ActivityContainer, MeditationDesc } from "./activityStyled";

export const Activity = () => {
    return (
        <ActivityContainer>
            <img src="#" alt="meditation" />
            <MeditationDesc>
                <h6>3 minutes meditation</h6>
                <p>To get your mind in the here and now.</p>
            </MeditationDesc>
            <button><img src="#" alt="favourite" /></button>
        </ActivityContainer>
    )
}