# Google Maps Embed Scraper

![npm version](https://img.shields.io/npm/v/google-maps-embed-scraper?style=flat-square)
![license](https://img.shields.io/npm/l/google-maps-embed-scraper?style=flat-square)
![downloads](https://img.shields.io/npm/dt/google-maps-embed-scraper?style=flat-square)

A lightweight, zero-dependency Node.js library to convert Google Maps URLs into standard embeddable iframe URLs.

**No API Key Required.**

## Features

- Scrapes the public redirect chain to extract location data.
- Supports All Formats: 
    - Short URLs: `https://maps.app.goo.gl/...`
    - Long URLs: `https://www.google.com/maps/place/...`
- Extremely lightweight. Uses native `fetch` (Node 18+).
- No data logging, just pure URL conversion.

## Installation

```bash
npm install google-maps-embed-scraper
```

## Important: Backend Usage Only
Due to CORS restrictions in browsers, you cannot use this library directly in a frontend app (React, Vue, etc.) to scrape short URLs (e.g., `maps.app.goo.gl`). Google will block the request.

**Solution:** Use this library in your Node.js backend (API), and send the result to your frontend.

## Usage

Backend - 
```javascript
import { getEmbedUrl } from "google-maps-embed-scraper";

app.get("/api/embed", async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ error: "URL parameter are required" });
        }
        const response = await getEmbedUrl(url);
        res.json(response);
    } catch (error) {
        console.error("Error fetching embed URL:", error);
        res.status(500).json({ error: "Failed to fetch embed URL" });
    }
});
```

Frontend -

```jsx
// React Example
import { useState, useEffect } from "react";

const MapPreview = ({ url }) => {
  const [embedSrc, setEmbedSrc] = useState(null);

  useEffect(() => {
    fetch(`/api/embed?url=${encodeURIComponent(url)}`)
      .then(res => res.json())
      .then(data => setEmbedSrc(data.embed));
  }, [url]);

  if (!embedSrc) return null;

  return (
    <iframe
      src={embedSrc}
      width="100%"
      height="450"
      style={{ border: 0 }}
      loading="lazy"
    />
  );
};
```

## API

getEmbedUrl(url)

**Parameters:**
- `url` (string): The Google Maps URL. Can be a short link (`maps.app.goo.gl`) or a full link.

**Response:**

```javascript
{
  original: "https://maps.app.goo.gl/...",   // The input URL
  expanded: "https://www.google.com/...",    // The resolved long URL
  embed: "https://maps.google.com/...",      // The final iframe source
  details: {
    placeName: "Statue Of Unity",            // Extracted Place Name
    lat: "21.8384759",                       // Latitude
    lng: "73.7167201"                        // Longitude
  }
}
```



## Why use this?
If you want to embed a map dynamically based on a user-pasted link (like `maps.app.goo.gl`), you usually need the Google Place Details API, which costs money and requires an API Key. 

This tool works by parsing the URL structure of Google Maps. It is not an official Google product and relies on the public URL format remaining consistent. Use responsibly.

## License
MIT © [Shreyash Swami](https://github.com/Shreyash0712)
