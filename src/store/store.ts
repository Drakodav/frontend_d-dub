import { configureStore, ThunkAction, Action, getDefaultMiddleware } from '@reduxjs/toolkit';
import rootReducer, { RootState } from './reducers/rootReducer';

export const store = configureStore({
    reducer: rootReducer,
    middleware: [...getDefaultMiddleware()],
    devTools: process.env.NODE_ENV !== 'production',
});

if (process.env.NODE_ENV === 'development' && (module as any).hot) {
    (module as any).hot.accept('./reducers/rootReducer', () => {
        const newRootReducer = require('./reducers/rootReducer').default;
        store.replaceReducer(newRootReducer);
    });
}

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
