import { configureStore } from '@reduxjs/toolkit';

import questionsSlice from './questions-slice';
import authSlice from './auth-slice';

const store = configureStore({
    reducer: { questions: questionsSlice.reducer, auth: authSlice.reducer },
});

export default store;
