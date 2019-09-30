import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';

configure({ enforceActions: 'always' });

class ActivityStore {
    @observable activityRegistry = new Map();
    @observable loadingInitial = false;
    @observable activity: IActivity | null = null;
    @observable submitting = false;
    @observable target = '';

    @computed get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date)); // ascending date order
    }

    //@action loadActivities = () => {
    //    this.loadingInitial = true; // mutating state here (wouldn't work in redux)

    //    agent.Activities.list()
    //        .then(activities => {
    //            activities.forEach((activity) => {
    //                activity.date = activity.date.split('.')[0];
    //                this.activities.push(activity);
    //            });
    //        })
    //        .catch(error => console.log(error))
    //        .finally(() => this.loadingInitial = false);
    //};

    // same as above:
    @action loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list(); // block execution of anything  below this until this has been fulfilled
            runInAction('loading activities', () => {
                activities.forEach(activity => {
                    activity.date = activity.date.split('.')[0];
                    this.activityRegistry.set(activity.id, activity); // mutating state here
                });
                this.loadingInitial = false;
            });
        } catch (error) {
            runInAction('load activities error', () => {
                console.log(error);
                this.loadingInitial = false;
            });
        }
    };

    @action loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.activity = activity;
        }
        else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                runInAction('getting activity', () => {
                    this.activity = activity;
                    this.loadingInitial = false;
                });
            } catch (error) {
                runInAction('get activity error', () => {
                    this.loadingInitial = false;
                });
                console.log(error);
            }
        }
    };

    @action clearActivity = () => {
        this.activity = null;
    };

    getActivity = (id: string) => { // not mutating strings so this is ok
        return this.activityRegistry.get(id);
    }

    // Create Activity
    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            runInAction('creating activity', () => {
                this.activityRegistry.set(activity.id, activity);
                this.submitting = false;
            });
        } catch (error) {
            runInAction('create activity error', () => {
                this.submitting = false;
            });
            console.log(error);
        }
    };

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            runInAction('editing activity', () => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
                this.submitting = false;
            });

        } catch (error) {
            runInAction('edit activity error', () => {
                this.submitting = false;
            });
            console.log(error);
        }
    };

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;

        try {
            await agent.Activities.delete(id);
            runInAction('deleting activity', () => {
                this.activityRegistry.delete(id);
                this.submitting = false;
                this.target = '';
            });
        }
        catch (error) {
            runInAction('delete activity error', () => {
                this.submitting = false;
                this.target = '';
            });
            console.log(error);
        }
    };
}

export default createContext(new ActivityStore());