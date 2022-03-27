import { Button, Center } from "@mantine/core";
import { useNavigate } from "react-router-dom";

function Home() {
  let navigate = useNavigate();

  function logOut() {
    localStorage.clear();
    navigate("/");
  }

  return (
    <Center style={{ height: "100vh" }}>
      <Button onClick={logOut}>Logout</Button>
    </Center>
  );
}

export default Home;
