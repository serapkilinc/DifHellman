import crypto from 'crypto';

export function generateKeys() {
    // Generate public/private key pair
    const publicKey = 'publicKey';
    const privateKey = 'privateKey';
    return { publicKey, privateKey };
}

// Generate Diffie-Hellman key pair
const dh = crypto.createDiffieHellman(2048); // 2048 is the key size
const publicKey = dh.generateKeys('hex');

export function encrypt(message, otherPublicKey) {
    // Convert other public key from hex to Buffer
    const otherPublicKeyBuffer = Buffer.from(otherPublicKey, 'hex');

    // Generate shared secret
    const sharedSecret = dh.computeSecret(otherPublicKeyBuffer);

    // Use shared secret to derive encryption key
    const encryptionKey = crypto.createHash('sha256').update(sharedSecret).digest();

    // Encrypt message using derived key
    const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
    let encryptedMessage = cipher.update(message, 'utf8', 'hex');
    encryptedMessage += cipher.final('hex');

    return encryptedMessage;
}

export function decrypt(encryptedMessage, privateKey) {
    // Convert private key from hex to Buffer
    const privateKeyBuffer = Buffer.from(privateKey, 'hex');

    // Generate shared secret
    const sharedSecret = dh.computeSecret(privateKeyBuffer);

    // Use shared secret to derive decryption key
    const decryptionKey = crypto.createHash('sha256').update(sharedSecret).digest();

    // Decrypt message using derived key
    const decipher = crypto.createDecipher('aes-256-cbc', decryptionKey);
    let decryptedMessage = decipher.update(encryptedMessage, 'hex', 'utf8');
    decryptedMessage += decipher.final('utf8');

    return decryptedMessage;
}
