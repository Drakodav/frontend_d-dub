import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './rootReducer';

const initialState = {
    width: window.innerWidth,
    height: window.innerHeight,
    hDisplacement: 0,
};

const mapSlice = createSlice({
    name: 'mapState',
    initialState,
    reducers: {
        setMapDimensions: (state) => {
            state.height = window.innerHeight - state.hDisplacement;
            state.width = window.innerWidth;
        },
        updateMapHeight: (state, action: PayloadAction<{ hDisplacement: number }>) => {
            state.height = window.innerHeight - action.payload.hDisplacement;
            state.hDisplacement = action.payload.hDisplacement;
        },
    },
});
const { actions, reducer } = mapSlice;
export const { setMapDimensions, updateMapHeight } = actions;
export default reducer;

export const getMapDimensions = (state: RootState): { width: number; height: number } => ({
    width: state.mapState.width,
    height: state.mapState.height,
});

export const getWindowWidth = (state: RootState): number => state.mapState.width;
