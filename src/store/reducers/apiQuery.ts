import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiResult } from '../../model/api';
import { RootState } from '../store';

interface ApiState {
  apiResults: ApiResult[];
}

const initialState: ApiState = {
  apiResults: [],
};

export const apiSlice = createSlice({
  name: 'apiQuery',
  initialState,
  reducers: {
    setApiQuery: (state, action: PayloadAction<ApiResult[]>) => {
      state.apiResults = action.payload;
    },
  },
});

export const { setApiQuery } = apiSlice.actions;

// export const selectApiResults = (state: RootState) => state.apiQuery.apiResults;

export default apiSlice.reducer;
