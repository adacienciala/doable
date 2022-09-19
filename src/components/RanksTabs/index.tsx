import { Center, Loader, Stack, Tabs, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { RiQuestionFill } from "react-icons/ri";
import { APIClient, Method } from "../../api/client";
import { IRank } from "../../models/rank";
import { IUser } from "../../models/user";

const RankName = {
  Private: "Private",
  Corporal: "Corporal",
  Sergeant: "Sergeant",
};

export const RanksTabs = ({ user }: { user?: IUser }) => {
  const client = new APIClient();

  const { data: ranks } = useQuery<IRank[]>(["ranks"], () =>
    client.ranks(Method.GET)
  );

  if (!ranks || ranks.length === 0) {
    return (
      <Center
        style={{
          borderRadius: "20px",
          height: "100%",
          borderColor: "yellow",
          borderStyle: "solid",
        }}
      >
        <Loader />
      </Center>
    );
  }

  const getRankId = (rankName?: string) =>
    ranks.findIndex((r) =>
      rankName ? r.name.toLowerCase() === rankName.toLowerCase() : -1
    );

  const currentRankId = getRankId(user?.statistics.points.rank);

  const RankItem = (rankName: string) => {
    const rank = ranks.find((r) => r.name === rankName);

    if (!rank) {
      return <Text>Something went wrong</Text>;
    }

    const rankUnblocked = currentRankId >= getRankId(rankName);

    return (
      <Center style={{ height: "100%" }}>
        {rankUnblocked ? (
          <Text lineClamp={4}>
            {rank?.description} asdsadsad asdsadsad asdsadasd sadsadsda
          </Text>
        ) : (
          <Stack align="center">
            <RiQuestionFill size={90} />
            <Text>
              <b>
                {user?.name} {user?.surname}
              </b>{" "}
              have not yet unblocked this part of the story.
            </Text>
          </Stack>
        )}
      </Center>
    );
  };

  return (
    <Tabs
      defaultValue={ranks[currentRankId].name}
      styles={(theme) => ({
        root: {
          display: "flex",
          flexDirection: "column",
          height: "100%",
          borderStyle: "solid",
          borderColor: theme.colors.yellow[6],
          borderRadius: "10px",
          overflow: "hidden",
        },
        panel: {
          height: "100%",
          padding: "20px",
        },
      })}
    >
      <Tabs.List grow position="apart">
        <Tabs.Tab value={RankName.Private}>{RankName.Private}</Tabs.Tab>
        <Tabs.Tab value={RankName.Corporal}>{RankName.Corporal}</Tabs.Tab>
        <Tabs.Tab value={RankName.Sergeant}>{RankName.Sergeant}</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value={RankName.Private}>
        {RankItem(RankName.Private)}
      </Tabs.Panel>
      <Tabs.Panel value={RankName.Corporal}>
        {RankItem(RankName.Corporal)}
      </Tabs.Panel>
      <Tabs.Panel value={RankName.Sergeant}>
        {RankItem(RankName.Sergeant)}
      </Tabs.Panel>
    </Tabs>
  );
};
