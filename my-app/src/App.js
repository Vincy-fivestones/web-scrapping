import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Alert, { AlertColor } from '@mui/material/Alert';
import Button from '@mui/material/Button';
import axios from 'axios';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Form></Form>
    </QueryClientProvider>
  );
}

function Form() {
  const queryClient = useQueryClient();
  const [urls, setUrls] = useState('');
  const [msg, setMsg] = useState({ type: 'info', message: '' });

  console.log('');
  const transfer = async () => {
    const response = await axios.post(
      '/scrape',
      { urls: urls },
      { responseType: 'arraybuffer' },
    );
    return response;
  };

  const mutation = useMutation(transfer, {
    onError: (error, variables, context) => {
      // An error happened!
      console.log(new TextDecoder('utf-8').decode(error.response.data));
      setMsg({
        type: 'error',
        message: new TextDecoder('utf-8').decode(error.response.data),
      });
    },
    onSuccess: (data, variables, context) => {
      const url = window.URL.createObjectURL(new Blob([data.data]), {
        type: 'application/zip',
      });
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'scrapped_files.zip');
      document.body.appendChild(link);
      link.click();
      setMsg({ type: 'success', message: 'Scrapped successfully' });
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (urls.length > 0) {
      mutation.mutateAsync();
    } else {
      setMsg({ type: 'warning', message: 'Please enter at least 1 url' });
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '3rem' }}>
      {msg.message && (
        <Alert
          severity={msg.type}
          onClose={() => {
            setMsg({ type: 'info', message: '' });
          }}
        >
          {msg.message}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" gutterBottom>
          Web Scraping Tool
        </Typography>
        <TextField
          label="Enter URLs (one per line)"
          multiline
          rows={10}
          variant="outlined"
          fullWidth
          value={urls}
          onChange={(event) => setUrls(event.target.value)}
        />
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Scrape
        </Button>
      </form>
    </Container>
  );
}

export default App;
