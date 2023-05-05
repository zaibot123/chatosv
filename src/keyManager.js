import CryptoJS from "crypto-js";
import { JSEncrypt } from "jsencrypt";

class keyManager {

  privateKey = {}
  publicKey = ""
  AESKey = {}
  constructor(){
    this.privateKey = {}
    this.publicKey = ""
    this.AESKey = {}
  
  }


  publishPublicKeyToRoom() {
    //STRINGIFYJSON
    //tell server about my public key
  }


  encryptAESKeyWithPublicKey(publicKeyOfRecipient) {


    let encryptedKey = window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
        //label: Uint8Array([...]) //optional
      },
      publicKeyOfRecipient, //from generateKey or importKey above
      this.AESKey //ArrayBuffer of data you want to encrypt
    )
      .then(function () {
        //returns an ArrayBuffer containing the encrypted data
        return (new Uint8Array(encryptedKey));

      })
      .catch(function (err) {
        console.error(err);
      });
  }


   ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  }

  async exportCryptoKey(key) {

    const exported = await window.crypto.subtle.exportKey("spki", key);
    const exportedAsString = this.ab2str(exported);
    const exportedAsBase64 = window.btoa(exportedAsString);
    const pemExported = `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
    this.publicKey = pemExported;
    console.log("Keeey: " + this.publicKey)
    // const exportKeyOutput = document.querySelector(".exported-key");
    // exportKeyOutput.textContent = pemExported;
    
   
  
}












async GenerateAESKey() {
    window.crypto.subtle
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
  .then((keyPair) => {
    // const exportButton = document.querySelector(".spki");
    // exportButton.addEventListener("click", () => {
      this.exportCryptoKey(keyPair.publicKey);
      console.log("this.publicKey: " + this.publicKey)
    // });
  });
}




/* 


async GenerateAESKey() {
  let AESKeyObject = await window.crypto.subtle.generateKey(
    {
        name: "AES-GCM",
        length: 256, //can be  128, 192, or 256
      },
      true, //whether the key is extractable (i.e. can be used in exportKey)
      ["encrypt", "decrypt"] //can "encrypt", "decrypt", "wrapKey", or "unwrapKey"
      )
    let AESKeyExportedToJson = await crypto.subtle.exportKey("spki", AESKeyObject);
    this.AESKey = AESKeyExportedToJson
    return AESKeyExportedToJson

  }
  
  */
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
    // this.publicKey = publicKey;
    // return [publicKey, privateKey]
  }


}


export default keyManager;
