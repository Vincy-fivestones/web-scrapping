import React, { useState } from "react";
import { TextField, Button, Typography, Container } from "@material-ui/core";
import axios from "axios";

function App() {
  const [urls, setUrls] = useState("");

  console.log("");
  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("/scrape", { urls: urls })
      .then((response) => {
        // Create a link to the file and click it to trigger the download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "scraped_content.txt");
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
