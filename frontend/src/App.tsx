import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, Fab, Modal, TextField, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useForm, Controller } from 'react-hook-form';
import { backend } from 'declarations/backend';

interface Post {
  id: bigint;
  title: string;
  body: string;
  author: string;
  timestamp: bigint;
}

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [open, setOpen] = useState(false);
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await backend.getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const onSubmit = async (data: { title: string; body: string; author: string }) => {
    try {
      await backend.createPost(data.title, data.body, data.author);
      setOpen(false);
      reset();
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          backgroundImage: 'url(https://loremflickr.com/g/1200/400/cryptocurrency?lock=123)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h2" component="h1" sx={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          Crypto Blog
        </Typography>
      </Box>

      <Container maxWidth="md">
        {posts.map((post) => (
          <Card key={Number(post.id)} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h5" component="h2">
                {post.title}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                By {post.author} | {new Date(Number(post.timestamp) / 1000000).toLocaleString()}
              </Typography>
              <Typography variant="body1">{post.body}</Typography>
            </CardContent>
          </Card>
        ))}

        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setOpen(true)}
        >
          <AddIcon />
        </Fab>

        <Modal open={open} onClose={() => setOpen(false)}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
              Create New Post
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="title"
                control={control}
                defaultValue=""
                rules={{ required: 'Title is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Title"
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
              <Controller
                name="body"
                control={control}
                defaultValue=""
                rules={{ required: 'Body is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Body"
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
              <Controller
                name="author"
                control={control}
                defaultValue=""
                rules={{ required: 'Author is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Author"
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                Submit
              </Button>
            </form>
          </Box>
        </Modal>
      </Container>
    </Box>
  );
};

export default App;
