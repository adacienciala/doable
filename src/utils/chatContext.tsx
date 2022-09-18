import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { IMessage } from "../models/message";
import { messagesStorage } from "./socket";

export const socket = io(process.env.REACT_APP_DOABLE_API!);

export const useChat = (initial?: IMessage[]) => {
  const [messages, setMessages] = useState<IMessage[]>(
    initial || messagesStorage
  );
  useEffect(() => {
    console.log("[useChat] messages effect", messages.length);
  }, [messages]);

  useEffect(() => {
    console.log(
      "[useChat]:[mount] set from messagesStorage",
      messagesStorage.length
    );
    setMessages(messagesStorage);
    return () => {
      messagesStorage.splice(0, messagesStorage.length);
      messagesStorage.push(...messages);
      console.log(
        "[useChat]:[unmout] set messagesStorage",
        messagesStorage.length,
        " from messages",
        messages.length
      );
    };
  }, []);

  console.log("[useChat]:[render]");

  return { state: messages, stateSetter: setMessages };
};
