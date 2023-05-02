import CryptoJS from "crypto-js";
import { JSEncrypt } from "jsencrypt";

class keyManager {
  

      publishPublicKeyToRoom()
      {
        //tell server about my public key
      }




  encryptAESKeyWithPublicKey(){
      window.crypto.subtle.encrypt(
        {
            name: "RSA-OAEP",
            //label: Uint8Array([...]) //optional
        },
        publicKey, //from generateKey or importKey above
        data //ArrayBuffer of data you want to encrypt
    )
    .then(function(encrypted){
        //returns an ArrayBuffer containing the encrypted data
        console.log(new Uint8Array(encrypted));
    })
    .catch(function(err){
        console.error(err);
    });
  }



       makeRandomString(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        this.secretPassphrase=result
      }


        GenerateAESKey() {
        window.crypto.subtle.generateKey(
          {
              name: "AES-CTR",
              length: 256, //can be  128, 192, or 256
          },
          false, //whether the key is extractable (i.e. can be used in exportKey)
          ["encrypt", "decrypt"] //can "encrypt", "decrypt", "wrapKey", or "unwrapKey"
      )
      .then(function(key){
          //returns a key object
          console.log(key)
          this.AESKey=key

      })
      .catch(function(err){
          console.error(err);
      });

      }

      generateRSAKeyPair(){
        window.crypto.subtle.generateKey(
          {
              name: "RSASSA-PKCS1-v1_5",
              modulusLength: 2048, //can be 1024, 2048, or 4096
              publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
              hash: {name: "SHA-256"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
          },
          false, //whether the key is extractable (i.e. can be used in exportKey)
          ["sign", "verify"] //can be any combination of "sign" and "verify"
      )
      .then(function(key){
          //returns a keypair object
          console.log(key);
          console.log(key.publicKey);
          console.log(key.privateKey);
      })
      .catch(function(err){
          console.error(err);
      });
      }

    }
    

      export default keyManager;
