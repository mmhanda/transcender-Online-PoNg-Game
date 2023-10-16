import { useContext, useEffect, useState } from "react";
import { WebsocketContext } from "../Contexts/WebsocketContext";

type MessagePayload = {
  content: string;
  msg: string;
};

export const Websocket = () => {
  const socket = useContext(WebsocketContext);

  const [value, setValue] = useState("");

  const [messages, setMessages] = useState<MessagePayload[]>([]);
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected !");
    });

    socket.on("onMessage", (newMessage: MessagePayload) => {
      console.log("onMessage Event Recived!");
      console.log("newMessage.content: " + newMessage.content);
      setMessages((prev) => [...prev, newMessage]);
    });

    socket.on("specialEvent", (data) => {
      console.log(data);
    });

    return () => {
      /// in this cleanup function we turn off the socket to prevent it from desconection when getting out of the compenent and the need of reconecting again
      console.log("Unregistering Events...");
      socket.off("onMessage");
      socket.off("connect");
      socket.off("specialEvent");
    };
  }, [socket, messages]);

  const submitHandler = () => {
    socket.emit("newMessage", value);
    setValue("");
  };
  return (
    <div>
      <h1> Websocket component </h1>
      <div>
        {messages.length === 0 ? (
          <div>No Messages To Show</div>
        ) : (
          <div>
            {messages.map((msg) => (
              <div>
                <p> {msg.msg} </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        ></input>
        <button onClick={submitHandler}> Submit</button>
      </div>
    </div>
  );
};
