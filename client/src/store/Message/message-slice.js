import { createSlice } from '@reduxjs/toolkit';

const messageSlice = createSlice({
    name: 'message',
    initialState: {
        type: undefined, // success, error, warning, info
        message: undefined,
        description: undefined,
        change: true
    },
    reducers: {
        set(state, action) {
            state.type = action.payload.type || 'info';
            state.message = action.payload.message;
            action.payload.description ?
                state.description = action.payload.description :
                state.description = undefined;
            state.change = !state.change;
        }
    }
});

export const messageActions = messageSlice.actions;

export default messageSlice;
