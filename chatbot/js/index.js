const webSocketOutput = document.querySelector(".output");
const inputBtn = document.querySelector(".input-box");

// Get the port from the hidden field
const serverPort = document.getElementById("serverPort").value;

inputBtn.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    const query = event.target.value;
    event.target.value = "";
    sendQuery(query);
  }
});

let ws;
const host = location.hostname;
try {
  // Local dev
  if (["hello.localhost", "localhost", "127.0.0.1", ""].includes(host)) {
    ws = new WebSocket(`ws://localhost:${serverPort}/chatbot`);
    // Prod
  } else if (host.includes("cmoreno.me")) {
    ws = new WebSocket(`ws://${host}:${serverPort}/chatbot`);
    // Error
  } else {
    ws = new WebSocket(`wss://jemisthe.best`);
  }
} catch (e) {
  console.log("Web socket init error", e);
}

function sendQuery(query) {
  ws.send(JSON.stringify({ type: "query", payload: query }));
}

ws.onmessage = function ({ data }) {
  const msg = document.createElement("div");

  try {
    data = JSON.parse(data);
    const { type, payload } = data;

    switch (type) {
      case "ping":
        // console.log('ping');
        return;
      default:
        msg.innerHTML = payload;
        webSocketOutput.prepend(msg);
    }
  } catch (e) {
    console.log("Websocket error", e);
  }
};
