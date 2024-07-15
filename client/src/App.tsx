import { useState } from 'react';
import './App.css';
import { Dropzone, ExtFile, FileMosaic } from '@dropzone-ui/react';


function App() {
  let [file, setFile] = useState<ExtFile[]|undefined>([]);
  const [error, setError] = useState('');
  const [responseData, setResponseData] = useState('');

  const handleFileChange = (files:any) => {
    const selectedFile = files;
    
    if (selectedFile) {
      // Check file size (example: limit to 2MB)
      const maxSize = 2 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        setError('File size exceeds the limit of 2MB');
        setFile(undefined);
        return;
      }
      
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    if (!file) {
      setError('No file selected');
      return;
    }
    try {
      const formData = new FormData();
      formData.set("genURL",file[0].file as File)

      const response = await fetch(import.meta.env.VITE_FILE_STORAGE_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const result = await response.json();
      file=undefined
      setResponseData(result.data);
     
    } catch (err:any) {
      setError(err.message);
    }
  };
  const handleCopyUrl = () => {
    if (responseData) {
      navigator.clipboard.writeText(responseData)
        .then(() => alert('URL copied to clipboard'))
        .catch(err => console.error('Failed to copy URL', err));
    }
  };

  return (
    <div id="root">
      <header>
        <img src="https://static.vecteezy.com/system/resources/previews/015/152/952/original/url-icon-design-for-web-interfaces-and-applications-png.png" alt="Link Icon" className="header-logo" />
        <h1>genURL</h1>
        <p>Upload your files and get a TinyURL to share with others!</p>
      </header>
      <div className="file-upload-container">
        <h2>Upload Your File</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Dropzone
            onChange={handleFileChange}
            value={file}
          >
            {file&&file.map((file:any) => (
                <FileMosaic key={file.id} {...file} onDelete={handleFileChange} info preview darkMode/>
              ))}
          </Dropzone>
          <br/>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="upload-button">Upload</button>
        </form>
        {responseData && (
          <div className="response-container">
            <p>Your TinyURL: <a href={responseData}>{responseData}</a></p>
            <button className="upload-button" onClick={handleCopyUrl} >Copy URL</button>
          </div>
        )}
      </div>
      <footer>
        <p>&copy; 2024 genURL. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
