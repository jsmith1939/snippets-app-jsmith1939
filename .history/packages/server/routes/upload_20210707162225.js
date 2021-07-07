import express from 'express';
import multer from 'multer';
import {User} from '../models';
import {requireAuth} from '../middleware';

const router = express.Router();

const storage = multer.diskStorage({
  destination: '../client/public', filename: (req, file, cb) => {
    cb(null, "IMAGE-" + Date.now() + file.originalname);
  }
});

const upload = multer ({
  storage: storage,
  limits: {fileSize: 200000}
});

router.get('/', (req, res) => {
  res.send('upload endpoint working')
});

router.post{'/', upload.single('file'), requireAuth, async (req, res) => {
  const {user} = req;
  try {
    console.log(req.file)
    const url = `./${}`
  } catch (error) {
    
  }
}}