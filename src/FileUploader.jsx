import React, {useState, useContext} from 'react';
import keyManager from "./keyManager";
// import { saveAs } from 'file-saver';
import {ConnectionContext} from "./ConnectionContext";



function FileUploadPage({keys,room,handleSubmit, messageID}){
	const [selectedFile, setSelectedFile] = useState();
  const [loading, setLoading] = useState("false");
  let {connection,setConnection}=useContext(ConnectionContext);
  let keymanager=new keyManager(keys)

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
//https://dilshankelsen.com/convert-file-to-byte-array/
  function readFile(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader()

      reader.addEventListener("loadend", e => resolve(e.target.result))
      reader.addEventListener("error", reject)
      reader.readAsArrayBuffer(file)
    })
  }
    async function handleSubmission(event){
      event.preventDefault()
        if(!selectedFile){
          alert("choose a file")
          return
        }
      const url ="http://77.33.131.228:3000/api/databaseapi/upload"
      setLoading("true")
    let nameArraySplit=selectedFile.name.split(".")
    let extention=nameArraySplit.slice(-1)
    let BAFile=await getAsByteArray(selectedFile)
    console.log(BAFile+ "BA file")

    let encrypted= await keymanager.encryptFileWithAESKey(BAFile)
    console.log("encrypted... " + JSON.stringify(encrypted))
    // console.log("BAfile base64: " + keymanager._arrayBufferToBase64(BAFile)) 
    

        
      //let encryptedByteFile= await new Blob([encryptedFileString], { type: extension });
     // encryptedByteFile = await getAsByteArray(encryptedByteFile)
    // await connection.invoke("SendMessage", encrypted)
    let bodyData={
      "file":encrypted.body, 
      "extention" : extention, 
      "name":selectedFile.name, 
      "id":room+messageID,
      "iv":encrypted.iv, 
      "room":room,
    "isFile":true}
      await handleSubmit(true,
        bodyData  
        );
    console.log(bodyData)
    let result =await fetch(url,{
      method: "POST", 
      // mode: "cors",
      headers: {
        "Content-Type": "multipart/form-data",
        },
      body:JSON.stringify( bodyData)
      })
      setLoading("false")
      console.log(result.text+ "Result")
      // handleSubmit(bodyData)
    }

    async function handleDownload(){
      const url = "http://77.33.131.228:3000/api/databaseapi/"+id
      let result = await fetch(url, {
        method: "GET" // default, so we can ignore
    })
      .then(result => result.json())
    console.log("result: " + JSON.stringify(result))
    console.log("decrypt" + await keymanager.decryptFileWithAES(result)+"decrypted")
    let utf8Encode = new TextEncoder();
    let  fileByteArray=    utf8Encode.encode(decryptedResult.data);
    var blob = new Blob([fileByteArray], { type: decryptedResult.extension });
    saveAs(blob, 'test'+decryptedResult.extension)
    }
 
    function handleChange(event) {
        console.log(event.target.files[0])
        setSelectedFile(event.target.files[0])
      }

     function _arrayBufferToBase64( buffer ) {
        var binary = '';
        var bytes = new Uint8Array( buffer );
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
          binary += String.fromCharCode( bytes[ i ] );
        }
        return window.btoa( binary );
      }



	return(
   <div>
			<input type="file" name="file" onChange={handleChange} />
			<div>
      <b>{loading ==="true" ? 'File is being uploaded ' : ''}</b> 
				<button onClick={handleSubmission}>Submit</button>
        <br></br>
        <button onClick={handleDownload}>download</button>
			</div>
		</div>
	)
}

export default FileUploadPage;