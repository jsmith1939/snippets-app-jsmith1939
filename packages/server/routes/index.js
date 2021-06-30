import express from 'express'
import authRouter from './auth'
import userRouter from './users'
import postRouter from './posts'
import activityRouter from './activity'
import User from '../models/user'

const router = express.Router()

router.get('/', (req, res, next) => {
  res.status(200).send('api endpoint')
})

router.use('/auth', authRouter)
router.use('/users', userRouter)
router.use('/posts', postRouter)
router.use('/activity', activityRouter)

router.get('/alice', async (req, res) => {
  try {
    const alice = await User.findOne({username: 'alice'})
    res.status(200).json(alice)
    
  } catch (error) {
    res.status(500).json(error)
  }
});

router.get('/top', async (req, res) => {
  try {
    let userPost = await User.find({});
    userPost = userPost.sort((a, b) => b.posts.length - a.posts.length).slice(0, 3);
    res.status(200).json(userPost)
    
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
  // hey
  
});

module.exports = router
