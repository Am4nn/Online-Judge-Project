import { SERVER_LINK } from '../dev-server-link';
import { authActions } from './auth-slice'

export const getLoggedIn = () => {
    return async dispatch => {
        try {
            dispatch(authActions.setLoading({ isLoading: true }));
            const response = await fetch(
                `${SERVER_LINK}/api/user/loggedIn`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'GET',
                    credentials: 'include'
                }
            ).then(data => data.json());
            console.log("login : ", response);
            dispatch(authActions.setLoggedIn({ loggedIn: response || false }));
        } catch (error) {
            console.error(error);
            dispatch(authActions.setError({ error: JSON.stringify(error) }));
        } finally {
            dispatch(authActions.setLoading({ isLoading: false }));
        }
    };
};

export const login = (email, password) => {
    return async dispatch => {
        try {
            dispatch(authActions.setLoading({ isLoading: true }));
            const response = await fetch(
                `${SERVER_LINK}/api/user/login`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify({ email, password })
                }
            ).then(data => data.json());

            await dispatch(getLoggedIn());
            console.log(response);
            if (response.error) {
                dispatch(authActions.setError({ error: response.error }));
            }

        } catch (error) {
            console.error(error);
            dispatch(authActions.setError({ error: JSON.stringify(error) }));
        } finally {
            dispatch(authActions.setLoading({ isLoading: false }));
        }
    }
}

export const logout = () => {
    return async dispatch => {
        try {
            dispatch(authActions.setLoading({ isLoading: true }));
            const response = await fetch(
                `${SERVER_LINK}/api/user/logout`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'GET',
                    credentials: 'include'
                }
            ).then(data => data.json());

            await dispatch(getLoggedIn());
            if (response.error) dispatch(authActions.setError({ error: response.error }));

        } catch (error) {
            console.error(error);
            dispatch(authActions.setError({ error: JSON.stringify(error) }));
        } finally {
            dispatch(authActions.setLoading({ isLoading: false }));
        }
    }
}

export const register = (name, email, password, passwordVerify) => {
    return async dispatch => {
        try {
            dispatch(authActions.setLoading({ isLoading: true }));
            const response = await fetch(
                `${SERVER_LINK}/api/user/register`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify({ name, email, password, passwordVerify })
                }
            ).then(data => data.json());

            await dispatch(getLoggedIn());
            if (response.error) dispatch(authActions.setError({ error: response.error }));

        } catch (error) {
            console.error(error);
            dispatch(authActions.setError({ error: JSON.stringify(error) }));
        } finally {
            dispatch(authActions.setLoading({ isLoading: false }));
        }
    }
}