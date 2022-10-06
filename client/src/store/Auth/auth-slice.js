import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoading: false,
        loggedIn: undefined,
        error: undefined,
        name: undefined,
        email: undefined,
        username: 'guest',
        solvedQuestions: undefined,
        isAdmin: false,
        isGuest: true
    },
    reducers: {
        setLoading(state, action) {
            state.isLoading = action.payload.isLoading;
        },
        setLoggedIn(state, action) {
            state.loggedIn = action.payload.loggedIn;
            if (action.payload.loggedIn) {
                state.name = action.payload.name;
                state.email = action.payload.email;
                state.username = action.payload.username;
                state.solvedQuestions = action.payload.solvedQuestions;
                state.isAdmin = (action.payload.username === 'aman'); // update the logic 
                state.isGuest = (action.payload.username === 'guest'); // update the logic 
            } else {
                state.name = undefined;
                state.email = undefined;
                state.username = 'guest';
                state.solvedQuestions = undefined;
                state.isAdmin = false;
                state.isGuest = true;
            }
        },
        setError(state, action) {
            state.error = action.payload.error;
        }
    }
});

export const authActions = authSlice.actions;

export default authSlice;
