import ActivityList from "../components/activity/activity";
import { ActivityPageContainer } from "../styles/activityPageStyled";

export const ActivityPage = () => {
    return (
        <ActivityPageContainer>
            <h1>All Activities</h1>
            <ActivityList /> {/* Usa el nuevo componente */}
        </ActivityPageContainer>
    )
}