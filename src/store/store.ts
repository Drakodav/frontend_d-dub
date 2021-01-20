import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { ApiReducer, MapReducer } from './reducers';

export const store = configureStore({
    reducer: {
        // counter: counterReducer, // @TODO: Delete when finished with example
        apiQuery: ApiReducer,
        windowState: MapReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
