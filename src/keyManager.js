import CryptoJS from "crypto-js";
import { JSEncrypt } from "jsencrypt";

class keyManager {

  privateKey = {}
  publicKey = ""
  AESKey = "AESkey??"




  publishPublicKeyToRoom() {
    //STRINGIFYJSON
    //tell server about my public key
  }



  async encryptAESKeyWithPublicKey(publicKeyOfRecipient) {
      // this.AESKey = await this.GenerateAESKey();
      let encryptedKey = await window.crypto.subtle.encrypt(
        {
          name: "RSA-OAEP",
          //label: Uint8Array([...]) //optional
        },
        publicKeyOfRecipient, //from generateKey or importKey above
        this.AESKey //ArrayBuffer of data you want to encrypt
        )
      //   .then(function () {
      //     //returns an ArrayBuffer containing the encrypted data
      //   // return (new Uint8Array(encryptedKey));
      //   console.log("encryptedKey: " + encryptedKey)
      //   return encryptedKey;
        
      // })
      .catch(function (err) {
        console.error(err);
      });
      // return encryptedKey;
      return this.ab2str(encryptedKey);
  }


  ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  }

  async exportCryptoKey(key) {
    const exported = await window.crypto.subtle.exportKey("spki", key);
    const exportedAsString = this.ab2str(exported);
    const exportedAsBase64 = window.btoa(exportedAsString);
    const pemExported = `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
    return pemExported;
    
    // this.publicKey = pemExported;
    // console.log("exportCryptoKey: " + this.publicKey)



  }







  async generatePublicKey() {
    
    await window.crypto.subtle
      .generateKey(
        {
          name: "RSA-OAEP",
          // Consider using a 4096-bit key for systems that require long-term security
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
      )
      .then(async (keyPair) => {
        // const exportButton = document.querySelector(".spki");
        // exportButton.addEventListener("click", () => {
        // await this.exportCryptoKey(keyPair.publicKey);
        this.publicKey = await this.exportCryptoKey(keyPair.publicKey)
        // this.publicKey = await this.exportCryptoKey(keyPair.privateKey)
        // });
      })
      ;
      
    return this.publicKey
  }

  /*
  IMPORTING KEY?
  */
  str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  async importRsaKey(pem) {

    // fetch the part of the PEM string between header and footer
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    const pemContents = pem.substring(
      pemHeader.length,
      pem.length - pemFooter.length
    );
    // base64 decode the string to get the binary data
    const binaryDerString = window.atob(pemContents);
    // convert from a binary string to an ArrayBuffer
    const binaryDer = this.str2ab(binaryDerString);
    // return window.crypto.subtle.importKey(
    let something =  await window.crypto.subtle.importKey(
      "spki",
      binaryDer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["encrypt"]
      );

      const exportedAsString = this.ab2str(something);
      const exportedAsBase64 = window.btoa(exportedAsString);
      const pemExported = `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
      // this.publicKey = pemExported;

      return something;
  }





    
    
    
    async GenerateAESKey() {

    let AESKeyObject = await window.crypto.subtle.generateKey(
      {
          name: "AES-GCM",
          length: 256, //can be  128, 192, or 256
        },
        true, //whether the key is extractable (i.e. can be used in exportKey)
        ["encrypt", "decrypt"] //can "encrypt", "decrypt", "wrapKey", or "unwrapKey"
        )
        this.AESKey = await crypto.subtle.exportKey("raw", AESKeyObject);
        // this.AESKey = AESKeyExportedToJson
        return this.AESKey
        
      }
      




  async generateRSAKeyPair() {

    let keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048, //can be 1024, 2048, or 4096
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: { name: "SHA-256" }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
      },
      true, //whether the key is extractable (i.e. can be used in exportKey)
      ["encrypt", "decrypt"] //can be any combination of "sign" and "verify"
    )
    let publicKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);
    //let publicKeyString =  JSON.stringify(publicKey, null, " ");
    let privateKey = await crypto.subtle.exportKey("spki", keyPair.privateKey);
    this.privateKey = privateKey;
    this.publicKey = publicKey;
    // return [publicKey, privateKey]
  }


}


export default keyManager;
