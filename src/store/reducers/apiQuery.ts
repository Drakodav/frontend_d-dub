import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiResult } from '../../model/api.model';
import { RootState } from './rootReducer';

const initialState = {
    apiResults: {} as ApiResult,
};

const apiSlice = createSlice({
    name: 'apiQuery',
    initialState,
    reducers: {
        setApiQuery: (state, action: PayloadAction<ApiResult>) => {
            state.apiResults = action.payload;
        },
    },
});

export const { setApiQuery } = apiSlice.actions;

export const selectApiResults = (state: RootState) => state.apiQuery.apiResults;

export default apiSlice.reducer;
