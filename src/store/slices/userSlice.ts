import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    }
  },
});

export const {setIsLoading} = userSlice.actions;

export default userSlice.reducer;
