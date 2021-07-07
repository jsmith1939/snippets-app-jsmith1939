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
    setFile(e.target.files[])
  }
};

export default FileUploader;