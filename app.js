const express = require("express");
const app = express();
const port = 3000;

const response = [
  "Hello, world!",
  "This is our NodeJS application server.",
  'Oh, and check out the simple <a href="/chatbot">chatbot app</a>, too.',
];

app.get("/", (req, res) => {
  res.send(response.join("<br><br>"));
});

app.listen(port, () => console.log(`Example app listening on port ${port}`));
