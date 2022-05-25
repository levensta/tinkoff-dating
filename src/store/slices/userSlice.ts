import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  arrayUnion,
  orderBy,
  query,
  where,
  serverTimestamp,
  setDoc
} from "firebase/firestore";
import {auth, db} from "firebase.config";
import {IChat, IMessage, IProfile} from "types";
import {signOut} from "firebase/auth";
import { v4 as uuidv4 } from 'uuid';

export const fetchRecommendedProfiles = createAsyncThunk<Array<IProfile>, number, {rejectValue: string}>(
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

      const userWatchedProfiles = (userDoc.data()! as IProfile)._watchedProfiles;
      const recProfiles: Array<IProfile> = [];
      docData.forEach((doc) => {
        const data = doc.data() as IProfile;
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

export const fetchChats = createAsyncThunk<Array<IChat>, void, {rejectValue: string}>(
  'user/fetchChats',
  async function (_, {rejectWithValue}) {
    try {
      const userRef = doc(db, 'users', auth.currentUser!.uid);
      const docData = await getDocs(query(
        collection(db, 'users_chats'),
        where('user', '==', userRef)
      ));

      const arrChats: Array<IChat> = [];
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

export const fetchMessages = createAsyncThunk<Array<IMessage>, string, {rejectValue: string}>(
  'user/fetchMessages',
  async function (chatId, {rejectWithValue}) {
    try {
      const refChat = doc(db, 'chats', chatId);
      const docData = await getDocs(query(
        collection(db, 'messages'),
        where('chat', '==', refChat),
        orderBy('createdAt'),
      ));

      const arrMessages: Array<IMessage> = [];
      docData.forEach((doc) => {
        const chatData = doc.data();
        arrMessages.push({
          id: doc.id,
          senderId: chatData.senderId.id,
          text: chatData.text,
        });
      });
      return arrMessages;
    } catch (error) {
      const typedError = error as Error;
      return rejectWithValue(typedError.message);
    }
  }
);

// export const fetchChatProfile = createAsyncThunk<IProfile, string, {rejectValue: string}>(
//   'user/fetchUserProfile',
//   async function (chatId, {rejectWithValue}) {
//     try {
//       const refChat = doc(db, 'chats', chatId);
//       // const refCurrentUser = doc(db, 'users', auth.currentUser!.uid);
//
//       const docData = await getDocs(query(
//         collection(db, 'users_chats'),
//         where('chat', '==', refChat),
//         // where('user', '!=', refCurrentUser),
//       ));
//
//       let userId = {};
//       docData.forEach((doc) => {
//         const data = doc.data();
//         if (auth.currentUser!.uid !== data.user.id) {
//           userId = data.user.id;
//           getDoc(data.user);
//         }
//       });
//       return userId as IProfile;
//     } catch (error) {
//       const typedError = error as Error;
//       return rejectWithValue(typedError.message);
//     }
//   }
// );

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
        const likedUser = likedUserDoc.data() as IProfile;
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

export const createChat = createAsyncThunk<IChat, string, {rejectValue: string}>(
  'user/createChat',
  async function (likedUid, {rejectWithValue}) {
    try {
      const refChatDoc = await addDoc(collection(db, 'chats'), {
        createdAt: serverTimestamp(),
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
        lastMsgId: null,
      });
      // for matched user
      await addDoc(collection(db, 'users_chats'), {
        avatarURL: auth.currentUser!.photoURL,
        chat: refChatDoc,
        user: doc(db, 'users', likedUid),
        name: auth.currentUser!.displayName,
        lastMessage: 'Новый чат',
        lastMsgId: null,
      });
      return {
        avatarURL: likedUser!.avatarURL,
        chatId: refChatDoc.id,
        uid: auth.currentUser!.uid,
        name: likedUser!.name,
        lastMessage: 'Новый чат',
        lastMsgId: null,
      };
    } catch (error) {
      const typedError = error as Error;
      return rejectWithValue(typedError.message);
    }
  }
);

export const sendMessage = createAsyncThunk<void, {textValue: string, senderId: string, chatId: string}, {rejectValue: string}>(
  'user/sendMessage',
  async function ({textValue, senderId, chatId}, {rejectWithValue, dispatch}) {
    try {
      const msgId = uuidv4();
      await setDoc(doc(db, 'messages', msgId), {
        chat: doc(db, 'chats', chatId),
        senderId: doc(db, '/users/', senderId),
        text: textValue,
        lastMsgId: msgId,
        createdAt: serverTimestamp(),
      });
      dispatch(updateLastMessage({
        chatId,
        lastMessage: textValue,
        lastMsgId: msgId,
      }));
    } catch (error) {
      const typedError = error as Error;
      return rejectWithValue(typedError.message);
    }
  }
);

export const fetchNewMessage = createAsyncThunk<IMessage, string, {rejectValue: string}>(
  'user/fetchNewMessage',
  async function (msgId, {rejectWithValue}) {
    try {
      const msgDoc = await getDoc(doc(db, 'messages', msgId));
      const msgData = msgDoc.data();

      return {
        id: msgId,
        senderId: msgData!.senderId.id,
        text: msgData!.text,
      }
    } catch (error) {
      const typedError = error as Error;
      return rejectWithValue(typedError.message);
    }
  }
);

export const updateLastMessage = createAsyncThunk<Omit<IChat, 'name'>, {chatId: string, lastMessage: string, lastMsgId: string}, {rejectValue: string}>(
  'user/updateLastMessage',
  async function ({chatId, lastMessage, lastMsgId}, {rejectWithValue}) {
    try {
      const refChat = doc(db, 'chats', chatId);
      const docData = await getDocs(query(
          collection(db, 'users_chats'),
          where('chat', '==', refChat),
        )
      );
      docData.forEach(doc => {
        updateDoc(doc.ref, {
          lastMessage,
          lastMsgId,
        });
      });
      return {
        chatId,
        lastMessage,
      }
    } catch (error) {
      const typedError = error as Error;
      return rejectWithValue(typedError.message);
    }
  }
);

export const logOut = createAsyncThunk(
  'user/logOut',
  async function () {
    await signOut(auth);
  }
);

type userState = {
  isLoading: boolean,
  isLoggedIn: boolean,
  recs: {
    profiles: Array<IProfile>,
    isLoading: boolean,
    error: string | null,
  },
  matches: {
    chats: Array<IChat>,
    isLoading: boolean,
    error: string | null,
  },
  chat: {
    currentProfile: {
      info: IProfile | null,
      isLoading: boolean,
      error: string | null,
    },
    messages: Array<IMessage>,
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
    isLoading: true,
    error: null,
  },
  chat: {
    currentProfile: {
      info: null,
      isLoading: true,
      error: null,
    },
    messages: [],
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
      .addCase(fetchMessages.pending, (state, action) => {
        state.chat.isLoading = true;
        state.matches.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.chat.isLoading = false;
        state.chat.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.chat.isLoading = false;
        state.matches.error = action.payload!;
      })
      .addCase(fetchNewMessage.fulfilled, (state, action) => {
        state.chat.messages.push(action.payload);
      })
      .addCase(updateLastMessage.fulfilled, (state, action) => {
        state.matches.chats = state.matches.chats.map(item => {
          if (item.chatId === action.payload.chatId) {
            return {...item, lastMessage: action.payload.lastMessage };
          }
          return item;
        });
      })
      // .addCase(fetchChatProfile.pending, (state, action) => {
      //   state.messages.currentProfile.isLoading = true;
      //   state.messages.currentProfile.error = null;
      // })
      // .addCase(fetchChatProfile.fulfilled, (state, action) => {
      //   state.messages.currentProfile.isLoading = false;
      //   state.messages.currentProfile.info = action.payload;
      // })
      // .addCase(fetchChatProfile.rejected, (state, action) => {
      //   state.messages.currentProfile.isLoading = false;
      //   state.messages.currentProfile.error = action.payload!;
      // })
      .addCase(logOut.fulfilled, (state) => {
        state.isLoggedIn = false;
      });
  }
});

export const {setIsLoading, setIsLoggedIn} = userSlice.actions;

export default userSlice.reducer;
