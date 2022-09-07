import { configureStore } from '@reduxjs/toolkit';

import authSlice from './Auth/auth-slice';
import messageSlice from './Message/message-slice';
import questionsSlice from './Questions/questions-slice';

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        message: messageSlice.reducer,
        questions: questionsSlice.reducer
    }
});

export default store;
