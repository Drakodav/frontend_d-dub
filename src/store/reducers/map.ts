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
        moveMap: (state: MapState, action: PayloadAction<{ barHeight: number; up?: boolean }>) => {},
    },
});

export const { setMapDimensions, moveMap } = windowSlice.actions;

export const getMapDimensions = (state: RootState): MapState => state.windowState;

export default windowSlice.reducer;
