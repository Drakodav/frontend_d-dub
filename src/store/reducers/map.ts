import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface MapState {
    width: number;
    height: number;
    barHeight: number;
}

const initialState: MapState = {
    width: window.innerWidth,
    height: window.innerHeight,
    barHeight: 0,
};

export const windowSlice = createSlice({
    name: 'mapState',
    initialState,
    reducers: {
        setMapDimensions: (state: MapState) => {
            state.height = window.innerHeight;
            state.width = window.innerWidth;
        },
        moveMap: (state: MapState, action: PayloadAction<{ barHeight: number }>) => {},
    },
});

export const { setMapDimensions, moveMap } = windowSlice.actions;

export const getMapDimensions = (state: RootState): { width: number; height: number } => ({
    width: state.mapState.width,
    height: state.mapState.height,
});

export const getWindowWidth = (state: RootState): number => state.mapState.width;

export default windowSlice.reducer;
