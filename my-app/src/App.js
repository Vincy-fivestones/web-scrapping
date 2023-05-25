import React, { useState } from "react";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from "axios";

function App() {
  const [urls, setUrls] = useState("");

  console.log("");
  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("/scrape", { urls: urls }, { responseType: 'arraybuffer' })
      .then((response) => {
        // Create a link to the file and click it to trigger the download
        const url = window.URL.createObjectURL(new Blob([response.data]), { type: 'application/zip' });
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "archive.zip");
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "3rem" }}>
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
