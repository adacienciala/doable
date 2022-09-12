import { Accordion, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { GiRank1 } from "react-icons/gi";
import { APIClient, Method } from "../../../api/client";
import { IRank } from "../../../models/rank";

const RanksAccordion = ({ userRank = "private" }: { userRank?: string }) => {
  const client = new APIClient();

  const { data: ranks } = useQuery<IRank[]>(["ranks"], () =>
    client.ranks(Method.GET)
  );

  if (!ranks || ranks.length === 0) {
    return <Text weight="bold">Ranks summary</Text>;
  }

  return (
    <>
      <Text weight="bold">Ranks summary</Text>
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
    </>
  );
};

export default RanksAccordion;
