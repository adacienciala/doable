import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { io } from "socket.io-client";
import { IMessage } from "../models/message";

export const ChatContext = createContext<
  [IMessage[], Dispatch<SetStateAction<IMessage[]>>]
>([[], () => undefined]);

export const socket = io(process.env.REACT_APP_DOABLE_API!);

export const ChatContextProvider = (props: any) => {
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    console.log("context state", messages.length);
    return () => {
      console.log("unmout contextaedf");
    };
  }, [messages]);

  return (
    <ChatContext.Provider value={[messages, setMessages]}>
      {props.children}
    </ChatContext.Provider>
  );
};
