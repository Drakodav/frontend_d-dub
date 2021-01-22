import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './rootReducer';

const initialState = {
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    width: window.innerWidth,
    height: window.innerHeight,
    hDisplacement: 0,
    controlsVisible: true,
};

const mapSlice = createSlice({
    name: 'mapState',
    initialState,
    reducers: {
        setWindowDimensions: (state) => {
            state.windowWidth = window.innerWidth;
            state.width = window.innerWidth;

            state.windowHeight = window.innerHeight;
            state.height = window.innerHeight - state.hDisplacement;
        },
        updateMapHeight: (state, action: PayloadAction<{ hDisplacement: number }>) => {
            state.height = state.windowHeight - action.payload.hDisplacement;
            state.hDisplacement = action.payload.hDisplacement;
        },
        updateControlsVisible: (state, action: PayloadAction<boolean>) => {
            state.controlsVisible = action.payload;
        },
    },
});
const { actions, reducer } = mapSlice;
export const { updateMapHeight, setWindowDimensions, updateControlsVisible } = actions;
export default reducer;

export const getMapDimensions = (state: RootState): { width: number; height: number } => ({
    width: state.mapState.width,
    height: state.mapState.height,
});

export const getWindowDimensions = (state: RootState): { windowWidth: number; windowHeight: number } => ({
    windowWidth: state.mapState.windowWidth,
    windowHeight: state.mapState.windowHeight,
});

export const getControlsVisible = (state: RootState): boolean => state.mapState.controlsVisible;
