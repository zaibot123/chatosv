import React, {useState} from 'react';

function FileUploadPage(){
	const [selectedFile, setSelectedFile] = useState();

   
    async function handleSubmission(event){
        console.log(selectedFile)
        console.log("FILES")
        event.preventDefault()
       // const url = 'http://localhost:5000/uploadFile';
      let formData = new FormData();
       formData.append('File', String(selectedFile));
       formData.append('name', selectedFile.name);
       setSelectedFile();
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