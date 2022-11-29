import { SERVER_LINK } from '../../dev-server-link';
import { authActions } from './auth-slice'
import { messageActions } from '../Message/message-slice'

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
            // console.log(response);
            dispatch(authActions.setLoggedIn({
                loggedIn: response.status || false,
                ...response
            }));
        } catch (error) {
            console.error(error);
            dispatch(authActions.setError({ error: JSON.stringify(error) }));
            dispatch(messageActions.set({
                type: 'error',
                message: 'Checking LogIn State Failed !',
                description: JSON.stringify(error)
            }))
        } finally {
            dispatch(authActions.setLoading({ isLoading: false }));
        }
    };
}

export const login = (username, email, password) => {
    return async dispatch => {
        dispatch(messageActions.set({
            type: 'info',
            message: 'Logging In...'
        }))

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
                    body: JSON.stringify({ username, email, password })
                }
            ).then(data => data.json());

            await dispatch(getLoggedIn());
            if (response.error) {
                dispatch(messageActions.set({
                    type: 'error',
                    message: 'LogIn Failed !',
                    description: response.error
                }))
                return dispatch(authActions.setError({ error: response.error }));
            }
            dispatch(messageActions.set({
                type: 'success',
                message: 'LogIn Successful !'
            }))
        } catch (error) {
            console.error(error);
            dispatch(authActions.setError({ error: JSON.stringify(error) }));
            dispatch(messageActions.set({
                type: 'error',
                message: 'LogIn Failed !',
                description: JSON.stringify(error)
            }))
        } finally {
            dispatch(authActions.setLoading({ isLoading: false }));
        }
    }
}

export const logout = () => {
    return async dispatch => {
        dispatch(messageActions.set({
            type: 'info',
            message: 'Logging Out...'
        }))
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
            if (response.error) {
                dispatch(messageActions.set({
                    type: 'error',
                    message: 'LogOut Failed !',
                    description: response.error
                }))
                return dispatch(authActions.setError({ error: response.error }));
            }
            dispatch(messageActions.set({
                type: 'success',
                message: 'Logged Out Successfully !'
            }))
        } catch (error) {
            console.error(error);
            dispatch(authActions.setError({ error: JSON.stringify(error) }));
            dispatch(messageActions.set({
                type: 'error',
                message: 'LogOut Failed !',
                description: JSON.stringify(error)
            }))
        } finally {
            dispatch(authActions.setLoading({ isLoading: false }));
        }
    }
}

export const register = (name, username, email, password, passwordVerify) => {
    return async dispatch => {
        dispatch(messageActions.set({
            type: 'info',
            message: 'Registering...'
        }))
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
                    body: JSON.stringify({ name, username, email, password, passwordVerify })
                }
            ).then(data => data.json());

            await dispatch(getLoggedIn());
            if (response.error) {
                dispatch(messageActions.set({
                    type: 'error',
                    message: 'Registering Failed !',
                    description: response.error
                }))
                return dispatch(authActions.setError({ error: response.error }));
            }
            dispatch(messageActions.set({
                type: 'success',
                message: 'Registered Successful !'
            }))
        } catch (error) {
            console.error(error);
            dispatch(authActions.setError({ error: JSON.stringify(error) }));
            dispatch(messageActions.set({
                type: 'error',
                message: 'Registering Failed !',
                description: JSON.stringify(error)
            }))
        } finally {
            dispatch(authActions.setLoading({ isLoading: false }));
        }
    }
}

export const changePassword = (username, email, password, newPassword) => {
    return async dispatch => {
        dispatch(messageActions.set({
            type: 'info',
            message: 'Changing Password...'
        }))
        try {
            dispatch(authActions.setLoading({ isLoading: true }));
            const response = await fetch(
                `${SERVER_LINK}/api/user/changePassword`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'PUT',
                    credentials: 'include',
                    body: JSON.stringify({ username, email, password, newPassword })
                }
            ).then(data => data.json());

            await dispatch(getLoggedIn());
            if (response.error) {
                dispatch(messageActions.set({
                    type: 'error',
                    message: 'Changing Password Failed !',
                    description: response.error
                }))
                return dispatch(authActions.setError({ error: response.error }));
            }
            dispatch(messageActions.set({
                type: 'success',
                message: 'Changing Password Successful !'
            }))
        } catch (error) {
            console.error(error);
            dispatch(authActions.setError({ error: JSON.stringify(error) }));
            dispatch(messageActions.set({
                type: 'error',
                message: 'Changing Password Failed !',
                description: JSON.stringify(error)
            }))
        } finally {
            dispatch(authActions.setLoading({ isLoading: false }));
        }
    }
}