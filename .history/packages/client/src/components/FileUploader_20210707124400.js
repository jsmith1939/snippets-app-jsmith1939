import useState from 'react';
import {Form, Button} from 'react-bootstrap';
import axios from '../utils/axiosConfig';
import toast from 'react-toastify';

const FileUploader = () =>{
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      let success = await axios.post('upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data'}
      });

      if (success) {
        toast.success('Avatar uploaded successfully');
        localStorage.setItem('MernAppUser', JSON.stringify(success.user));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdate = (e) => {
    setFile(e.target.files[0]);
    console.log(e.target.files[0]);
    console.log(file)
  };

  return (
    <Form onSubmit={(e) => handleSubmit(e)}>
      <h4>Upload Your Avatar</h4>
      <input className='FileUpload' type='file' name='file' required onChange={(e) => handleChange(e)}
    </Form>
  )
};

export default FileUploader;