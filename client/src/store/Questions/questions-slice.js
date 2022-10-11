import { createSlice } from '@reduxjs/toolkit';

const questionsSlice = createSlice({
    name: 'questions',
    initialState: {
        questions: [],
        isLoading: true,
    },
    reducers: {
        setLoading(state, action) {
            state.isLoading = action.payload.isLoading;
        },
        replaceQuestionsList(state, action) {
            state.questions = action.payload.questions;
        }
    }
});

export const questionsActions = questionsSlice.actions;

export default questionsSlice;
