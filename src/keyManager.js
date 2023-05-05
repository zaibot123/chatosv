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
      window.crypto.subtle.encrypt(
        {
            name: "RSA-OAEP",
            //label: Uint8Array([...]) //optional
        },
        publicKey, //from generateKey or importKey above
        data //ArrayBuffer of data you want to encrypt
    )
    .then(function(encryptedKey){
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
              name: "AES-CTR",
              length: 256, //can be  128, 192, or 256
          },
          true, //whether the key is extractable (i.e. can be used in exportKey)
          ["encrypt", "decrypt"] //can "encrypt", "decrypt", "wrapKey", or "unwrapKey"
      )
        let AESKeyExportedToJson=await crypto.subtle.exportKey("jwk", AESKeyObject);
        this.AESKey=AESKeyExportedToJson
        return AESKeyExportedToJson

      }

      async generateRSAKeyPair(){
       let keyPair = await  window.crypto.subtle.generateKey(
          {
              name: "RSASSA-PKCS1-v1_5",
              modulusLength: 2048, //can be 1024, 2048, or 4096
              publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
              hash: {name: "SHA-256"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
          },
          true, //whether the key is extractable (i.e. can be used in exportKey)
          ["sign", "verify"] //can be any combination of "sign" and "verify"
      )
      let publicKey=  await crypto.subtle.exportKey("jwk", keyPair.publicKey);
      //let publicKeyString =  JSON.stringify(publicKey, null, " ");
       let privateKey=  await crypto.subtle.exportKey("jwk", keyPair.privateKey);
       this.privateKey=privateKey;
       this.publicKey=publicKey;
       return   [publicKey,privateKey]
      }


    }
    

      export default keyManager;
