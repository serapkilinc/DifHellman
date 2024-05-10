// server.js
import express from 'express';
import http from 'http';
import { Server } from 'ws';

const app = express();
const server = http.createServer(app);
const wss = new Server({ server });

wss.on('connection', (ws) => {
    // Handle WebSocket connection
    ws.on('message', (message) => {
        // Handle incoming message
        const decryptedMessage = decryptMessage(message);
        // Store message or broadcast to other clients
        broadcastMessage(decryptedMessage);
    });
});

function decryptMessage(encryptedMessage) {
    // Decrypt message using Diffie-Hellman key exchange
    var decryptedMessage="";
    return decryptedMessage;
}

function broadcastMessage(message) {
    // Broadcast message to all connected clients
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
