import { FC, useState } from "react";
import GameGenreCard from "./GameGenreCard";
import { Avatar, Input, Tappable, Title } from "@telegram-apps/telegram-ui";
import { useNavigate } from "react-router-dom";
import SearchPage from "./SearchPage";
import PromotionCard from "./PromotionCard";
import GameChipList from "./GameChipList";

const GameCenter: FC = () => {
  const navigate = useNavigate();

  const [showSearchPage, setShowSearchPage] = useState(false);

  const [searchValue, setSearchValue] = useState("");

  const [searchResults, setSearchResults] = useState([]);

  const openProfile = () => {
    navigate("/profile");
  };

  const onSearchGames = (value: string) => {
    setSearchValue(value);
  };

  const onSearchStart = () => {
    console.log("searching started");
    if (showSearchPage) return;
    setShowSearchPage(true);
  };

  const onCancelSearch = () => {
    if (!showSearchPage) return;
    setSearchValue("");
    setSearchResults([]);
    setShowSearchPage(false);
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex justify-between items-center">
        <Title weight="2">Game Center</Title>
        <Avatar
          size={40}
          src="https://avatars.githubusercontent.com/u/84640980?v=4"
          onClick={openProfile}
        />
      </div>

      <Input
        status="focused"
        placeholder="Search for games"
        value={searchValue}
        onChange={(e) => onSearchGames(e.target.value)}
        onClick={onSearchStart}
        after={
          <Tappable
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onCancelSearch();
            }}
            style={{ display: "flex", cursor: "pointer" }}
          >
            &#10006;
          </Tappable>
        }
      />

      {showSearchPage ? (
        <SearchPage searchResults={searchResults} />
      ) : (
        <>
          <GameChipList />
          <PromotionCard />
          <GameGenreCard genre={"FPS"} />
          <GameGenreCard genre={"RPG"} />
        </>
      )}
    </div>
  );
};
export default GameCenter;
