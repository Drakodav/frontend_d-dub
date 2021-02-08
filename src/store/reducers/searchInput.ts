import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiNaming, ApiResult, ApiStop, ApiTrip } from '../../model/api.model';
import { RootState } from './rootReducer';

const initialState = {
    searchType: ApiNaming.route as ApiNaming,
    apiResults: {} as ApiResult,
    selectedStop: {} as ApiStop,
    selectedTrip: {} as ApiTrip,
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
        },
        setSelectedStop: (state, action: PayloadAction<ApiStop>) => {
            state.selectedStop = action.payload;
        },
        setSelectedTrip: (state, action: PayloadAction<ApiTrip>) => {
            state.selectedTrip = action.payload;
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
            state.selectedTrip = {} as any;
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
    setSelectedTrip,
} = searchSlice.actions;

export const getSearchResults = (state: RootState) => state.searchInput.apiResults;

export const getSearchType = (state: RootState) => state.searchInput.searchType;

export const getSelectedStop = (state: RootState) => state.searchInput.selectedStop;

export const getDirection = (state: RootState) => state.searchInput.direction;

export const getSelectedTrip = (state: RootState) => state.searchInput.selectedTrip;

export default searchSlice.reducer;
