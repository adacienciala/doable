import { Button, Group, Image } from "@mantine/core";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import notFound from "./404.svg";

export default function NotFound() {
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenSelector");
    localStorage.removeItem("user");
  }, []);

  return (
    <Group
      direction="column"
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
    </Group>
  );
}
