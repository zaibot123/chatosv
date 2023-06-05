import React, { useState, useContext } from 'react';
import keyManager from "./keyManager";
// import { saveAs } from 'file-saver';
import { ConnectionContext } from "./ConnectionContext";



function FileUploadPage({ keys, room, handleSubmit, messageId }) {
  const [selectedFile, setSelectedFile] = useState();
  const [loading, setLoading] = useState("false");
  let { connection, setConnection } = useContext(ConnectionContext);
  let keymanager = new keyManager(keys)

  function bin2String(array) {
    var result = "";
    for (var i = 0; i < array.length; i++) {
      result += String.fromCharCode(parseInt(array[i], 2));
    }
    return result;
  }
  async function getAsByteArray(file) {
    return new Uint8Array(await readFile(file))
  }
  function readFile(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader()

      reader.addEventListener("loadend", e => resolve(e.target.result))
      reader.addEventListener("error", reject)
      reader.readAsArrayBuffer(file)
    })
  }

  /**
   * 
   */
  async function handleSubmission(event) {
    event.preventDefault()
    if (!selectedFile) {
      alert("choose a file")
      return
    }
    const url = "http://77.33.131.226:3000/api/databaseapi/upload"
    setLoading("true")
    let nameArraySplit = selectedFile.name.split(".")
    let extention = nameArraySplit.slice(-1)

    let BAFile = await getAsByteArray(selectedFile)

    console.log(BAFile + "BA file")

    let encrypted = await keymanager.encryptFileWithAESKey(BAFile)
    const blob1 = new Blob([encrypted.body])
    console.log("encrypted... " + JSON.stringify(encrypted))


    let bodyData2 = {
      "file": encrypted.body,
      "extention": String(extention),
      "name": selectedFile.name,
      "id": room + messageId,
      "iv": encrypted.iv,
      "room": room,
      "isFile": true
    }

    var jsonstring = JSON.stringify(bodyData2)
    console.log(jsonstring)
    var blob2 = new Blob([jsonstring], { type: "application/pdf" });

    let bodyData = {
      // "file":encrypted.body, 
      "file": "geh",
      "test": URL.createObjectURL(blob1),
      "extention": String(extention),
      "name": selectedFile.name,
      "id": room + messageId,
      "iv": encrypted.iv,
      "room": room,
      "isFile": true
    }
    await handleSubmit(true,
      bodyData
    );
    console.log(bodyData.file)


    let result = await fetch(url, {
      method: "POST",
      // mode: "cors",
      body: blob2
    })
    setLoading("false")
    console.log(await blob2.type + "Result")
  }

  async function handleDownload() {
    const url = "http://77.33.131.226:3000/api/databaseapi/" + id
    let result = await fetch(url, {
      method: "GET" // default, so we can ignore
    })
      .then(result => result.json())
    console.log("result: " + JSON.stringify(result))
    console.log("decrypt" + await keymanager.decryptFileWithAES(result) + "decrypted")
    let utf8Encode = new TextEncoder();
    let fileByteArray = utf8Encode.encode(decryptedResult.data);
    var blob = new Blob([fileByteArray], { type: decryptedResult.extension });
    saveAs(blob, 'test' + decryptedResult.extension)
  }

  function handleChange(event) {
    console.log(event.target.files[0])
    setSelectedFile(event.target.files[0])
  }

  function _arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }



  return (
    <div>
      <input type="file" name="file" onChange={handleChange} />
      <div>
        <b>{loading === "true" ? 'File is being uploaded ' : ''}</b>
        <button onClick={handleSubmission}>Submit</button>
        <br></br>
        <button onClick={handleDownload}>download</button>
      </div>
    </div>
  )
}

export default FileUploadPage;