import {
  Button,
  Group,
  Loader,
  ScrollArea,
  Stack,
  TextInput,
} from "@mantine/core";
import { useContext, useEffect, useRef } from "react";
import { Message } from "../../components/Message";

import { IUser } from "../../models/user";
import { ChatContext } from "../../utils/chatContext";

export const Chat = ({ users }: { users: IUser[] }) => {
  const [messages, sendMessage] = useContext(ChatContext);
  const viewport = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollToBottom = () =>
    viewport?.current?.scrollTo({
      top: viewport.current.scrollHeight,
      behavior: "smooth",
    });

  const handleSendMessage = () => {
    if (inputRef?.current) {
      const val = inputRef.current.value;
      if (val) sendMessage(val);
      inputRef.current.value = "";
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
          ref={inputRef}
          placeholder="Type message..."
          style={{ flexGrow: 1 }}
          onKeyUp={(e) => (e.key === "Enter" ? handleSendMessage() : undefined)}
        />
        <Button onClick={() => handleSendMessage()}>Send</Button>
      </Group>
    </Stack>
  );
};
