import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import {collection, getDocs, limit, query, where} from "firebase/firestore";
import {auth, db} from "../../firebase.config";
import {Profile} from "../../types";

export const fetchRecommendedProfiles = createAsyncThunk<Array<Profile>, number, {rejectValue: string}>(
  'user/fetchRecommendedProfiles',
    async function (maxDocs, {rejectWithValue}) {
      try {
        const docData = await getDocs(query(
          collection(db, 'users'),
          limit(maxDocs),
          where('id', '!=', auth.currentUser!.uid),
          // where('isHiddenProfile', '==', false),
          // where('_dislikedProfiles', 'not-in', [auth.currentUser!.uid])
          )
        );
        const arrProfiles: Array<Profile> = [];
        docData.forEach((doc) => {
          arrProfiles.push(doc.data() as Profile);
        });
        return arrProfiles;
      } catch (error) {
        const typedError = error as Error;
        return rejectWithValue(typedError.message);
      }
    }
);

type userState = {
  isLoading: boolean,
  isLoggedIn: boolean,
  recs: {
    profiles: Array<Profile>,
    isLoading: boolean,
    error: any,
  },
}

const initialState: userState = {
  isLoading: true,
  isLoggedIn: false,
  recs: {
    profiles: [],
    isLoading: true,
    error: null,
  },
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendedProfiles.pending, (state) => {
        state.recs.isLoading = true;
        state.recs.error = null;
      })
      .addCase(fetchRecommendedProfiles.fulfilled, (state, action) => {
        state.recs.isLoading = false;
        state.recs.profiles = state.recs.profiles.concat(action.payload);
      })
      .addCase(fetchRecommendedProfiles.rejected, (state, action) => {
        state.recs.isLoading = false;
        state.recs.error = action.payload;
        state.recs.profiles = [];
      });
  }
});

export const {setIsLoading, setIsLoggedIn} = userSlice.actions;

export default userSlice.reducer;
