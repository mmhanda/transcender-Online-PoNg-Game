"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function LiveGames() {
  const [liveGames, setLiveGames] = useState([]);
  const [Data, setData] = useState({});
  let data: any;
  let roomid: any;

  async function fetchData() {
    axios.get("http://localhost:3001/games").then((response: any) => {
    data = await fetch('http://localhost:3001/games');
    console.log("here");
    // setData([response.data]);
    // roomid = data[2];
    // console.log(roomid);
    // const filteredData = data;
    setLiveGames(
      data
        .slice(1)
        .filter(
          (gameData: any) =>
            typeof gameData.scoreLeft !== "undefined" &&
            typeof gameData.scoreRight !== "undefined" &&
            typeof gameData.roomId !== "undefined"
        )
    );
    });
  }
  // console.log(data[2]);

  useEffect(() => {
    fetchData();
    // console.log(liveGames[0]?.scoreLeft);
  }, []);

  return (
    // <main className="container mx-auto py-36 px-8">
    <main className="container mx-auto  px-8 grid lg:grid-cols-3 text-center cursor-pointer mx-4">
      {liveGames.map((gameData, index) => (
        <Link key={index} href={`/watch-game?id=${0}`}>
          {/* {data[0]} */}
          <div
            key={index}
            className="border p-4 m-4 transform transition-transform hover:scale-105"
          >
            <img src="choose-game-assets/watch-game.jpg" alt="Player 2" />
            <p>Player 1 Score: {garror: data.slice is not a functionmeData?.scoreLeft}</p>
            <p>Player 2 Score: {gameData?.scoreRight}</p>
          </div>
        </Link>
      ))}
    </main>
    // </main>
  );
}
