import React, {useState} from 'react';
import keyManager from "./keyManager";
// import { saveAs } from 'file-saver';



function FileUploadPage({keys,room,handleSubmit}){
	const [selectedFile, setSelectedFile] = useState();
  const [loading, setLoading] = useState("false");
  let keymanager=new keyManager(keys)

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
        console.log(selectedFile)
      const url ="https://77.33.131.228:3000/api/databaseapi/upload"
      setLoading("true")
      let nameArraySplit=selectedFile.name.split(".")
      let extention=nameArraySplit.slice(-1)
      let encryptedFileString =keymanager.encryptDataWithAESKey(selectedFile)
      let encryptedByteFile=new Blob([encryptedFileString], { type: extention });
      encryptedByteFile = await getAsByteArray(encryptedByteFile)
       let bodyData={
          "file":encryptedByteFile, 
          "extention" : extention, 
          "name":selectedFile.name, 
          "iv":encryptedFileString.iv, 
          "room":room}
       let result =await fetch(url,{
          method: "POST", 
          // mode: "cors",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: bodyData
        /*
        // body: {
          "fileContent" : 
          "extention" :
          "iv" : 
        }
      */
        })
        setLoading("false")
        console.log(result.text+ "Result")
    }


    async function handleDownload(){
      const url = "https://77.33.131.228:3000/api/databaseapi/10"
      let result = await fetch(url, {
        method: "GET" // default, so we can ignore
    })

    .then(result => result.json())

    let iv=result.text.iv
    let decryptedResult=keymanager.decryptMessageWithAES({"body":result.text, "iv":iv} )
    let utf8Encode = new TextEncoder();
    let  fileByteArray=    utf8Encode.encode(decryptedResult.data);
    var blob = new Blob([fileByteArray], { type: decryptedResult.extension });
    saveAs(blob, 'test'+decryptedResult.extension)
    }

    function handleChange(event) {
        console.log(event.target.files[0])
        setSelectedFile(event.target.files[0])
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