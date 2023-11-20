"use client";
import { useEffect } from "react";
import axios from "axios";

export default function Live_games() {

    

  useEffect(() => {
    function fetchData() {
      axios.get("http://localhost:3001/games").then((response) => {
        //   const Live_games = await fetch("http://localhost:3001/games");
        console.log(response.data[0][0]);
      });
    }
    fetchData();
  }, []);
  return <></>;
}
