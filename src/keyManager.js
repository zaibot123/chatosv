import CryptoJS from "crypto-js";
import { JSEncrypt } from "jsencrypt";

class keyManager {
  privateKey = {}
  publicKey = ""
  publicKeyAsString = ""
  AESKey = "AESkey??"
  AESKeyExported = ""

  constructor(keys){
    this.privateKey = keys.privateKey;
    this.AESKey = keys.AESKey;
    this.publicKey = keys.publicKey;
    this.publicKeyAsString = keys.publicKeyAsString;
    this.AESKeyExported = keys.AESKeyExported
    this.iv = ""

  }




/**
 * Encrypts the AES key with RSA using the joining participant's public key
 * @param {CryptoKey} publicKeyOfRecipient The public key received from a joining participant such that the AES key can be encrypted. 
 * @returns {string} The AES key encrypted by the joining participant's public key
 */
  async encryptAESKeyWithPublicKey(publicKeyOfRecipient) {
      // this.AESKey = await this.GenerateAESKey();
      let encryptedKey = await window.crypto.subtle.encrypt(
        {
          name: "RSA-OAEP",
        },
        publicKeyOfRecipient, //from generateKey or importKey above
        this.AESKeyExported //ArrayBuffer of data you want to encrypt
        )
      .catch(function (err) {
        console.error(err);
      });
      return this.ab2str(encryptedKey);
  }

  /**
 * Encrypts the input text with the AES key using CBC
 * @param {string} plainText The content that needs to be encrypted, provided as plaintext
 * @returns {string} The encrypted input usingthe AES Key
 */
  async encryptDataWithAESKey(plainText) {
    // this.AESKey = await this.GenerateAESKey();
   let encryptedDataPlainIV={iv: "", body:""}
    let  iv = window.crypto.getRandomValues(new Uint8Array(16));
    let encrypteText = await window.crypto.subtle.encrypt(
      {
        name: "AES-CBC",
        iv: iv,
      },
      this.AESKeyExported, 
      plainText 
      )
    .catch(function (err) {
      console.error(err);
    });
    encryptedDataPlainIV.iv=iv
    encryptedDataPlainIV.body=encrypteText
    return encryptedDataPlainIV
}

/**
 * Converts an ArrayBuffer into a string
 * @param {string} buf ArrayBuffer to convert
 * @returns {string} Converted string
 */
  ab2str(buf) {
    let str= String.fromCharCode.apply(null, new Uint8Array(buf));
    return str
  }



