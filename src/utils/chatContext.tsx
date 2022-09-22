import { showNotification } from "@mantine/notifications";
import { createContext, Dispatch, useEffect, useState } from "react";
import { RiMessage3Line } from "react-icons/ri";
import { io } from "socket.io-client";
import { IMessage } from "../models/message";

export const ChatContext = createContext<
  [IMessage[], (value: string) => void, Dispatch<React.SetStateAction<boolean>>]
>([[], (value: string) => {}, () => {}]);

const socket = io(process.env.REACT_APP_DOABLE_API!);
const DEBUG = false;

export const ChatContextProvider = (props: any) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [, setIsConnected] = useState(false);
  const [, setIsAuthenticated] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const doableId = localStorage.getItem("doableId")!;
  const partyId =
    localStorage.getItem("partyId") ??
    window.location.pathname.split("/").pop();
  console.log("partyId", partyId);

  // useEffect(() => {
  //   if (DEBUG)
  //     console.log(
  //       "[ChatContext] isConnected",
  //       isConnected,
  //       "isAuth",
  //       isAuthenticated
  //     );
  //   if (isConnected && !isAuthenticated) {
  //     if (DEBUG) console.log("=> try to auth");
  //     socket?.emit("authenticate", {
  //       token: localStorage.getItem("token")!,
  //       tokenSelector: localStorage.getItem("tokenSelector")!,
  //     });
  //   }
  // }, [isConnected, isAuthenticated]);

  useEffect(() => {
    if (DEBUG) console.log("[ChatContext] messages effect", messages.length);
  }, [messages]);

  const getAuthInfo = () => ({
    token: localStorage.getItem("token")!,
    tokenSelector: localStorage.getItem("tokenSelector")!,
    partyId: partyId,
  });

  useEffect(() => {
    const shouldReconnect = loggedIn || (doableId && partyId);
    if (shouldReconnect && !socket.hasListeners("connection")) {
      if (DEBUG) console.log("[ChatContext] setting listeners");

      socket.connect();

      socket.on("connection", () => {
        if (DEBUG) console.log("[connection]");
        setIsConnected(true);
        if (DEBUG) console.log("=> try auth");
        socket?.emit("authenticate", getAuthInfo());
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

      socket.on("auth denied", (data: any) => {
        if (DEBUG) console.log("[auth denied]", data);
        setIsAuthenticated(false);
      });

      socket.on("message", (data: IMessage & { userDisplay: string }) => {
        if (DEBUG) console.log("<= message", data);
        data.date = new Date(data.date);

        const { userDisplay, ...messageData } = data;

        if (window.location.pathname !== "/party" && data.userId !== doableId) {
          showNotification({
            icon: <RiMessage3Line />,
            autoClose: 4000,
            message: messageData.message,
            title: userDisplay,
          });
        }

        setMessages((prev) => {
          const newMessages = [...(prev ?? []), data];
          if (DEBUG) console.log(`  - current messages: ${prev?.length}`);
          if (DEBUG) console.log(`  - new messages: ${newMessages?.length}`);
          return [...(prev ?? []), messageData];
        });
      });
    } else {
      setIsConnected(false);
      setIsAuthenticated(false);
      socket?.off();
      socket?.disconnect();
    }

    return () => {
      if (DEBUG) console.log("[ChatContext] disconnect");
      socket?.off();
      socket?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn, partyId]);

  const sendMessage = (value: string) => {
    const newMessage: IMessage = {
      message: value,
      partyId: partyId!,
      userId: doableId,
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
