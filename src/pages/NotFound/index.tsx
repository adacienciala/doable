import { Button, Image, Stack } from "@mantine/core";
import { Link } from "react-router-dom";
import notFound from "./404.svg";

export default function NotFound() {
  return (
    <Stack
      sx={() => ({
        justifyContent: "center",
      })}
      align={"center"}
    >
      <Image
        src={notFound}
        alt="404 icon"
        style={{
          width: "40%",
        }}
      />
      <Button component={Link} to="/">
        Go Home
      </Button>
    </Stack>
  );
}
