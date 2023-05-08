import React, {useState} from 'react';
// import { saveAs } from 'file-saver';

function FileUploadPage(){
	const [selectedFile, setSelectedFile] = useState();
  const [loading, setLoading] = useState("false");

  async function getAsByteArray(file) {
    return new Uint8Array(await readFile(file))
  }
//https://dilshankelsen.com/convert-file-to-byte-array/
  function readFile(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader()
      //ENCRYPT
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
      const byteFile = await getAsByteArray(selectedFile)
       let bodyData={"file":byteFile, "name":selectedFile.name, }
       let result =await fetch(url,{
          method: "POST", 
          mode: "cors",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: JSON.stringify(bodyData)
        })
        setLoading("false")
        console.log(result.text+ "Result")
    }

    async function handleDownload(){
      const url = "http://77.33.131.228:3000/api/databaseapi/10"
      let result = await fetch(url, {
        method: "GET" // default, so we can ignore
    })

    //DECRYPT
    .then(result => result.json())
    let utf8Encode = new TextEncoder();
    let  fileByteArray=    utf8Encode.encode(result.data);
    var blob = new Blob([fileByteArray], { type: result.extension });
    saveAs(blob, 'test'+result.extension)
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