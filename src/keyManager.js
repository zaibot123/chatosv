//var crypto = require('crypto');

class keyManager {
    constructor() {
        const {publicKey,privateKey}= crypto.generateKeyPairSync("rsa", { modulusLength:2048})
        AESKey;
        CryptoJS.publicKey(publicKey)
        CryptoJS.privateKey(privateKey)

      }  
      publishPublicKeyToRoom()
      {
      }

      //encrypting symmetric key for dsitribution. Host does this

      generateAESKey(){
        //Only Hosts should be told to do this.
         AESKey=  CryptoJS.generateAESKey
      }
      encryptAESKey(AESkey,publicKeyRecipient){
        return CryptoJS.publicEncrypt({
            key: publicKeyRecipient,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256'
          },
           Buffer.from(AESkey)
          )
        }


        //encrypts data with agreed upon symmetric key
        encryptWithAES(plainText,AESkey){
           return CryptoJS.AES.encrypt(plainText,AESkey)}

    
      decryptWithAES(encryptedText){
        return CryptoJS.AES.decrypt(encryptedText, AESKey)}
      }




      export default keyManager;