  /**
   * Exports a CryptoKey of the SPKI form
   * @param {CryptoKey} key The CryptoKey to be convert to string  
   * @returns 
   */
  async exportCryptoKey(key) {
    const exported = await window.crypto.subtle.exportKey("spki", key);
    const exportedAsString = this.ab2str(exported);
    const exportedAsBase64 = window.btoa(exportedAsString);
    const pemExported = `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
    return pemExported;
  }






/**
 * Generates a public key and adds it to the KeyManagers object's public key
 * @returns public key as CryptoKey (as Promise) 
 */
  async generatePublicKey() {
    
    await window.crypto.subtle
      .generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
      )
      .then(async (keyPair) => {
        this.publicKey = keyPair.publicKey;
        this.privateKey = keyPair.privateKey;
        this.publicKeyAsString = await this.exportCryptoKey(keyPair.publicKey)
      })
      ;
      
      //delete
    return this.publicKey
  }

  /*
  IMPORTING KEY?
  */

/**
 Converts a string into an arraybuffer 
 * @param {*} str String to convert
 * @returns Converted ArrayBuffer
 */
  str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  en2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

 


  // Using SRKI key format to 
  /**
   * Takes a string in SRKI format and creates a CryptoKey which can be used for encryption
   * @param {*} pem SRKI formatted string 
   * @returns CryptoKey for encryption
   */
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
    return await window.crypto.subtle.importKey(
      "spki",
      binaryDer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["encrypt"]
      );
  }

async importAesKey(decryptedAESKey){
    
    return await window.crypto.subtle.importKey(
      "raw",
      decryptedAESKey,
      {
        name: "AES-CBC",
        hash: "SHA-256",
      },
      true,
      ["decrypt", "encrypt"]
      );
}

async decrpytAESKey(encryptedAESKeyString){
  
  let encryptedAESKeyAB = this.str2ab(encryptedAESKeyString);
  let decryptedAESKey = await window.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    this.privateKey,
    encryptedAESKeyAB
    )
    this.AESKey = await this.importAesKey(decryptedAESKey);
}



    
    
    /**
     * Generates an AES Cryptokey and assigns it to the KeyManager object
     * @returns AES CryptoKey for encrypting and decrypting (as Promise)
     */
    async GenerateAESKey() {
    this.AESKey = await window.crypto.subtle.generateKey(
      {
          name: "AES-CBC",
          length: 256, 
          // length: 128, 
        },
        true, 
        ["encrypt", "decrypt"]  
        )
        
        this.AESKeyExported = await crypto.subtle.exportKey("raw", this.AESKey);
        return this.AESKeyExported
        
      }


/**
 * Encrypts a text using the the AES key and CBC.
 * @param {string} key The key to encrypt the message 
 * @param {string} plainText The text to encrypt 
 * @returns Encrypted text as string
 */
      async encryptDataWithAESKey(plainText) {
  
        let plainTextAB = this.str2ab(JSON.stringify(plainText))
      
        let  iv = window.crypto.getRandomValues(new Uint8Array(16));
        let encrypteText = await window.crypto.subtle.encrypt(
          {
            name: "AES-CBC",
            iv: iv,
          },
          this.AESKey, 
          plainTextAB 
          )
          .catch(function (err) {
            console.error(err);
          });
          let encryptedDataWithPlainIV={iv:this.ab2str(iv),body:this.ab2str(encrypteText)}
        return encryptedDataWithPlainIV
      }



/*decrypts received messaged with AES key
*/
/**
 * Decrypts a message using the AESkey with a given initial vector
 * @param {Object} messageAndIVObject Object containing the encrypted message (body:) and iv (:iv)
 * @returns Dectrypted message as string
 */
      async decryptMessageWithAES(messageAndIVObject){
        let IV = messageAndIVObject.iv;
        
        let decryptedMessage = await window.crypto.subtle.decrypt(
          {
            name: "AES-CBC",
            iv: this.str2ab(IV)
          },
          this.AESKey,
          this.str2ab(messageAndIVObject.body)
          )
        return this.ab2str(decryptedMessage)
          
        }
        
        
        /**
         * Encrypts a file using the the AES key and CBC.
         * @param {string} key The key to encrypt the message 
         * @param {string} plainText The text to encrypt 
         * @returns Encrypted text as string
        */
       async encryptFileWithAESKey(plainText) {
        let  iv =this.createIV();
        let encrypteText = await window.crypto.subtle.encrypt(
          {
            name: "AES-CBC",
            iv: iv,
          },
          this.AESKey, 
          plainText 
          )
          .catch(function (err) {
            console.error(err);
          });
          let encryptedDataWithPlainIV={iv:this._arrayBufferToBase64(iv),body:this._arrayBufferToBase64(encrypteText)}
          return encryptedDataWithPlainIV
        }
        



        
    async decryptFileWithAES(messageAndIVObject){
      
      let IV = await this.base64ToArrayBuffer(messageAndIVObject.iv);
      
      
      // Calling randomBytes method without callback
      let decryptedMessage = "default"
      
      try {
        
        decryptedMessage = await window.crypto.subtle.decrypt(
          {
            name: "AES-CBC",
            iv: IV
          },
          this.AESKey,
          this.base64ToArrayBuffer(messageAndIVObject.body)
          )
          
        }
        catch (e) {}
          return (this.ab2str(decryptedMessage))
            
          }
    bin2String(array) {
    var result = "";
    for (var i = 0; i < array.length; i++) {
      result += String.fromCharCode(parseInt(array[i], 2));
    }
    return result;
  }
          
    string2Bin(str) {
      var result = [];
      for (var i = 0; i < str.length; i++) {
        result.push(str.charCodeAt(i).toString(2));
      }
      return result;
    }

    _arrayBufferToBase64( buffer ) {
      var binary = '';
      var bytes = new Uint8Array( buffer );
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
      }
      return window.btoa( binary );
    }

  createIV() {
    const array = new Uint8Array(16);
    let iv=self.crypto.getRandomValues(array);
    console.log(iv)
    return iv
  }



  base64ToArrayBuffer(base64) {
      var binary_string =  window.atob(base64);
      var len = binary_string.length;
      var bytes = new Uint8Array( len );
      for (var i = 0; i < len; i++)        {
          bytes[i] = binary_string.charCodeAt(i);
      }
      console.log("base64 to bugger length: " +bytes.buffer.byteLength )
      return bytes.buffer;
  }


}
        
export default keyManager;
        