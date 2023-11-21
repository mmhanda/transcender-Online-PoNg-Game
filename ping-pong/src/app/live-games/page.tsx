"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function LiveGames() {
  const [liveGames, setLiveGames] = useState([]);
  const [Data, setData] = useState({});

  function fetchData() {
    axios.get("http://localhost:3001/games").then((response: any) => {
      setData(response.data);
      setLiveGames(response.data.slice(1).filter((gameData: any) =>
        typeof gameData.scoreLeft !== "undefined" &&
        typeof gameData.scoreRight !== "undefined" &&
        typeof gameData.roomId !== "undefined")
      );
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="container mx-auto  px-8 grid lg:grid-cols-3 text-center cursor-pointer mx-4">
      {liveGames.map((gameData, index) => (
        <Link key={index} href={`/watch-game?id=${Data[gameData?.roomId]}`}>
          <div
            key={index}
            className="border p-4 m-4 transform transition-transform hover:scale-105"
          >
            <img src="choose-game-assets/watch-game.jpg" alt="Player 2" />
            <p>Player 1 Score: {gameData?.scoreLeft}</p>
            <p>Player 2 Score: {gameData?.scoreRight}</p>
          </div>
        </Link>
      ))}
    </main>
  );
}
