import { Button, Image, Stack } from "@mantine/core";
import { Link, useLocation } from "react-router-dom";
import serverError from "./500.svg";

export default function ServerError() {
  const location = useLocation() as any;
  const from = location.state?.from?.pathname || "/";

  return (
    <Stack
      sx={() => ({
        justifyContent: "center",
      })}
      align={"center"}
    >
      <Image
        src={serverError}
        alt="500 icon"
        style={{
          width: "30%",
        }}
      />
      <Button component={Link} to={from}>
        Try again
      </Button>
      <Button variant={"subtle"} component={Link} to="/">
        Go Home
      </Button>
    </Stack>
  );
}
