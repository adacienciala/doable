import {
  Button,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Sx,
  TextInput,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { Message } from "../../components/Message";

import { IMessage } from "../../models/message";
import { IUser } from "../../models/user";
import { socket, useChat } from "../../utils/chatContext";

export const Chat = ({ users, sx }: { users: IUser[]; sx?: Sx }) => {
  const [message, setMessage] = useState("");
  const { state: messages } = useChat([]);
  const viewport = useRef<HTMLDivElement>(null);
  const scrollToBottom = () =>
    viewport?.current?.scrollTo({
      top: viewport.current.scrollHeight,
      behavior: "smooth",
    });

  useEffect(() => {
    scrollToBottom();
    console.log("state in chat", messages.length);
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
  console.log("u", users, "l", messages.length);

  return (
    <Stack
      sx={[
        (theme) => ({
          borderRadius: "10px",
          padding: "20px",
          borderStyle: "solid",
          borderColor: theme.colors.yellow[6],
          borderWidth: "1px",
        }),
        sx,
      ]}
    >
      <ScrollArea type="hover" viewportRef={viewport}>
        {users && messages && messages.length > 0 ? (
          <Stack>
            {messages.map((m, idx) => (
              <Message
                key={idx}
                message={m}
                user={users.find((u) => u.doableId === m.userId)}
              />
            ))}
          </Stack>
        ) : (
          <Loader style={{ height: "100%" }} />
        )}
      </ScrollArea>
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
