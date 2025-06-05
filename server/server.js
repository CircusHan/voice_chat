const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve the static files from the repository's public directory regardless of
// the current working directory. When the server is started from the `server`
// folder as recommended in the README, using a relative path of `public` would
// incorrectly look for `server/public`. Resolving the path relative to this
// file ensures the correct directory is served.
app.use(express.static(path.join(__dirname, '..', 'public')));

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    // Broadcast any received signaling data to all other clients
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
