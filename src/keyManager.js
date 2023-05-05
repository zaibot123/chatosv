import CryptoJS from "crypto-js";
import { JSEncrypt } from "jsencrypt";

class keyManager {

privateKey={}
publicKey={}
AESKey={}


      publishPublicKeyToRoom()
      {
        //STRINGIFYJSON
        //tell server about my public key
      }


  encryptAESKeyWithPublicKey(publicKeyOfRecipient){
      let encryptedKey=window.crypto.subtle.encrypt(
        {
            name: "RSA-OAEP",
            //label: Uint8Array([...]) //optional
        },
        publicKeyOfRecipient, //from generateKey or importKey above
        this.AESKey //ArrayBuffer of data you want to encrypt
    )
    .then(function(){
        //returns an ArrayBuffer containing the encrypted data
        return(new Uint8Array(encryptedKey));
        
    })
    .catch(function(err){
        console.error(err);
    });
  }



        async GenerateAESKey() {
        let AESKeyObject=await window.crypto.subtle.generateKey(
          {
              name: "AES-GCM",
              length: 256, //can be  128, 192, or 256
          },
          true, //whether the key is extractable (i.e. can be used in exportKey)
          ["encrypt", "decrypt"] //can "encrypt", "decrypt", "wrapKey", or "unwrapKey"
      )
        let AESKeyExportedToJson=await crypto.subtle.exportKey("spki", AESKeyObject);
        this.AESKey=AESKeyExportedToJson
        return AESKeyExportedToJson

      }

      async generateRSAKeyPair(){
       let keyPair = await  window.crypto.subtle.generateKey(
          {
              name: "RSA-OAEP",
              modulusLength: 2048, //can be 1024, 2048, or 4096
              publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
              hash: {name: "SHA-256"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
          },
          true, //whether the key is extractable (i.e. can be used in exportKey)
          ["encrypt", "decrypt"] //can be any combination of "sign" and "verify"
      )
      let publicKey=  await crypto.subtle.exportKey("spki", keyPair.publicKey);
      //let publicKeyString =  JSON.stringify(publicKey, null, " ");
       let privateKey=  await crypto.subtle.exportKey("spki", keyPair.privateKey);
       this.privateKey=privateKey;
       this.publicKey=publicKey;
       return   [publicKey,privateKey]
      }


    }
    

      export default keyManager;
