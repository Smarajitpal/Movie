const express = require("express");
const cors = require("cors");
const app = express();

const { initializeDatabase } = require("./db/db.connection");
const { Movies } = require("./models/movies.model");

app.use(express.json());
const corsOptions = {
  origin: "*",
  Credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

initializeDatabase();

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.get("/movies", async (req, res) => {
  try {
    const allMovies = await Movies.find();
    res.status(200).json(allMovies);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/movies", async (req, res) => {
  const { movieTitle, director, genre } = req.body;
  try {
    const movie = new Movies({ movieTitle, director, genre });
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/movies/:id", async (req, res) => {
  const movieId = req.params.id;
  try {
    const deletedMovie = await Movies.findByIdAndDelete(movieId);
    if (!deletedMovie) {
      res.status(404).json({ error: "Movie not found" });
    }
    res
      .status(200)
      .json({ message: "Movie deleted Successfully", movie: deletedMovie });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
