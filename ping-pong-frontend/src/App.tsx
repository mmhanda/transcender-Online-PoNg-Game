import { WebsocketProvider, socket } from "./Contexts/WebsocketContext";
import { Websocket } from "./components/Websocket";

function App() {
  return (
    <WebsocketProvider value={socket}>
      <Websocket />
    </WebsocketProvider>
  );
}

export default App;
