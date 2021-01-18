import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface WindowState {
    width: number;
    height: number;
}

const initialState: WindowState = {
    width: window.innerWidth,
    height: window.innerHeight,
};

export const windowSlice = createSlice({
    name: 'windowState',
    initialState,
    reducers: {
        setDimensions: (state: WindowState) => {
            state.width = window.innerWidth;
            state.height = window.innerHeight;
        },
    },
});

export const { setDimensions } = windowSlice.actions;

export const getDimensions = (state: RootState) => state.windowState;

export default windowSlice.reducer;
