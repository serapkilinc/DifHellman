// encryption.js

export function generateKeys() {
    // Generate public/private key pair
    const publicKey = 'publicKey';
    const privateKey = 'privateKey';
    return { publicKey, privateKey };
}


const crypto = require('crypto');
// Generate Diffie-Hellman key pair
const dh = crypto.createDiffieHellman(2048); // 2048 is the key size
const publicKey = dh.generateKeys('hex');

//
export function encrypt(message, publicKey) {
    // Encrypt message using public key
    const otherPublicKey = Buffer.from(publicKey, 'hex');

    // Generate shared secret
    const sharedSecret = dh.computeSecret(otherPublicKey, 'hex');

    // Use shared secret to derive encryption key
    const encryptionKey = crypto.createHash('sha256').update(sharedSecret).digest();

    // Encrypt message using derived key
    const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
    let encryptedMessage = cipher.update(message, 'utf8', 'hex');
    encryptedMessage += cipher.final('hex');

    return encryptedMessage;
}
export default crypto;
export function decrypt(encryptedMessage, privateKey) {
    // Convert private key from hex to Buffer
    const otherPrivateKey = Buffer.from(privateKey, 'hex');

    // Generate shared secret
    const sharedSecret = dh.computeSecret(otherPrivateKey, 'hex');

    // Use shared secret to derive decryption key
    const decryptionKey = crypto.createHash('sha256').update(sharedSecret).digest();

    // Decrypt message using derived key
    const decipher = crypto.createDecipher('aes-256-cbc', decryptionKey);
    let decryptedMessage = decipher.update(encryptedMessage, 'hex', 'utf8');
    decryptedMessage += decipher.final('utf8');

    return decryptedMessage;
}
