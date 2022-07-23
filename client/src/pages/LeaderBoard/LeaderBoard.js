import React, { Fragment } from 'react';
import useFetch from '../../hooks/useFetch';
import { SERVER_LINK } from '../../dev-server-link';

import classes from './LeaderBoard.module.css';
import LoadingSpinner from '../../compenents/LoadingSpinner/LoadingSpinner';

const LeaderBoard = () => {

    const { loading, error, value: leaders } = useFetch(
        `${SERVER_LINK}/api/explore/leaderboard`,
        {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'GET',
        }
    )

    console.log(leaders);

    return (
        <Fragment>
            {loading && <LoadingSpinner />}
            {!loading && error && (<div>
                <div className={classes.serverError}>
                    <div><span>Msg : </span>Wasn't able to connect to server check if your are not offline or server might not be working !</div>
                    {error && <div><span>Error : </span>{JSON.stringify(error)}</div>}
                </div>
            </div>)}
            {!loading && !error && (
                <div>Leader Board</div>
            )}
        </Fragment>
    )
}

export default LeaderBoard;