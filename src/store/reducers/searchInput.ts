import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiInputType, ApiResult } from '../../model/api.model';
import { RootState } from './rootReducer';

const initialState = {
    searchType: Object.values(ApiInputType)[0] as string,
    apiResults: {} as ApiResult,
};

const searchSlice = createSlice({
    name: 'searchInput',
    initialState,
    reducers: {
        setSearchResults: (state, action: PayloadAction<ApiResult>) => {
            state.apiResults = action.payload;
        },
        setSearchType: (state, action: PayloadAction<string>) => {
            state.searchType = action.payload;
            state.apiResults = {};
        },
    },
});

export const { setSearchResults, setSearchType } = searchSlice.actions;

export const selectSearchResults = (state: RootState) => state.searchInput.apiResults;

export const getSearchType = (state: RootState) => state.searchInput.searchType;

export default searchSlice.reducer;
