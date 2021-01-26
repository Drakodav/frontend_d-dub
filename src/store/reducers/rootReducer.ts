import { combineReducers } from '@reduxjs/toolkit';
import { SearchReducer, MapReducer } from '.';

const rootReducer = combineReducers({
    searchInput: SearchReducer,
    mapState: MapReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
