// chat.js
import { generateKeys, encrypt, decrypt } from './encryption.js';
import { connectToServer } from './websocket.js';
 function initChat() {
    // Initialize chat UI and event listeners
    const chatContainer = document.getElementById("chat-messages");
    // Connect to WebSocket server
    const socket = connectToServer();

    // Example usage of encryption
    const { publicKey, privateKey } = generateKeys();

    // Send message when "Send" button is clicked
    document.querySelector(".send-button").addEventListener("click", () => {

        //handle message
        var messageInput = document.getElementById("message-input");
        var message = messageInput.value;

        const encryptedMessage = encrypt(message, publicKey);

        // Send encrypted message to server
        socket.send(JSON.stringify({type: 'encrypted', content: encryptedMessage}));

        // Clear message input
        messageInput.value = "";
    });

        // Handle incoming messages
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'encrypted') {
                // Decrypt encrypted message
                const decryptedMessage = decrypt(data.content, privateKey);

                // Display decrypted message in UI
                displayMessage(decryptedMessage);
            } else {
                // Display non-encrypted message directly
                displayMessage(data.content);
            }
        };
    }
function displayMessage(message) {
    // Display message in chat UI
    const chatContainer = document.getElementById("chat-messages");
    const messageElement = document.createElement('div');
    var messageInput = document.getElementById("message-input");
    messageElement.textContent = message;
    chatContainer.appendChild(messageElement);
    messageInput.value = "";
    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
