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
import { socket } from "../../utils/chatContext";

const mockMess: IMessage[] = [
  {
    partyId: "6360fa2d-ea79-45c3-80f3-8990f110f449",
    userId: "5b21189f-4ae0-4c40-916c-27f880baf0b4",
    message: "asd",
    date: new Date("2022-09-16T00:21:54.145Z"),
  },
  {
    partyId: "6360fa2d-ea79-45c3-80f3-8990f110f449",
    userId: "5b21189f-4ae0-4c40-916c-27f880baf0b4",
    message: "noice",
    date: new Date("2022-09-16T00:25:20.605Z"),
  },
  {
    partyId: "6360fa2d-ea79-45c3-80f3-8990f110f449",
    userId: "5b21189f-4ae0-4c40-916c-27f880baf0b4",
    message: "noice 2",
    date: new Date("2022-09-16T00:26:28.057Z"),
  },
  {
    partyId: "6360fa2d-ea79-45c3-80f3-8990f110f449",
    userId: "cda24f8a-5134-409b-b7fa-80b6f2f93546",
    message: "Mamy to",
    date: new Date("2022-09-16T00:33:39.927Z"),
  },
  {
    partyId: "6360fa2d-ea79-45c3-80f3-8990f110f449",
    userId: "cda24f8a-5134-409b-b7fa-80b6f2f93546",
    message: "Mamy to",
    date: new Date("2022-09-16T00:33:39.927Z"),
  },
  {
    partyId: "6360fa2d-ea79-45c3-80f3-8990f110f449",
    userId: "5b21189f-4ae0-4c40-916c-27f880baf0b4",
    message: "ha",
    date: new Date("2022-09-16T00:34:22.328Z"),
  },
  {
    partyId: "6360fa2d-ea79-45c3-80f3-8990f110f449",
    userId: "5b21189f-4ae0-4c40-916c-27f880baf0b4",
    message: "It's",
    date: new Date("2022-09-16T00:42:37.784Z"),
  },
  {
    partyId: "6360fa2d-ea79-45c3-80f3-8990f110f449",
    userId: "cda24f8a-5134-409b-b7fa-80b6f2f93546",
    message: "Alive",
    date: new Date("2022-09-16T00:42:42.201Z"),
  },
  {
    partyId: "6360fa2d-ea79-45c3-80f3-8990f110f449",
    userId: "cda24f8a-5134-409b-b7fa-80b6f2f93546",
    message: "Mamma",
    date: new Date("2022-09-16T00:49:19.768Z"),
  },
  {
    partyId: "6360fa2d-ea79-45c3-80f3-8990f110f449",
    userId: "5b21189f-4ae0-4c40-916c-27f880baf0b4",
    message: "Mia",
    date: new Date("2022-09-16T00:49:22.835Z"),
  },
];

export const Chat = ({ users }: { users: IUser[] }) => {
  const [message, setMessage] = useState("");
  // const { state: messages } = useChat(mockMess);
  const viewport = useRef<HTMLDivElement>(null);
  const scrollToBottom = () =>
    viewport?.current?.scrollTo({
      top: viewport.current.scrollHeight,
      behavior: "smooth",
    });
  const messages = mockMess;

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

  const isLoading = !(users && messages && messages.length > 0);

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
        {isLoading ? (
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
