import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './rootReducer';

const initialState = {
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    width: window.innerWidth,
    height: window.innerHeight,
    hDisplacement: 0,
};

const mapSlice = createSlice({
    name: 'mapState',
    initialState,
    reducers: {
        setWindowDimensions: (state) => {
            state.windowHeight = window.innerHeight;
            state.windowWidth = window.innerWidth;
            state.height = window.innerHeight - state.hDisplacement;
        },
        updateMapHeight: (state, action: PayloadAction<{ hDisplacement: number }>) => {
            state.height = state.windowHeight - action.payload.hDisplacement;
            state.hDisplacement = action.payload.hDisplacement;
        },
    },
});
const { actions, reducer } = mapSlice;
export const { updateMapHeight, setWindowDimensions } = actions;
export default reducer;

export const getMapDimensions = (state: RootState): { width: number; height: number } => ({
    width: state.mapState.width,
    height: state.mapState.height,
});

export const getWindowDimensions = (state: RootState): { windowWidth: number; windowHeight: number } => ({
    windowWidth: state.mapState.windowWidth,
    windowHeight: state.mapState.windowHeight,
});
