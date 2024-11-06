import { Link } from "@/components/Link/Link";
import dashfunIcon from "@/icons/dashfun-icon.svg";
import { TGLink } from "@/utils/DashFunApi";
import { useUtils } from "@telegram-apps/sdk-react";
import {
  Avatar,
  Cell,
  Headline,
  List,
  Section,
} from "@telegram-apps/telegram-ui";
import { SectionFooter } from "@telegram-apps/telegram-ui/dist/components/Blocks/Section/components/SectionFooter/SectionFooter";
import { FC } from "react";

export const IntroPage: FC = () => {
  const utils = useUtils();
  return (
    <List>
      <div className="w-full flex flex-col justify-center items-center pt-5">
        <Avatar src={dashfunIcon} size={96}></Avatar>
        <Headline weight="1" className="pt-1">
          DashFun
        </Headline>
      </div>
      <SectionFooter>
        DashFun is an upcoming mini-game platform featuring a collection of
        exciting and fast-paced games designed for quick, fun sessions. Stay
        tuned for the launch and get ready to dive into endless entertainment!
      </SectionFooter>

      <Section header="Follow US">
        <Link to="" onClick={() => utils.openTelegramLink(TGLink.groupLink())}>
          <Cell>Join Our Telegram Group</Cell>
        </Link>
        <Link to={"https://x.com/dashfun_app"}>
          <Cell>Follow Us On X</Cell>
        </Link>
        <Link to={"/game-center"}>
          <Cell>Game Center</Cell>
        </Link>
      </Section>

      <Section header="New Games">
        <Link
          to=""
          onClick={() => utils.openTelegramLink(TGLink.gameLink("9c4r4sdzb40"))}
        >
          <Cell
            before={
              <Avatar
                size={48}
                src="https://res.dashfun.games/icons/3kweb3-512.jpg"
              ></Avatar>
            }
            description="Easy and fast Three Kingdomes Idle RPG"
          >
            War Three Kingdoms
          </Cell>
        </Link>
      </Section>
    </List>
  );
};
