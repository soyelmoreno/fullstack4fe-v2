const express = require("express");
const path = require("path");
const WebSocketServer = require("ws").Server;
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Set up routes and response
const response = [
  "Hello, world!",
  "This is our NodeJS application server.",
  'Oh, and check out the simple <a href="/chatbot">chatbot app</a>, too.',
];

// Home page route
app.get("/", (req, res) => {
  res.send(response.map((str) => `<p>${str}</p>`).join(""));
});

// Serve js files
app.use("/js", express.static(path.join(__dirname, "chatbot/js/")));
// Serve css files
app.use("/css", express.static(path.join(__dirname, "chatbot/css/")));

// Chatbot route
app.get("/chatbot", (req, res) => {
  // Get the file, then replace the placeholder with the port
  fs.readFile("chatbot/html/index.html", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }
    const modifiedHtml = data.replace("REPLACE_WITH_PORT", PORT);
    res.send(modifiedHtml);
  });
});

function handleQuery(query, cb) {
  cb(`You said: ${query}. Response: Awesome`);
}

// Listen
const httpServer = app.listen(PORT, () =>
  console.log(`Example app listening on port ${PORT}`)
);

// Set up WebSocket
const wss = new WebSocketServer({ server: httpServer });

/**
 * Client Counter
 * Count the number of active connections
 * @type {Number}
 */
let cc = 0;
wss.on("connection", function connection(ws) {
  console.log("client connections: ", ++cc);

  ws.on("message", function incoming(message) {
    try {
      const { payload, type } = JSON.parse(message);
      switch (type) {
        case "query":
          handleQuery(payload, (response) => {
            ws.send(
              JSON.stringify({ type: "queryResponse", payload: response })
            );
          });
          return;
        default:
          console.log(message);
      }
    } catch (e) {
      console.error("Error from message: ", e);
    }
  });

  // Send welcome message on each connection
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify({ type: "connected", payload: "Welcome!" }));
  }

  ws.on("close", function close() {
    --cc;
    if (cc === 0) {
      clearInterval(pingInterval);
    }
    console.log("disconnected");
  });

  ws.on("error", function error() {
    --cc;
    console.log("error");
  });
});

const pingPayload = JSON.stringify({ type: "ping" });
// Keep the connection alive
let pingInterval = setInterval(() => {
  wss.broadcast(pingPayload);
}, 1 * 5000);

/**
 * Broadcast data to all connected clients
 * @param  {Object} data
 * @void
 */
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};
