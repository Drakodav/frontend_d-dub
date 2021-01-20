import { combineReducers } from '@reduxjs/toolkit';
import { ApiReducer, MapReducer } from '.';

const rootReducer = combineReducers({
    apiQuery: ApiReducer,
    mapState: MapReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
