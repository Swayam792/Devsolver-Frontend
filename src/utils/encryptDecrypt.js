import CryptoJS from "crypto-js";
import CRYPTO_KEY from "../encrptkey";
 
export const encryptWithAES = (text) => { 
    const passphrase = CRYPTO_KEY;
    return CryptoJS.AES.encrypt(text, passphrase).toString(); 
};

export const decryptWithAES = (ciphertext) => {
    const passphrase = CRYPTO_KEY;
    const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};