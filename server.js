import express from "express";
import cors from "cors";
import axios from "axios";
import * as cheerio from "cheerio";

const app = express();
const port = 3001;

app.use(cors());

app.get("/scrape", async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  console.log(`Attempting to scrape: ${url}`);

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });
    console.log("Response received from target website");

    const $ = cheerio.load(response.data);
    const workouts = [];

    $(".workout-day").each((_, element) => {
      const name = $(element).find("h3").text().trim();
      const duration = $(element).find(".workout-duration").text().trim();
      const activities = [];

      $(element)
        .find(".workout-step-description")
        .each((_, step) => {
          activities.push({
            description: $(step).text().trim(),
          });
        });

      workouts.push({ name, duration, activities });
    });

    console.log(`Scraped ${workouts.length} workouts`);
    res.json(workouts);
  } catch (error) {
    console.error("Error scraping workouts:", error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      res.status(error.response.status).json({
        error: `Server responded with status ${error.response.status}: ${error.response.statusText}`,
        details: error.response.data,
      });
    } else if (error.request) {
      // The request was made but no response was received
      res
        .status(503)
        .json({ error: "No response received from the target server" });
    } else {
      // Something happened in setting up the request that triggered an Error
      res.status(500).json({ error: error.message });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
