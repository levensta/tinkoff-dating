import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import {collection, doc, getDoc, getDocs, addDoc, updateDoc, arrayUnion, limit, query, where, serverTimestamp} from "firebase/firestore";
import {auth, db} from "firebase.config";
import {Chat, Profile} from "types";

export const fetchRecommendedProfiles = createAsyncThunk<Array<Profile>, number, {rejectValue: string}>(
  'user/fetchRecommendedProfiles',
    async function (maxDocs, {rejectWithValue}) {
    try {
      const userRef = doc(db, 'users', auth.currentUser!.uid);
      const userDoc = await getDoc(userRef);

      const docData = await getDocs(query(
        collection(db, 'users'),
        // limit(maxDocs),
        // where('id', '!=', auth.currentUser!.uid),
        where('isHiddenProfile', '==', false),
        )
      );

      const userWatchedProfiles = (userDoc.data()! as Profile)._watchedProfiles;
      const recProfiles: Array<Profile> = [];
      docData.forEach((doc) => {
        const data = doc.data() as Profile;
        if (!userWatchedProfiles.includes(data.id)) {
          recProfiles.unshift(data);
        }
      });
      return recProfiles;
    } catch (error) {
      const typedError = error as Error;
      return rejectWithValue(typedError.message);
    }
  }
);

export const fetchChats = createAsyncThunk<Array<Chat>, void, {rejectValue: string}>(
  'user/fetchChats',
  async function (_, {rejectWithValue}) {
    try {
      const userRef = doc(db, 'users', auth.currentUser!.uid);
      const docData = await getDocs(query(
        collection(db, 'users_chats'),
        where('user', '==', userRef)
      ));

      const arrChats: Array<Chat> = [];
      docData.forEach((doc) => {
        const chatData = doc.data();
        arrChats.push({
          avatarURL: chatData.avatarURL,
          chatId: chatData.chat.id,
          name: chatData.name,
          lastMessage: chatData.lastMessage,
        });
      });
      return arrChats;
    } catch (error) {
      const typedError = error as Error;
      return rejectWithValue(typedError.message);
    }
  }
);

export const swipeProfile = createAsyncThunk<string, {uid: string, isLike: boolean}, {rejectValue: string}>(
  'user/swipeProfile',
  async function ({uid, isLike}, {rejectWithValue, dispatch}) {
    try {
      const userRef = doc(db, 'users', auth.currentUser!.uid);
      await updateDoc(userRef, {
        _watchedProfiles: arrayUnion(uid),
      });

      if (isLike) {
        await updateDoc(userRef, {
          _likedProfiles: arrayUnion(uid),
        });
        const likedUserDoc = await getDoc(doc(db, 'users', uid));
        const likedUser = likedUserDoc.data() as Profile;
        if (likedUser._likedProfiles.includes(auth.currentUser!.uid)) {
          dispatch(createChat(uid));
        }
      }
      return uid;
    } catch (error) {
      const typedError = error as Error;
      return rejectWithValue(typedError.message);
    }
  }
);

export const createChat = createAsyncThunk<Chat, string, {rejectValue: string}>(
  'user/createChat',
  async function (likedUid, {rejectWithValue}) {
    try {
      const refChatDoc = await addDoc(collection(db, 'chats'), {
        timestamp: serverTimestamp(),
      });
      const refLikedUser = await getDoc(doc(db, 'users', likedUid));
      const likedUser = refLikedUser.data();

      // for current user
      await addDoc(collection(db, 'users_chats'), {
        avatarURL: likedUser!.avatarURL,
        chat: refChatDoc,
        user: doc(db, 'users', auth.currentUser!.uid),
        name: likedUser!.name,
        lastMessage: 'Новый чат',
      });
      // for matched user
      await addDoc(collection(db, 'users_chats'), {
        avatarURL: auth.currentUser!.photoURL,
        chat: refChatDoc,
        user: doc(db, 'users', likedUid),
        name: auth.currentUser!.displayName,
        lastMessage: 'Новый чат',
      });
      return {
        avatarURL: likedUser!.avatarURL,
        chatId: refChatDoc.id,
        uid: auth.currentUser!.uid,
        name: likedUser!.name,
        lastMessage: 'Новый чат'
      };
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
    error: string | null,
  },
  matches: {
    chats: Array<Chat>,
    profiles: Array<Profile>,
    isLoading: boolean,
    error: string | null,
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
  matches: {
    chats: [],
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendedProfiles.pending, (state) => {
        state.recs.isLoading = true;
        state.recs.error = null;
      })
      .addCase(fetchRecommendedProfiles.fulfilled, (state, action) => {
        state.recs.isLoading = false;
        state.recs.profiles.splice(0, 0, ...action.payload);
      })
      .addCase(fetchRecommendedProfiles.rejected, (state, action) => {
        state.recs.isLoading = false;
        state.recs.error = action.payload!;
        state.recs.profiles = [];
      })
      .addCase(swipeProfile.fulfilled, (state) => {
        state.recs.profiles.pop();
      })
      .addCase(swipeProfile.rejected, (state, action) => {
        state.recs.error = action.payload!;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.matches.chats.unshift(action.payload);
      })
      .addCase(createChat.rejected, (state, action) => {
        state.matches.error = action.payload!;
      })
      .addCase(fetchChats.pending, (state) => {
        state.matches.isLoading = true;
        state.matches.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.matches.isLoading = false;
        state.matches.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.matches.isLoading = false;
        state.matches.error = action.payload!;
      })
  }
});

export const {setIsLoading, setIsLoggedIn} = userSlice.actions;

export default userSlice.reducer;
