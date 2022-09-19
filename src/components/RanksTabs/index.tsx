import {
  Button,
  Center,
  Loader,
  Modal,
  Stack,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { RiQuestionFill } from "react-icons/ri";
import { APIClient, Method } from "../../api/client";
import { IRank } from "../../models/rank";
import { IUser } from "../../models/user";

const RankName = {
  Private: "Private",
  Corporal: "Corporal",
  Sergeant: "Sergeant",
};

const rankStories = {
  [RankName.Private]: (name: string) => (
    <div>
      <p>
        It was a beautiful day. You were walking around the park, not caring for
        anything in the world, especially not for the work you were supposed to
        be doing that day. Birds were chirping, sun was shining, and you were
        sipping happily on a drink that you got for free from a strange woman
        just a few minutes ago. Not everyday you get to taste such a good citrus
        drink from a chiton-wearing, greek-looking, unbelievably beautiful lady.
        Indeed an extraordinary day!
      </p>
      <p>
        And then, it was night. Or you passed out. Nevertheless - it was dark.
        And in the dark, you heard a feminine voice.{" "}
        <i>“Your life’s zest is awaiting for you…”</i>.
      </p>
      <p>
        And then, it was day again. But something was wrong. You weren’t a human
        anymore! You woke up as a cartoon animal, in a cartoon world, full of
        cartoon animals. Wait, other animals?
      </p>
      <p></p>
      <p>
        - <b>{name}</b>! What the heck have you done!
      </p>
    </div>
  ),
  [RankName.Corporal]: (name: string) => (
    <div>
      <p>
        You turn around and you see an animal that is somehow resembling your
        best friend. They’re furious.
      </p>
      <p>
        - <b>{name}</b>, it was all over the internet, DO NOT drink the potion!
        It takes only one person to turn the city into a cartoon version of a
        farm!{" "}
      </p>
      <p>
        To be honest you have no idea why they’re screaming at you. Who could
        have known that drinking potions from strangers would do any trouble?
      </p>

      <p>- I’ve texted you like a milion times!</p>

      <p>
        Oh yes, they did. But you fought it’s about that thing you said you will
        do for them and, well… you didn’t. You open your phone and you click on
        the article they linked you.
      </p>

      <p>
        Kirke, the greek goddess, strikes again! City by city, the world is
        turning into a cartoon full of animals. The “Big Town News” managed to
        get an interview with the goddess. Here’s what she has to say on the
        matter: “I have nothing to say” - she proclaimed. - “Lemonade?”
      </p>
      <p>
        You look at your friend with your brow raised. - See the comments, it’s
        all there! Apparently she was supposed to have something delivered but
        the postman never bothered to get to her house on the cliff. And she
        decided she will get all the procrastinators, and she will teach them a
        lesson. So she started handing out lemonade and talking something about
        some zest of life! When you find it, you turn the city back to normal.
      </p>
      <p>Great, that sounds like work. It’s going to be a disaster.</p>
      <p>
        - Some people already managed to do it! They said that the only thing
        they needed to do was do some tasks, here or there, and the more they
        checked off their list, the closer they got to the Zest. They won’t say
        what the Zest actually is or where you can find it but I saw someone
        turn back human when they-
      </p>
      <p>And then your friend disappeared.</p>
    </div>
  ),
  [RankName.Sergeant]: (name: string) =>
    `You called your friend but the signal was weak. Will you ever see them again? Will you manage to find the Zest and save the city?`,
};

export const RanksTabs = ({
  handleCloseModal,
  user,
  openStory,
}: {
  user: IUser;
  openStory?: boolean;
  handleCloseModal?: () => void;
}) => {
  const client = new APIClient();
  const [story, setStory] = useState(
    openStory ? user.statistics.points.rank : ""
  );

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
          <Stack justify="space-between" align="center">
            <Text align="justify" lineClamp={5}>
              {rankStories[rankName](user.name)}
            </Text>
            <Button variant="light" onClick={() => setStory(rankName)}>
              Read more
            </Button>
          </Stack>
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
    <>
      <Modal
        opened={story !== ""}
        onClose={() => {
          if (openStory && handleCloseModal) {
            handleCloseModal();
          }
          setStory("");
        }}
        title={
          <Title align="center" style={{ width: "100%" }}>
            {story}
          </Title>
        }
        radius={20}
        overlayBlur={5}
        size="80%"
        styles={(theme) => ({
          modal: {
            background: "#ffffff4c",
            color: "white",
          },
          title: { width: "100%" },
        })}
      >
        <Text align="justify">
          {story !== "" && rankStories[story](user.name)}
        </Text>
      </Modal>
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
    </>
  );
};
