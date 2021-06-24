import React, { useState, useEffect } from 'react'
import {
  Container,
  Card,
  Form,
  Button,
  Collapse,
  Figure
} from 'react-bootstrap'
import { LoadingSpinner, Post } from 'components'
import { useProvideAuth } from 'hooks/useAuth'
import { useRequireAuth } from 'hooks/useRequireAuth'
import axios from 'utils/axiosConfig.js'
import { toast } from "react-toastify";
import Avatar from '../components/Avatar'

export default function UserDetailPage({
  match: {
    params: { uid },
  },
  history
}) {
  const [profileImage, setProfileImage] = useState('')
  const { state } = useProvideAuth()
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true)
  const [validated, setValidated] = useState(false)
  const [open, setOpen] = useState(false)
  const [show, setShow] = useState(false)
  const [data, setData] = useState({
    confirmPassword: '',
    currentPassword: '',
    password: '',
    isSubmitting: false,
    errorMessage: null,
  })

  const {
    state: { isAuthenticated },
  } = useRequireAuth()

  useEffect(() => {
    const getUser = async () => {
      try {
        const userResponse = await axios.get(`users/${uid}`)
        setUser(userResponse.data)
        setLoading(false)
      } catch (err) {
        console.error(err.message)
      }
    }
    isAuthenticated && getUser()
  }, [uid, isAuthenticated])

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    })
  }
  
  const handleAvatar = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    const {
      user: { uid },
    } = state
    console.log(uid)
    await axios.patch(`/users/${uid}`, {
      profile_image: profileImage
    })
  }

  const handleProfileImage = (image) => {
    setProfileImage(image)
  }

  const handleUpdatePassword = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    const form = event.currentTarget
    // handle invalid or empty form
    if (form.checkValidity() === false) {
      setValidated(true)
      return
    }
    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null,
    })
    try {
      // write code to call edit user endpoint 'users/:id'
      const {
        user: { uid, username },
      } = state
      console.log(data.password, uid, username)
      axios.put(`/users/${uid}`, {
        password: data.password,
        profile_image: profileImage
        
      })
      setValidated(false)
      history.push('/')
      // don't forget to update loading state and alert success
    } catch (error) {
      setData({
        ...data,
        isSubmitting: false,
        errorMessage: error.message,
      })
    }
  }

  if (!isAuthenticated) {
    return <LoadingSpinner full />
  }

  if (loading) {
    return <LoadingSpinner full />
  }

  return (
    <>
    <Container className='clearfix'>
      <Button variant='outline-info' onClick={()=>{history.goBack()}}
        style={{border:'none', color: '#E5E1DF'}}
        className="mt-3 mb-3"
        >
        Go Back
      </Button>
      <Card bg='header' className='text-center'>
        <Card.Body>
          <Figure
            className='bg-border-color rounded-circle overflow-hidden my-auto ml-2 p-1'
            style={{
              height: '50px',
              width: '50px',
              backgroundColor: 'white',
            }}
          >
            <Figure.Image
              src={user.profile_image}
              className='w-100 h-100'
            />
          </Figure>
          <Card.Title>{user.email}</Card.Title>
          <Card.Title>{uid}</Card.Title>
          {state.user.username === uid && (
            <div onClick={() => setOpen(!open)} style={{cursor: 'pointer', color: '#BFBFBF'}}>Edit Password</div>
          )}
          
          { open && (
            <Container animation="false">
              <div className='row justify-content-center p-4'>
                <div className='col text-center'>
                  <Form
                    noValidate
                    validated={validated}
                    onSubmit={handleUpdatePassword}
                  >
                    <Form.Group>
                      <Form.Label htmlFor="currentPassword">Enter Current Password</Form.Label>
                      <Form.Control
                        type='password'
                        name='currentPassword'
                        required
                        validated={validated}
                        value={data.currentPassword}
                        onChange={handleInputChange}
                      />
                      <Form.Label htmlFor='password'>New Password</Form.Label>
                      <Form.Control
                        type='password'
                        name='password'
                        required
                        value={data.password}
                        onChange={handleInputChange}
                      />
                      <Form.Label htmlFor="confirmPassword">Enter Current Password</Form.Label>
                      <Form.Control
                        type='password'
                        name='confirmPassword'
                        required
                        validated={validated}
                        value={data.confirmPassword}
                        onChange={handleInputChange}
                      />
                      <Form.Control.Feedback type='invalid'>
                        New Password is required
                      </Form.Control.Feedback>
                      <Form.Text id='passwordHelpBlock' muted>
                        Must be 8-20 characters long.
                      </Form.Text>
                    </Form.Group>

                    {data.errorMessage && (
                      <span className='form-error'>{data.errorMessage}</span>
                    )}
                    <Button type='submit' disabled={data.isSubmitting}>
                      {data.isSubmitting ? <LoadingSpinner /> : 'Update'}
                    </Button>
                  </Form>
                </div>
              </div>
            </Container>
          )}

          {state.user.username === uid && (
            <div onClick={() => setShow(!show)} style={{cursor: 'pointer', color: '#BFBFBF'}}>Edit Avatar</div>
          )}
          {show && (
            <Container animation="false">
              <Avatar picker={handleProfileImage} selectedImg = {profileImage}/>
              <Form
                noValidate
                validated={validated}
                onSubmit={handleAvatar}>
                <Button type='submit' disabled={data.isSubmitting}>
                {data.isSubmitting ? <LoadingSpinner /> : 'Update'}
              </Button>
              </Form>
              
            </Container>
          )}
        </Card.Body>
      </Card>
    </Container>
    <Container
      className='pt-3 pb-3'
    >
      {user.posts.length !== 0 ? (
        user.posts.map((post) => <Post key={post._id} post={post} userDetail/>)
      ) : (
        <div
          style={{
            marginTop: '75px',
            textAlign: 'center',
          }}
        >
          No User Posts
        </div>
      )}
    </Container>
    </>
  )
}
