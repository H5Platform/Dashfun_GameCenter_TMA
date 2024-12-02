import { List, Spinner } from "@telegram-apps/telegram-ui";
import GameListItem from "./GameListItem";
import { useEffect, useRef, useState } from "react";
import { GameData } from "@/components/DashFunData/GameData";
import { GameApi } from "@/utils/DashFunApi";
import { useLaunchParams } from "@telegram-apps/sdk-react";

export default function GameList() {
  const [loading, setLoading] = useState(false);

  const [gameData, setGameData] = useState<GameData[]>([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [hasReachedEnd, setHasReachedEnd] = useState(false);

  const initDataRaw = useLaunchParams().initDataRaw;

  const listRef = useRef(null)

  const fetchGameData = (page: number) => {
    setLoading(true);
    GameApi.gameSearch(initDataRaw as string, "", page).then((res) => {
      const { data, page, total_pages } = res;
      console.log("res: ", res);
      setCurrentPage(page);
      setTotalPages(total_pages);
      setGameData(data);
    }).catch((err) => {
      console.error("Error fetching game data", err);

    }).finally(() => {
      setLoading(false);
    });
  };


  useEffect(() => {
    fetchGameData(currentPage);
  }, []);

  console.log("gameData", gameData);

  // Function to check if we've scrolled to the bottom
  const handleScroll = () => {
    if (!listRef.current) return;

    const bottom = (listRef.current as HTMLElement).scrollHeight === (listRef.current as HTMLElement).scrollTop + (listRef.current as HTMLElement).clientHeight;
    if (bottom && !loading) {
      // If scrolled to bottom and not already loading, fetch more data
      console.log("Scrolled to bottom");
      if (currentPage < totalPages) {
        setLoading(true);
        fetchGameData(currentPage + 1);
      } else {
        setHasReachedEnd(true);
      }
    }
  };

  return (
    <div
      ref={listRef}
      onScroll={handleScroll}
      style={{
        height: "calc(100vh - 350px)", // Adjust the height as needed
        overflowY: "auto",
      }}
    >
      <List
        style={{
          padding: 0,
        }}
      >
        {
          gameData.map((game) => (
            <GameListItem key={game.id} data={game} />
          ))
        }
      </List>
      {
        loading && (
          <div className="flex justify-center">
            <Spinner size="s" />
          </div>
        )
      }
      {
        hasReachedEnd && (
          <div className="flex justify-center">
            <span className="text-gray-500 text-sm">No more games</span>
          </div>
        )
      }
    </div>
  );
}
