import {createSlice, PayloadAction} from "@reduxjs/toolkit";

type userState = {
  isLoading: boolean,
  isLoggedIn: boolean,
}

const initialState: userState = {
  isLoading: true,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setIsLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
    },
  },
});

export const {setIsLoading, setIsLoggedIn} = userSlice.actions;

export default userSlice.reducer;
