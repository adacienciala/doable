import { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { IMessage } from "../models/message";

interface ISocket extends Socket {
  name?: string;
}

export const ChatContext = createContext<
  [IMessage[], ISocket | undefined, (value: string) => void]
>([[], undefined, (value: string) => {}]);

export const ChatContextProvider = (props: any) => {
  const [messages, setMessages] = useState<IMessage[]>([
    {
      partyId: "6360fa2d-ea79-45c3-80f3-8990f110f449",
      userId: "5b21189f-4ae0-4c40-916c-27f880baf0b4",
      message: "mocked",
      date: new Date(),
    },
  ]);
  const [socket, setSocket] = useState<ISocket | undefined>(undefined);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log(
      "[ChatContext] isConnected",
      isConnected,
      "isAuth",
      isAuthenticated
    );
    if (isConnected && !isAuthenticated) {
      console.log("=> try to auth");
      socket?.emit("authenticate", {
        token: localStorage.getItem("token")!,
        tokenSelector: localStorage.getItem("tokenSelector")!,
      });
    }
  }, [isConnected, isAuthenticated, socket]);

  //

  useEffect(() => {
    console.log("[ChatContext] messages effect", messages.length);
  }, [messages]);

  useEffect(() => {
    const s = io(process.env.REACT_APP_DOABLE_API!);
    console.log("[ChatContext] setSocket", s);
    setSocket(s);
  }, []);

  useEffect(() => {
    const events = [
      {
        name: "connection",
        callback: () => {
          console.log("[connection]");
          setIsConnected(true);
        },
      },
      {
        name: "disconnect",
        callback: () => {
          console.log("[disconnect]");
          setIsConnected(false);
          setIsAuthenticated(false);
          socket?.off();
        },
      },
      {
        name: "authenticated",
        callback: (data: IMessage[]) => {
          console.log("[authenticated]");
          console.log("  - current messages:", messages.length);
          console.log("  - history messages:", data.length);
          for (const m of data) {
            m.date = new Date(m.date);
          }
          // messagesStorage.splice(0, messagesStorage.length);
          // messagesStorage.push(...data);
          setMessages(data);
          setIsAuthenticated(true);
          setIsConnected(true);
        },
      },
      {
        name: "auth denied",
        callback: () => {
          console.log("[auth denied]");
          setIsAuthenticated(false);
        },
      },
      {
        name: "message",
        callback: (data: IMessage) => {
          console.log("<= message");
          data.date = new Date(data.date);
          const newMessages = [...(messages ?? []), data];
          console.log(`  - current messages: ${messages?.length}`);
          console.log(`  - new messages: ${newMessages?.length}`);
          setMessages(newMessages);
        },
      },
    ];

    for (const event of events) {
      if (socket && !socket.hasListeners(event.name)) {
        console.log("set listen to:", event.name);
        socket.on(event.name, event.callback);
      }
    }
  }, [messages, socket]);

  const sendMessage = (value: string) => {
    const newMessage: IMessage = {
      message: value,
      partyId: localStorage.getItem("partyId")!,
      userId: localStorage.getItem("doableId")!,
      date: new Date(),
    };
    console.log("[ChatContext] before send", messages.length);
    console.log("=> send: ", newMessage);
    socket?.emit("message", newMessage);
  };

  // useEffect(() => {
  //   return () => {
  //     messagesStorage.splice(0, messagesStorage.length);
  //     messagesStorage.push(...messages);
  //     console.log(
  //       "[ChatContext]:[unmout] set messagesStorage",
  //       messagesStorage.length,
  //       " from messages",
  //       messages.length
  //     );
  //     console.log("[ChatContext]:[unmout] socket closing");
  //     socket?.close();
  //   };
  // }, []);

  console.log("[ChatContext]:[render]");

  return (
    <ChatContext.Provider value={[messages, socket, sendMessage]}>
      {props.children}
    </ChatContext.Provider>
  );
};
