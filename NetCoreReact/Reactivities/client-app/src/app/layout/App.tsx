import React, { useState, useEffect, Fragment, SyntheticEvent } from 'react';
import { Container } from 'semantic-ui-react';
import { IActivity } from '../models/activity';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

const App = () => {
    // state, function that sets the state
    const [activities, setActivities] = useState<IActivity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
    // useEffect is 3 rolled into one: componentDidMount, componentDidUpdate, componentWillUnmount (cleanup for useEffect hook- unsubscribe from something we subscribed to)

    // Edit mode
    const [editMode, setEditMode] = useState(false); // infers type based on initial value
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [target, setTarget] = useState('');


    const handleSelectActivity = (id: string) => {
        setSelectedActivity(activities.filter(a => a.id === id)[0]);
        setEditMode(false);
    }

    // Function - create activity button
    const handleOpenCreateForm = () => {
        setSelectedActivity(null);
        setEditMode(true);
    }

    // Handle the create activity
    const handleCreateActivity = (activity: IActivity) => {
        setSubmitting(true);

        agent.Activities.create(activity).then(() => {
            setActivities([...activities, activity]); // copies existing activities, and add activity onto this array
            setSelectedActivity(activity);
            setEditMode(false);
        }).then(() => setSubmitting(false));
    }

    // Handle edit activity
    const handleEditActivity = (activity: IActivity) => {
        setSubmitting(true);
        agent.Activities.update(activity).then(() => {
            setActivities([...activities.filter(a => a.id !== activity.id), activity]); // get array that meets constraints and add activity to it
            setSelectedActivity(activity);
            setEditMode(false);
        }).then(() => setSubmitting(false));
    }

    const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        setSubmitting(true);
        setTarget(event.currentTarget.name);
        agent.Activities.delete(id).then(() => {
            setActivities([...activities.filter(a => a.id !== id)]);
        }).then(() => setSubmitting(false));
    }

    useEffect(() => {
        //axios.get<IActivity[]>('http://localhost:5000/api/activities') use below instead:
        agent.Activities.list()
            .then(response => {
                let activities: IActivity[] = [];
                response.forEach((activity) => {
                    activity.date = activity.date.split('.')[0];
                    activities.push(activity);
                });
                setActivities(activities);
            }).then(() => setLoading(false));
    }, []); // 2nd param ensure that useEffect runs one time only. Every time our component renders, our UseEffect would be called otherwise

    if(loading) return <LoadingComponent content='Loading activities...' />

    return (
        <Fragment>
            <NavBar openCreateForm={handleOpenCreateForm} />
            <Container style={{ marginTop: '7em' }}>
                <ActivityDashboard
                    activities={activities}
                    selectActivity={handleSelectActivity}
                    selectedActivity={selectedActivity}
                    editMode={editMode}
                    setEditMode={setEditMode}
                    setSelectedActivity={setSelectedActivity}
                    createActivity={handleCreateActivity}
                    editActivity={handleEditActivity}
                    deleteActivity={handleDeleteActivity}
                    submitting={submitting}
                    target={target}
                />
            </Container>
        </Fragment>
    );
};

/*
interface IState {
    activities: IActivity[]
};*/

// OLD WAY
/*
class App extends Component<{}, IState> {
    readonly state: IState = {
        activities: []
    };

  // lifecycle method
  // Wait until component has  mounted
  componentDidMount() {
    axios.get<IActivity[]>('http://localhost:5000/api/activities')
      .then((response) => {
        //console.log(response);
        //this.state = // invalid
        this.setState({
          activities: response.data
        });
      });

  }

  render() {

    return (
    <div>
    <Header as='h2'>
      <Icon name='users' circular />
      <Header.Content>Reactivities</Header.Content>
    </Header>
    <List>
      {this.state.activities.map((activity) => (
        <List.Item key={activity.id}>{activity.title}</List.Item>
      ))}
    </List>

    </div>);
  }
} */

export default App;