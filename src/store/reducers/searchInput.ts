import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiNaming, ApiResult, ApiStop } from '../../model/api.model';
import { RootState } from './rootReducer';

const initialState = {
    searchType: ApiNaming.route as string,
    apiResults: {} as ApiResult,
    selectedStop: {} as ApiStop,
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
        setSelectedStop: (state, action: PayloadAction<ApiStop>) => {
            state.selectedStop = action.payload;
        },
    },
});

export const { setSearchResults, setSearchType, setSelectedStop } = searchSlice.actions;

export const getSearchResults = (state: RootState) => state.searchInput.apiResults;

export const getSearchType = (state: RootState) => state.searchInput.searchType;

export const getSelectedStop = (state: RootState) => state.searchInput.selectedStop;

export default searchSlice.reducer;
