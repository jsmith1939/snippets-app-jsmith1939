import express from 'express';
import muler from 'muler';
import {User} from '../models';
import {requireAuth} from '../middleware';

const router = require('express')