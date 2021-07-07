import express from 'express';
import multer from 'multer';
import {User} from '../models';
import {requireAuth} from '../middleware';

const router = express.Router();

const storage = multer.diskStorage({
  destination: '../client/public', filename: (req, file, cb) => {
    cb(null, "IMAGE-")
  }
})