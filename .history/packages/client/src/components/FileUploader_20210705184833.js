import useState from 'react';
import {Form, Button} from 'react-bootstrap';
import axios from '../utils/axiosConfig';
import toast from 'react-toastify';

const fileUploader = () =>{
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const formData = new FormData();
    formData.append('file', file);
    
    try
  }
};