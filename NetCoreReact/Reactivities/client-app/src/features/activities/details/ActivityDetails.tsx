import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';

interface DetailParams {
    id: string
}

const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({ match, history }) => {
    const activityStore = useContext(ActivityStore);
    const { activity, loadActivity } = activityStore;

    // do something when component mounts
    useEffect(() => {
        loadActivity(match.params.id); // run once when mounting component, so pass array of dependencies
    }, [loadActivity, match.params.id, history]);

    if(!activity)
    {
        return <h2>Activity not found</h2>
    }

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailedHeader activity={activity} />
                <ActivityDetailedInfo activity={activity} />
                <ActivityDetailedChat />
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSidebar />
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActivityDetails);