import React, {useState} from 'react';

function FileUploadPage({keymanager,room}){
	const [selectedFile, setSelectedFile] = useState();

   
    async function handleSubmission(event){
      event.preventDefault()
       const url = 'http://77.33.131.228:3000/api/databaseapi/18'
      let formData = new FormData();
      let split_file_name_by_dot=selectedFile.name.split(".");
      let extension=split_file_name_by_dot.slice(-1)
      console.log(keymanager.AESKey)
      let encryptedFile=await window.crypto.subtle.encrypt(AesCbcParams, keymanager.AESKey, selectedFile)
      let encryptedFileName=await window.crypto.subtle.encrypt(AesCbcParams, keymanager.AESKey, selectedFile.name)
       formData.append('File', String(encryptedFile));
       formData.append('name', selectedFile.name);
       formData.append('extension',extension)
       formData.append('room',room)
       setSelectedFile();
       for (var pair of formData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]); 
    }
       
       console.log(formData)
       let response1 = await fetch(url,
        {
            Method: "POST",
            headers: {
                'content-type': 'multipart/form-data',
              },
            Body: formData,
            Cache: 'default'
          });
          if (response1.status===200){
            alert("file uploaded")
          }

    }

    async function downloadFile(){
      const url ="http://77.33.131.228:3000/api/databaseapi/18"
      let responseDownload = await fetch(url,
        {
            Method: "GET",
            headers: {
                'content-type': 'multipart/form-data',
              },
            Body: formData,
            Cache: 'default'
          });
          if (responseDownload.status===200){
      //      let encryptedFile= responseDownload.text
            console.log(responseDownload.text)
            alert("file uploaded")
          }


    }

    function handleChange(event) {
        console.log(event.target.files[0])
        setSelectedFile(event.target.files[0])
      }

	return(
   <div>
			<input type="file" name="file" onChange={handleChange} />
			<div>
				<button onClick={handleSubmission}>Submit</button>
			</div>
		</div>
	)
}

export default FileUploadPage;