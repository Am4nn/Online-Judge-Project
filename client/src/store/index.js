import { configureStore } from '@reduxjs/toolkit';

import uiSlice from './ui-slice';
import questionsSlice from './questions-slice';

const store = configureStore({
    reducer: { ui: uiSlice.reducer, questions: questionsSlice.reducer },
});

export default store;
