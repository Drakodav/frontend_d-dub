import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiNaming, ApiResult, ApiStop } from '../../model/api.model';
import { RootState } from './rootReducer';

const initialState = {
    searchType: ApiNaming.route as ApiNaming,
    apiResults: {} as ApiResult,
    selectedStop: {} as ApiStop | ApiResult,
    direction: 1 as number,
};

const searchSlice = createSlice({
    name: 'searchInput',
    initialState,
    reducers: {
        setSearchResults: (state, action: PayloadAction<ApiResult>) => {
            state.apiResults = action.payload;
        },
        setSearchType: (state, action: PayloadAction<ApiNaming>) => {
            state.searchType = action.payload;
            state.apiResults = {};
        },
        setSelectedStop: (state, action: PayloadAction<ApiStop>) => {
            state.selectedStop = action.payload;
        },
        setDirection: (state, action: PayloadAction<number>) => {
            state.direction = action.payload;
        },
        switchDirection: (state) => {
            state.direction = state.direction === 1 ? 0 : 1;
        },
        resetSearchInput: (state) => {
            state.apiResults = {} as any;
            state.selectedStop = {} as any;
        },
    },
});

export const {
    setSearchResults,
    setSearchType,
    setSelectedStop,
    resetSearchInput,
    setDirection,
    switchDirection,
} = searchSlice.actions;

export const getSearchResults = (state: RootState) => state.searchInput.apiResults;

export const getSearchType = (state: RootState) => state.searchInput.searchType;

export const getSelectedStop = (state: RootState) => state.searchInput.selectedStop;

export const getDirection = (state: RootState) => state.searchInput.direction;

export default searchSlice.reducer;
