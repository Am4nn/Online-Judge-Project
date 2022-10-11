import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'

const Account = () => {
    const { loggedIn, name, email, username, isAdmin } = useSelector(state => state.auth);
    return (
        <Fragment>
            <div>Account
                <div>This site is still in development</div>
                <div>This page has not yet been developed</div>
            </div>
            <br />
            <section>
                <h1>{name}</h1>
                <h3>{email}</h3>
                <h3>{username}</h3>
                <p>You are {!isAdmin && "not "} Admin</p>
                {loggedIn && <h4>Edit</h4>}
            </section>
        </Fragment>
    )
}

export default Account;