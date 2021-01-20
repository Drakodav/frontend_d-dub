import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './rootReducer';

const initialState = {
    width: window.innerWidth,
    height: window.innerHeight,
    mapHeight: 0,
};

const mapSlice = createSlice({
    name: 'mapState',
    initialState,
    reducers: {
        setMapDimensions: (state) => {
            state.height = window.innerHeight;
            state.width = window.innerWidth;
        },
        moveMap: (state, action: PayloadAction<{ mapHeight: number }>) => {},
    },
});
const { actions, reducer } = mapSlice;
export const { setMapDimensions, moveMap } = actions;
export default reducer;

export const getMapDimensions = (state: RootState): { width: number; height: number } => ({
    width: state.mapState.width,
    height: state.mapState.height,
});

export const getWindowWidth = (state: RootState): number => state.mapState.width;
