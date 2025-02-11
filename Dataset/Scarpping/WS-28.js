const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const WebSocket = require('ws');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// In-memory chat history array
let chatHistory = [];

// Serve a simple live chat page (for victims)
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Live Chat</title></head>
      <body>
        <h1>Live Chat</h1>
        <div id="chat"></div>
        <form id="chatForm">
          <input type="text" id="message" autocomplete="off"/>
          <button type="submit">Send</button>
        </form>
        <script>
          // Connect to WebSocket server (vulnerable: no origin check)
          const ws = new WebSocket('ws://' + location.host + '/ws');
          ws.onmessage = function(event) {
            const chatDiv = document.getElementById('chat');
            chatDiv.innerHTML += event.data + '<br>';
          };
          document.getElementById('chatForm').onsubmit = function(e) {
            e.preventDefault();
            const msg = document.getElementById('message').value;
            ws.send(msg);
            document.getElementById('message').value = '';
          };
        </script>
      </body>
    </html>
  `);
});

// Create HTTP server
const server = http.createServer(app);

// Setup WebSocket server on top of the HTTP server
const wss = new WebSocket.Server({
  server,
  verifyClient: (info, done) => {
    // Vulnerability: No origin check—allows cross-site WebSocket hijacking.
    done(true);
  }
});

// When a client connects, send the chat history
wss.on('connection', (ws) => {
  ws.send("Chat History: " + JSON.stringify(chatHistory));
  ws.on('message', (message) => {
    chatHistory.push(message);
    // Broadcast to all clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Lab running on http://localhost:${port}`);
});
