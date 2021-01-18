import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { ApiReducer, WindowReducer } from './reducers';

export const store = configureStore({
    reducer: {
        // counter: counterReducer, // @TODO: Delete when finished with example
        apiQuery: ApiReducer,
        windowState: WindowReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
