import { Box } from "@mantine/core";
import { useContext, useEffect } from "react";
import { HeaderContext } from "../../utils/context";

const Dashboard = () => {
  const [_, setHeaderText] = useContext(HeaderContext);
  useEffect(() => {
    setHeaderText("Lets look at what we have here");
  }, [setHeaderText]);

  return <Box>Dashboard content</Box>;
};

export default Dashboard;
