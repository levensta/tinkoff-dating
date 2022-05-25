import React, {FormEvent, useEffect, useRef} from 'react';
import {useAppDispatch, useAppSelector} from "hooks/redux-hooks";
import {NavLink, useParams} from "react-router-dom";
import {sendMessage, fetchMessages, fetchNewMessage} from "store/slices/userSlice";
import {auth, db} from "../firebase.config";
import ErrorMessage from "../components/ErrorMessage";
import Loader from "../components/Loaders/Loader";
import style from "../components/elements.module.css"
import cn from "classnames";
import {collection, doc, DocumentData, onSnapshot, query, where} from "firebase/firestore";
import Message from 'components/Message';

const ChatPage = () => {
  const isFirstRender = useRef(true);
  const {chatId} = useParams();
  const dispatch = useAppDispatch();
  const msgContainer = useRef<HTMLInputElement>(null);
  const inputMsg = useRef<HTMLInputElement>(null);
  const {messages, isLoading, error} = useAppSelector(state => state.user.chat);
  // const currentProfile = useAppSelector(state => state.user.chat.currentProfile);

  useEffect(() => {
    dispatch(fetchMessages(chatId!));
    console.log('fetched')
    // dispatch(fetchChatProfile(chatId!))

    const q = query(
      collection(db, 'users_chats'),
      where('user', '!=', doc(db, 'users', auth.currentUser!.uid)),
      where('chat', '==', doc(db, 'chats', chatId!)));

    const unsub = onSnapshot(q, (qSnapshot) => {
      let msgData: DocumentData;
      qSnapshot.forEach((docSnap) => {
        msgData = docSnap.data();
      });
      if (!isFirstRender.current) {
        dispatch(fetchNewMessage(msgData!.lastMsgId))
      }
      isFirstRender.current = false;
    });
    return unsub;
  }, [chatId]);

  useEffect(() => {
    if (msgContainer) {
      msgContainer.current!.addEventListener('DOMNodeInserted', (event: any) => {
        const { currentTarget: target } = event;
        target!.scroll({ top: target!.scrollHeight, behavior: 'smooth' });
      });
    }
  }, []);

  const handleSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputMsg.current?.value) {
      dispatch(sendMessage({
          textValue: inputMsg.current.value,
          senderId: auth.currentUser!.uid,
          chatId: chatId!
        })
      );
      inputMsg.current.value = '';
    }
  };


  return (
    <section className={"w-full h-full flex flex-col"}>
      <div className={"max-h-24 border bg-white flex items-center p-6 font-medium text-xl justify-between"}>
        <span>Это ваш чат</span>
        <NavLink to={'/matches'} className={"rounded-full border-2 border-stone-900 p-0.5"}>
          <svg className="text-stone-800 w-6 h-6 hover:rotate-90 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </NavLink>
      </div>
      <div className={"w-full h-full flex flex-col p-3 overflow-auto"} ref={msgContainer}>
        {isLoading ? <Loader sizeStyle={"w-8 h-8"}/>
          : error ? <ErrorMessage error={error} />
            : messages.map(msg => (
              <Message
                key={msg.id}
                text={msg.text}
                isSelf={msg.senderId === auth.currentUser?.uid}
              />
            ))
        }
      </div>
      <form className="flex border w-full h-24" onSubmit={handleSend}>
        <input
          ref={inputMsg}
          type="text"
          className={"p-3 outline-none h-full grow pl-6"}
          placeholder={"Введите сообщение"}
        />
        <button
          className={cn(style.btn, "font-bold text-white text-center tracking-wide h-full grow-0 basis-40")}>
          ОТПРАВИТЬ
        </button>
      </form>
    </section>
  );
};

export default ChatPage;
