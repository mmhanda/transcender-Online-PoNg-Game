

export default async function Live_games() {
    
    const Live_games = await fetch('http://localhost:3001/games')
    console.log(Live_games);

    return (
        <></>
    );
}