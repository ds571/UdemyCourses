import React, { useContext, useEffect, useState } from "react";
import { Grid, Loader } from "semantic-ui-react";
//import ActivityList from "./ActivityList";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { RootStoreContext } from "../../../app/stores/rootStore";
import InfiniteScroll from "react-infinite-scroller";
import ActivityList from "./ActivityList";
import ActivityFilters from "./ActivityFilters";

const ActivityDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadActivities,
    loadingInitial,
    setPage,
    page,
    totalPages
  } = rootStore.activityStore;

  // add local state so we can track loading of the next batch of activities
  const [loadingNext, setLoadingNext] = useState(false);

  const handleGetNext = () => {
    setLoadingNext(true);
    setPage(page + 1);
    loadActivities().then(() => setLoadingNext(false));
  };

  useEffect(() => {
    loadActivities();
  }, [loadActivities]); // 2nd param ensure that useEffect runs one time only. Every time our component renders, our UseEffect would be called otherwise (this is the dependency array) - componentDidMount equivalent

  if (loadingInitial && page === 0)
    return <LoadingComponent content="Loading activities..." />;
  return (
    <Grid>
      <Grid.Column width={10}>
        <InfiniteScroll
          pageStart={0}
          loadMore={handleGetNext}
          hasMore={!loadingNext && page + 1 < totalPages}
          initialLoad={false}
        >
          <ActivityList />
        </InfiniteScroll>

        {/* <Button
          floated="right"
          content="More..."
          positive
          disabled={totalPages === page + 1}
          onClick={handleGetNext}
          loading={loadingNext}
        />*/}
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityFilters />
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active={loadingNext} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
