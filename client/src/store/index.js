import { configureStore } from '@reduxjs/toolkit';

import questionsSlice from './questions-slice';

const store = configureStore({
    reducer: { questions: questionsSlice.reducer },
});

export default store;
