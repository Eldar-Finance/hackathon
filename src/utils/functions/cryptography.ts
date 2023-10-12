import CryptoJS from "crypto-js";

// Encryption Key creation
export const createEncryptionKey = (pin: string, userGid: string) => {
    const hashingKey = CryptoJS.SHA256(pin.substring(0, 2) + userGid + pin.substring(2, 4)).toString();
    return hashingKey;
};

// Encryption function
export const encrypt = (text: string, key: string) => {
    const encryptedText = CryptoJS.AES.encrypt(text, key).toString();
    return encryptedText;
};

// Decryption function
export const decrypt = (encryptedText: string, key: string) => {
  try {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedText, key);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decryptedText;
  } catch (error) {
    return encryptedText;
  }
};
