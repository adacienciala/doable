import {
  Button,
  Group,
  Loader,
  ScrollArea,
  Stack,
  TextInput,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { Message } from "../../components/Message";

import { IMessage } from "../../models/message";
import { IUser } from "../../models/user";
import { socket, useChat } from "../../utils/chatContext";

export const Chat = ({ users }: { users: IUser[] }) => {
  const [message, setMessage] = useState("");
  const { state: messages } = useChat();
  const viewport = useRef<HTMLDivElement>(null);
  const scrollToBottom = () =>
    viewport?.current?.scrollTo({
      top: viewport.current.scrollHeight,
      behavior: "smooth",
    });

  useEffect(() => {
    console.log("[chat] messages effect", messages.length);
  }, [messages]);

  const sendMessage = (value: string) => {
    const newMessage: IMessage = {
      message: value,
      partyId: localStorage.getItem("partyId")!,
      userId: localStorage.getItem("doableId")!,
      date: new Date(),
    };
    console.log("=> send: ", newMessage);
    socket.emit("message", newMessage);
    setMessage("");
  };

  console.log("[chat]:[render] messages", messages.length);
  scrollToBottom();

  return (
    <Stack
      justify="space-between"
      sx={(theme) => ({
        borderRadius: "10px",
        padding: "20px",
        borderStyle: "solid",
        borderColor: theme.colors.yellow[6],
        borderWidth: "1px",
        width: "400px",
        height: "100%",
        overflow: "hidden",
      })}
    >
      <Stack
        style={{
          display: "flex",
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        {!(users && messages && messages.length > 0) ? (
          <Loader
            style={{
              width: "100%",
              alignSelf: "center",
              marginTop: "auto",
              marginBottom: "auto",
            }}
          />
        ) : (
          <ScrollArea type="hover" viewportRef={viewport}>
            <Stack style={{ width: "100%" }}>
              {messages.map((m, idx) => (
                <Message
                  key={idx}
                  message={m}
                  user={users.find((u) => u.doableId === m.userId)}
                />
              ))}
            </Stack>
          </ScrollArea>
        )}
      </Stack>

      <Group>
        <TextInput
          placeholder="Type message..."
          style={{ flexGrow: 1 }}
          value={message}
          onChange={(e) => setMessage(e.currentTarget.value)}
          onKeyUp={(e) =>
            e.key === "Enter" ? sendMessage(message) : undefined
          }
        />
        <Button onClick={() => sendMessage(message)}>Send</Button>
      </Group>
    </Stack>
  );
};
