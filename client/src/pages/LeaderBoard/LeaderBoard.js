import React, { Fragment, useEffect, useState } from 'react';
import { SERVER_LINK } from '../../dev-server-link';

import LeaderTable from './LeaderTable/LeaderTable';
import LoadingSpinner from '../../compenents/LoadingSpinner/LoadingSpinner';
import { errorFormatter } from '../../utils';

const LeaderBoard = () => {

    const { loading, error, leaders } = useFetchLeader();

    return (
        <Fragment>
            {loading && <LoadingSpinner />}
            {!loading && error && (<div>
                <div className='errorTemplate'>
                    <div><span>Msg : </span>Wasn't able to connect to server check if your are not offline or server might not be working !</div>
                    {error && <div><span>Error : </span>{errorFormatter(error)}</div>}
                </div>
            </div>)}
            {!loading && !error && (
                <LeaderTable leaders={[...leaders]} />
            )}
        </Fragment>
    )
}

const useFetchLeader = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(undefined);
    const [leaders, setLeaders] = useState(undefined);

    useEffect(() => {
        fetch(
            `${SERVER_LINK}/api/explore/leaderboard`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'GET'
            }
        )
            .then(response => {
                if (response.ok) return response.json();
                return Promise.reject(response);
            })
            .then(response => setLeaders(response))
            .catch(setError)
            .finally(() => setLoading(false))
    }, []);

    return { loading, error, leaders };
}


export default LeaderBoard;