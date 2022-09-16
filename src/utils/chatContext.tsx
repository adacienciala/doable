import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { IMessage } from "../models/message";
import { messagesStorage } from "./socket";

export const socket = io(process.env.REACT_APP_DOABLE_API!);

export const useChat = (initial: IMessage[]) => {
  const [messages, setMessages] = useState<IMessage[]>(initial);
  useEffect(() => {
    console.log("useChat render", messages.length);
  }, [messages]);

  useEffect(() => {
    console.log("useChat state", messagesStorage.length);
    setMessages(messagesStorage);
    return () => {
      messagesStorage.splice(0, messagesStorage.length);
      messagesStorage.push(...messages);
      console.log("unmout useChat");
    };
  }, []);

  return { state: messages, stateSetter: setMessages };
};
