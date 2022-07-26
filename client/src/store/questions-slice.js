import { createSlice } from '@reduxjs/toolkit';

const questionsSlice = createSlice({
    name: 'questions',
    initialState: {
        questions: [],
        changedQuestions: false,
    },
    reducers: {
        replaceQuestionsList(state, action) {
            state.questions = action.payload.questions;
        },
        addQuestionToList(state, action) {
            const newItem = action.payload;
            const existingItem = state.questions.find((item) => item.id === newItem.id);
            state.changedQuestions = true;
            if (!existingItem) {
                state.questions.push({ ...newItem });
            }
        },
        removeQuestionFromList(state, action) {
            const id = action.payload;
            const existingItem = state.questions.find((item) => item.id === id);
            state.changedQuestions = true;
            if (existingItem) {
                state.questions = state.questions.filter((item) => item.id !== id);
            }
        }
    }
});

export const questionsActions = questionsSlice.actions;

export default questionsSlice;
