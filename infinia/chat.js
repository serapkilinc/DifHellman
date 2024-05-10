import { generateKeys, encrypt, decrypt } from './encryption.js';
import { connectToServer } from './websocket.js';

function initChat() {
    const chatContainer = document.getElementById("chat-messages");
    const socket = connectToServer();
    const { publicKey, privateKey } = generateKeys();

    document.querySelector(".send-button").addEventListener("click", () => {
        const messageInput = document.getElementById("message-input");
        const message = messageInput.value;
        //handle image file

        const encryptedMessage = encrypt(message, publicKey);

        socket.send(JSON.stringify({type: 'encrypted', content: encryptedMessage}));
        messageInput.value = "";
    });

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'encrypted') {
            const decryptedMessage = decrypt(data.content, privateKey);
            displayMessage(decryptedMessage);
        } else {
            displayMessage(data.content);
        }
    };
}
function initImage() {
    const chatContainer = document.getElementById("chat-messages");
    const socket = connectToServer();
    const { publicKey, privateKey } = generateKeys();

    // Send client's public key to the server
    socket.send(JSON.stringify({ type: 'publicKey', content: publicKey }));

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);


            // When the "Send Image" button is clicked
            document.querySelector(".image-button").addEventListener("click", () => {
                const imageInput = document.getElementById("image-input");
                const imageFile = imageInput.files[0];

                if (imageFile) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const imageBlob = reader.result;

                        // Encrypt the image binary data using the Diffie-Hellman shared secret
                        const encryptedImage = encrypt(imageBlob, publicKey);

                        // Send the encrypted image to the server
                        socket.send(JSON.stringify({ type: 'encryptedImage', content: encryptedImage }));
                    };
                    reader.readAsArrayBuffer(imageFile);
                } else {
                    console.error('No image file selected.');
                }
            });

    };
}

function displayMessage(message) {
    const chatContainer = document.getElementById("chat-messages");
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

export { initChat };
