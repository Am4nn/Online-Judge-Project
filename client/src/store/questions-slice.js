import { createSlice } from '@reduxjs/toolkit';

const questionsSlice = createSlice({
    name: 'questions',
    initialState: {
        questions: [],
        leaders: [],
        changedQuestions: false,
        changedLeaders: false,
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
        },


        replaceLeaders(state, action) {
            state.leaders = action.payload.leaders;
        },
        addLeader(state, action) {
            const newLeader = action.payload;
            const existingLeader = state.leaders.find((leader) => leader.id === newLeader.id);
            state.changedLeaders = true;
            if (!existingLeader) {
                state.leaders.push({ ...newLeader });
            }
        },
        removeLeader(state, action) {
            const id = action.payload;
            const existingLeader = state.leaders.find((leader) => leader.id === id);
            state.changedLeaders = true;
            if (existingLeader) {
                state.leaders = state.leaders.filter((leader) => leader.id !== id);
            }
        },
    },
});

export const questionsActions = questionsSlice.actions;

export default questionsSlice;
