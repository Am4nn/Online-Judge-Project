import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoading: false,
        loggedIn: undefined,
        error: undefined
    },
    reducers: {
        setLoading(state, action) {
            state.isLoading = action.payload.isLoading;
        },
        setLoggedIn(state, action) {
            state.loggedIn = action.payload.loggedIn;
        },
        setError(state, action) {
            state.error = action.payload.error;
        }
    }
});

export const authActions = authSlice.actions;

export default authSlice;
