 import React, { useState, useEffect } from 'react'
import { Container, Form, Button, FormControl } from 'react-bootstrap';
import axios from 'utils/axiosConfig.js';
import { Post } from 'components';
import LoadingSpinner from 'components/LoadingSpinner';
import { useProvideAuth } from 'hooks/useAuth';
import { toast } from 'react-toastify';
// import data from "./data.json";
// import Item from "./item";
import Fuse from 'fuse.js';

const initialState = {
  postText: '',
  isSubmitting: false,
  errorMessage: null,
}
const initialSearch = {
  searchText: '',
  isSubmitting: false,
  errorMessage: null,
}

export default function Feed() {
  const {
    state: { user },
  } = useProvideAuth()
  const [posts, setPosts] = useState([])
  const [postLoading, setPostLoading] = useState(true)
  const [postError, setPostError] = useState(false)

  const [data, setData] = useState(initialState);
  const [validated, setValidated] = useState(false)
  // const [searchPost, setSearchPost] = useState('');
  const [filterSearch, setFilterSearch] = useState([]);
  const [filterData, setFilterData] = useState(initialSearch);
  const [userInput, setUserInput] = useState(false);

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    })
  }

  const handlePostSubmit = async (event) => {
    const form = event.currentTarget
    event.preventDefault()
    if (form.checkValidity() === false) {
      toast.error('Post text is required');
      setValidated(true)
      return
    }

    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null,
    })

    axios
      .post('/posts', {
        text: data.postText,
        author: user.username,
      })
      .then(
        (res) => {
          setData(initialState)
          setPosts((posts) => [
            {
              ...res.data,
              author: {
                username: user.username,
                profile_image: user.profile_image,
              },
            },
            ...posts,
          ])
          setValidated(false)
        },
        (error) => {
          setData({
            ...data,
            isSubmitting: false,
            errorMessage: error.message,
          })
        }
      )
  }

  // this function handles the searches for post history
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase()
    console.log(query)
    if (query) {
      setUserInput(true);
    } else {
      setUserInput(false);
    };

    const fuse = new Fuse(posts, { 
      keys: ["text", "author.username"]    
    });    

    const result = fuse.search(query);

    const searchResults = [];
    result.forEach((item) => {
      if (result && query) {
        console.log(item);
        searchResults.push(item.item);
      }
    });
    setFilterSearch(searchResults);
    setFilterData({
      ...filterData,
      [event.target.name]: event.target.value,
    })
  }

  useEffect(() => {
    const getPosts = async () => {
      try {
        const allPosts = await axios.get('posts')
        setPosts(allPosts.data)
        setPostLoading(false)
      } catch (err) {
        console.error(err.message)
        setPostLoading(false)
        setPostError(true)
      }
    }
    getPosts()
  }, [])

  return (
    <>
      <Container className='searchPost'>
        <FormControl
        type='search'
        placeholder='Search for Post'
        size='lg'
        aria-label='Search'
        value = {data.searchTag}
        onChange={handleSearch}
        name='searchTag'/>
        
      </Container>
      <Container className='pt-3 pb-3 clearfix'>
        <h4>Share a Snip</h4>
        <Form
          noValidate
          validated={validated}
          onSubmit={handlePostSubmit}
        >
          <Form.Control
            as='textarea'
            rows={3}
            maxLength='120'
            name='postText'
            placeholder="What's on your mind?"
            aria-describedby='post-form'
            size='lg'
            required
            value={data.postText}
            onChange={handleInputChange}
          />

          {data.errorMessage && (
            <span className='form-error'>{data.errorMessage}</span>
          )}
          <Button
            className='float-right mt-3'
            type='submit'
            disabled={data.isSubmitting}
          >
            {data.isSubmitting ? <LoadingSpinner /> : 'Post'}
          </Button>
        </Form>
      </Container>

      {!postLoading ? (
        <Container
          className='pt-3 pb-3'
        >
          <h6>Recent Snips</h6>
          {postError && 'Error fetching posts'}
          {posts &&
          userInput ? filterSearch.map((post) => <Post key={post._id} post={post} />)  : posts.map((post) => <Post key={post._id} post={post} />)}
        
        </Container>
      ) : (
        <LoadingSpinner full />
      )}
    </>
  )
}
