import { Accordion, Center, Loader, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { GiRank1 } from "react-icons/gi";
import { APIClient, Method } from "../../../api/client";
import { IRank } from "../../../models/rank";

const RanksAccordion = ({ userRank = "private" }: { userRank?: string }) => {
  const client = new APIClient();

  const { isLoading, data: ranks } = useQuery<IRank[]>(["ranks"], () =>
    client.ranks(Method.GET)
  );

  if (!ranks || ranks.length === 0) {
    return <Text weight="bold">Ranks summary</Text>;
  }

  return (
    <>
      <Text weight="bold">Ranks summary</Text>
      {!isLoading ? (
        <Accordion
          variant="contained"
          radius="md"
          defaultValue={userRank.toLowerCase()}
          styles={(theme) => ({ control: { color: "white" } })}
        >
          {ranks.map((r) => (
            <Accordion.Item key={r.name} value={r.name.toLowerCase()}>
              <Accordion.Control icon={<GiRank1 size={20} color="yellow" />}>
                {r.name}
              </Accordion.Control>
              <Accordion.Panel>{r.description}</Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      ) : (
        <Center
          sx={(theme) => ({
            height: "100%",
            borderStyle: "solid",
            borderColor: theme.colors.gray[8],
            borderRadius: theme.radius.md,
          })}
        >
          <Loader />
        </Center>
      )}
    </>
  );
};

export default RanksAccordion;
