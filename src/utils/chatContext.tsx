import { createContext, Dispatch, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { IMessage } from "../models/message";

export const ChatContext = createContext<
  [IMessage[], (value: string) => void, Dispatch<React.SetStateAction<boolean>>]
>([[], (value: string) => {}, () => {}]);

const socket = io(process.env.REACT_APP_DOABLE_API!);
const DEBUG = true;

export const ChatContextProvider = (props: any) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (DEBUG)
      console.log(
        "[ChatContext] isConnected",
        isConnected,
        "isAuth",
        isAuthenticated
      );
    if (isConnected && !isAuthenticated) {
      if (DEBUG) console.log("=> try to auth");
      socket?.emit("authenticate", {
        token: localStorage.getItem("token")!,
        tokenSelector: localStorage.getItem("tokenSelector")!,
      });
    }
  }, [isConnected, isAuthenticated]);

  useEffect(() => {
    if (DEBUG) console.log("[ChatContext] messages effect", messages.length);
  }, [messages]);

  useEffect(() => {
    const shouldReconnect = loggedIn || localStorage.getItem("doableId")!;
    if (shouldReconnect && !socket.hasListeners("connection")) {
      if (DEBUG) console.log("[ChatContext] setting listeners");

      socket.connect();

      socket.on("connection", () => {
        if (DEBUG) console.log("[connection]");
        setIsConnected(true);
      });

      socket.on("disconnect", () => {
        if (DEBUG) console.log("[disconnect]");
        setIsConnected(false);
        setIsAuthenticated(false);
      });

      socket.on("authenticated", (data: IMessage[]) => {
        if (DEBUG) console.log("[authenticated]");
        if (DEBUG) console.log("  - current messages:", messages.length);
        if (DEBUG) console.log("  - history messages:", data.length);
        for (const m of data) {
          m.date = new Date(m.date);
        }
        setMessages(data);
        setIsConnected(true);
        setIsAuthenticated(true);
      });

      socket.on("auth denied", () => {
        if (DEBUG) console.log("[auth denied]");
        setIsAuthenticated(false);
      });

      socket.on("message", (data: IMessage) => {
        if (DEBUG) console.log("<= message");
        data.date = new Date(data.date);

        setMessages((prev) => {
          const newMessages = [...(prev ?? []), data];
          if (DEBUG) console.log(`  - current messages: ${prev?.length}`);
          if (DEBUG) console.log(`  - new messages: ${newMessages?.length}`);
          return [...(prev ?? []), data];
        });
      });
    } else {
      setIsConnected(false);
      setIsAuthenticated(false);
      socket?.off();
      socket?.disconnect();
    }

    return () => {
      socket?.off();
      socket?.disconnect();
    };
  }, [loggedIn]);

  const sendMessage = (value: string) => {
    const newMessage: IMessage = {
      message: value,
      partyId: localStorage.getItem("partyId")!,
      userId: localStorage.getItem("doableId")!,
      date: new Date(),
    };
    if (DEBUG) console.log("[ChatContext] before send", messages.length);
    if (DEBUG) console.log("=> send: ", newMessage);
    socket?.emit("message", newMessage);
  };

  return (
    <ChatContext.Provider value={[messages, sendMessage, setLoggedIn]}>
      {props.children}
    </ChatContext.Provider>
  );
};
