// import CryptoJS from "crypto-js";

// // Encryption function
// export const encrypt = (text) => {
//   const encryptedText = CryptoJS.AES.encrypt(text, process.env.NEXT_PUBLIC_FEED_SECRET_KEY).toString();
//   return encryptedText;
// };

// // Decryption function
// export const decrypt = (encryptedText) => {
//   try {
//     const decryptedBytes = CryptoJS.AES.decrypt(encryptedText, process.env.NEXT_PUBLIC_FEED_SECRET_KEY);
//     const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
//     return decryptedText;
//   } catch (error) {
//     return encryptedText;
//   }
// };
