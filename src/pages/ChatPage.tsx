import React, {FormEvent, useEffect, useRef} from 'react';
import {useAppDispatch, useAppSelector} from "hooks/redux-hooks";
import {NavLink, useParams} from "react-router-dom";
import {addMessage, fetchMessages} from "store/slices/userSlice";
import {auth} from "../firebase.config";
import ErrorMessage from "../components/ErrorMessage";
import Loader from "../components/Loaders/Loader";
import Message from "../components/Message";
import style from "../components/elements.module.css"
import cn from "classnames";

const ChatPage = () => {
  const {chatId} = useParams();
  const dispatch = useAppDispatch();
  const msgContainer = useRef<HTMLInputElement>(null);
  const inputMsg = useRef<HTMLInputElement>(null);
  const {info, isLoading, error} = useAppSelector(state => state.user.messages);

  useEffect(() => {
    dispatch(fetchMessages(chatId!));
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
      dispatch(addMessage({
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
            : info.map(msg => (
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
