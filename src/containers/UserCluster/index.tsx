import { Avatar, Tooltip } from "@mantine/core";
import avatar from "animal-avatar-generator";
import { RiCompass3Fill } from "react-icons/ri";
import { IParty } from "../../models/party";
import { IUser } from "../../models/user";

const usersShownNumber = 2;

export const UserCluster = ({
  users: { owner = [], party = [] },
}: {
  users: { owner: IUser[]; party: IParty[] };
}) => {
  const ownerMapped = owner.map((o) => ({
    label: `${o.name} ${o.surname}`,
    coverSrc: `data:image/svg+xml;UTF-8,${encodeURIComponent(
      avatar(o.settings.avatarSeed)
    )}`,
  }));
  const partyMapped = party.map((p) => ({ label: p.name, coverSrc: p.cover }));
  const data = [...ownerMapped, ...partyMapped];

  const usersShown = data.slice(0, usersShownNumber);
  const usersHidden =
    data.length > usersShownNumber ? data.slice(usersShownNumber) : null;
  return (
    <>
      <Tooltip.Group openDelay={300} closeDelay={100}>
        <Avatar.Group spacing="sm">
          {usersShown.map((u: any, idx) => (
            <Tooltip key={idx} label={u.label} withArrow>
              <Avatar
                src={u.coverSrc}
                radius="xl"
                sx={(theme) => ({
                  borderStyle: "none",
                })}
              >
                <RiCompass3Fill size={30} />
              </Avatar>
            </Tooltip>
          ))}
          {usersHidden && (
            <Avatar radius="xl">{`+${usersHidden.length}`}</Avatar>
          )}
        </Avatar.Group>
      </Tooltip.Group>
    </>
  );
};
